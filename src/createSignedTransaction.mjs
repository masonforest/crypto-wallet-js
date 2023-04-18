import {
  encodeAny,
  concatBytes,
  doubleSha256,
  addressToPublicKeyHash,
  encodeBytes,
  encodeCompactSizeUint,
  parseHex,
  bytesEqual,
} from "./utils.mjs";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";
import addressFromPublicKey from "./addressFromPublicKey.mjs";
import encodeTransaction from "./encodeTransaction.mjs";
import calculateFee from "./calculateFee.mjs";
import { SIGHASH_ALL, BASE_UNIT } from "./constants.mjs";
import standardTransactionScript from "./scripts/standardTransaction.mjs";
import { default as _ } from "lodash";
const { sumBy } = _;

export default async function createSignedTransaction({
  chainId,
  unspentTransationOutputs,
  recipientAddress,
  privateKey,
  value,
  fee,
  speed = "fast",
  minimumDust = BASE_UNIT / 10n,
}) {
  const inputs = unspentTransationOutputs;
  const inputAmount = BigInt(sumBy(inputs, "value"));
  const publicKey = await secp256k1.getPublicKey(privateKey, true);
  const changeAddress = await addressFromPublicKey(chainId, publicKey);
  const outputs = [
    {
      script: standardTransactionScript(
        addressToPublicKeyHash(recipientAddress)
      ),
      value,
    },
  ];
  fee ||= calculateFee({ inputs, outputs, speed });
  const changeAmount = inputAmount - value - fee;
  if (changeAmount > minimumDust) {
    outputs.push({
      script: standardTransactionScript(addressToPublicKeyHash(changeAddress)),
      value: changeAmount,
    });
  }
  let transaction = {
    chainId,
    inputs,
    outputs,
  };

  transaction.inputs = await Promise.all(
    transaction.inputs.map((input, inputIndex) =>
      signInput(input, inputIndex, transaction, privateKey)
    )
  );

  return encodeTransaction(transaction);
}

async function signInput(
  inputToSign,
  inputToSignIndex,
  transaction,
  privateKey
) {
  // Set the script of all the other inputs to empty arrays
  // ¯\_(ツ)_/¯
  // https://bitcoin.stackexchange.com/a/41226

  const signableTransaction = {
    ...transaction,
    inputs: transaction.inputs.map((input, inputIndex) => {
      if (inputIndex === inputToSignIndex) {
        return input;
      } else {
        return {
          ...input,
          script: new Uint8Array([]),
        };
      }
    }),
  };

  var messageHash = doubleSha256(
    encodeAny(encodeTransaction(signableTransaction), SIGHASH_ALL)
  );
  const signature = await secp256k1.sign(messageHash, privateKey, {
    canonical: true,
  });
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  return {
    ...inputToSign,
    script: concatBytes(
      encodeBytes(concatBytes(signature, encodeCompactSizeUint(SIGHASH_ALL))),
      encodeBytes(publicKey)
    ),
  };
}

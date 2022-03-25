import { concatBytes, doubleSha256, addressToPublicKeyHash} from "./utils.mjs";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";
import addressFromPublicKey from "./addressFromPublicKey.mjs";
import encodeTransaction from "./encodeTransaction.mjs";
import standardTransactionScript from "./scripts/standardTransaction.mjs";
import {default as _} from "lodash"
const {sumBy} = _
const SIGHASH_ALL = new Uint8Array([1, 0, 0, 0]);

export default async function createSignedTransaction({
  chainId,
  unspentTransationOutputs,
  recipientAddress,
  privateKey,
  value,
}) {
  const inputs = selectInputs(unspentTransationOutputs, value);
  const inputAmount = sumBy(inputs, "value")
  const publicKey = await secp256k1.getPublicKey(privateKey, true);
  console.log(publicKey)
  const changeAddress = await addressFromPublicKey(chainId, publicKey)
  console.log(changeAddress)
  const changeAmount = inputAmount - value
  const outputs = [
    {
      script: standardTransactionScript(addressToPublicKeyHash(changeAddress)),
      value,
    },
    {
      script: standardTransactionScript(addressToPublicKeyHash(changeAddress)),
      value,
    },
  ];
  const transaction = {
    chainId,
    inputs,
    outputs,
  };

  transaction.inputs = await Promise.all(
    transaction.inputs.map((input) => signInput(input, transaction, privateKey))
  );

  return encodeTransaction(transaction);
}

async function signInput(input, transaction, privateKey) {
  const unsignedTransaction = encodeTransaction(transaction);
  var messageHash = doubleSha256(concatBytes(unsignedTransaction, SIGHASH_ALL));
  const signature = await secp256k1.sign(messageHash, privateKey, {
    canonical: true,
  });
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  return {
    ...input,
    script: concatBytes(
      signature.length + 1,
      signature,
      new Uint8Array([1]),
      publicKey.length,
      publicKey
    ),
  };
}
function selectInputs(unspentTransationOutputs, value) {
  return unspentTransationOutputs;
}

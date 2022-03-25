import { concatBytes, doubleSha256 } from "./utils.mjs";
import { sha256 } from "@noble/hashes/sha256";
import * as secp256k1 from "@noble/secp256k1";
import encodeTransaction from "./encodeTransaction.mjs";
import standardTransactionScript from "./scripts/standardTransaction.mjs";
const SIGHASH_ALL = new Uint8Array([1, 0, 0, 0]);

export default async function createSignedTransaction({
  chainId,
  unspentTransationOutputs,
  recipientPublicKeyHash,
  privateKey,
  value,
}) {
  const inputs = selectInputs(unspentTransationOutputs, value);
  const outputs = [
    {
      script: standardTransactionScript(recipientPublicKeyHash),
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

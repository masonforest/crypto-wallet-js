const {
  concatBytes,
  doubleSha256
} = require("./utils");
const { sha256 } = require("@noble/hashes/sha256");
const secp256k1 = require("@noble/secp256k1");
const encodeTransaction = require("./encodeTransaction")
const standardTransactionScript = require("./standardTransactionScript");
const SIGHASH_ALL = new Uint8Array([1, 0, 0, 0])

module.exports = async function createSignedTransaction({
  chainId,
  unspentTransationOutputs,
  recipientPublicKeyHash,
  privateKey,
  value
}) { 
  const inputs = selectInputs(unspentTransationOutputs, value)
  const outputs = [{
      script: standardTransactionScript(recipientPublicKeyHash),
      value
  }]
  const unsignedTransaction = encodeTransaction({
    chainId,
    inputs,
    outputs,
  });
  var messageHash = doubleSha256(concatBytes(unsignedTransaction, SIGHASH_ALL))
  const signature = await secp256k1.sign(messageHash, privateKey, { canonical: true  })
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  const script = concatBytes(signature.length + 1, signature, new Uint8Array([1]), publicKey.length, publicKey)
  inputs[0].script = script
  return encodeTransaction({
    chainId,
    inputs,
    outputs,
  });
};

function selectInputs(unspentTransationOutputs, value) {
  return unspentTransationOutputs
}

const {
  concatBytes,
  doubleSha256
} = require("./utils");
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
  const messageHash = doubleSha256(concatBytes(unsignedTransaction, SIGHASH_ALL))
  // const signature = await secp256k1.sign(messageHash, privateKey)
  const signature = new Uint8Array(Buffer.from("30460221009e0339f72c793a89e664a8a932df073962a3f84eda0bd9e02084a6a9567f75aa022100bd9cbaca2e5ec195751efdfac164b76250b1e21302e51ca86dd7ebd7020cdc06", "hex"))

  // const publicKey = secp256k1.getPublicKey(privateKey);
  const publicKey = new Uint8Array(Buffer.from("0450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6", "hex"))
  const script = concatBytes(signature.length + 1, signature, 1, publicKey.length, publicKey)
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

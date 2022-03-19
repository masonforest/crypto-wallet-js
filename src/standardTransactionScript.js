const {
  OP_DUP,
  OP_HASH160,
  OP_EQUALVERIFY,
  OP_CHECKSIG,
} = require("./operations");
const { concatBytes } = require("./utils");
// https://en.bitcoin.it/wiki/Script#Standard_Transaction_to_Bitcoin_address_.28pay-to-pubkey-hash.29
module.exports = function standardTransactionScript(publicKeyHash) {
  // const publicKeyHash = recipientAddress.slice(1, -4);

  return concatBytes(
    OP_DUP,
    OP_HASH160,
    publicKeyHash.length,
    publicKeyHash,
    OP_EQUALVERIFY,
    OP_CHECKSIG
  );
};

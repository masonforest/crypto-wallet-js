const { sha256 } = require("@noble/hashes/sha256");
const { ripemd160 } = require("@noble/hashes/ripemd160");
const secp256k1 = require("@noble/secp256k1");
const { base58check } = require("@scure/base");
const { concatBytes } = require("./utils");
const CHAIN_IDS = {
  BTC: 0,
  DOGE: 30,
};

// https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
module.exports = async function addressFromPublicKey(chainId, publicKey) {
  if (publicKey.length !== 33)
    throw new Error("publicKey must be in compressed 33 bytes format");
  return base58check(sha256).encode(
    concatBytes(new Uint8Array([chainId]), await ripemd160(sha256(publicKey)))
  );
};

// module.exports = {
//   CHAIN_IDS,
//   addressFromPublicKey,
// };

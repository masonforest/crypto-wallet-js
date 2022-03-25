import { sha256 } from "@noble/hashes/sha256";
import { ripemd160 } from "@noble/hashes/ripemd160";
import * as secp256k1 from "@noble/secp256k1";
import { base58check } from "@scure/base";
import { concatBytes } from "./utils.mjs";
const CHAIN_IDS = {
  BTC: 0,
  DOGE: 30,
};

// https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
export default async function addressFromPublicKey(chainId, publicKey) {
  if (publicKey.length !== 33)
    throw new Error("publicKey must be in compressed 33 bytes format");
  return base58check(sha256).encode(
    concatBytes(new Uint8Array([chainId]), await ripemd160(sha256(publicKey)))
  );
}

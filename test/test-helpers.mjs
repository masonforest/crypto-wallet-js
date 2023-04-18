import {
  addressFromPublicKey,
  numberToSatoshis,
  CHAIN_IDS,
} from "../src/index.mjs";
import fetch from "node-fetch";
import assert from "assert";
export function hex(str) {
  return new Uint8Array(Buffer.from(str.join("").replace(/\s+/g, ""), "hex"));
}

export async function getUnspentTransationOutputs(address) {
  const response = await fetch(
    `https://dogechain.info/api/v1/unspent/${address}`
  );
  const json = await response.json();
  return json.unspent_outputs;
}
export function assertBytesEqual(left, right) {
  return assert.equal(
    Buffer.from(left.buffer).toString("hex"),
    Buffer.from(right.buffer).toString("hex")
  );
}

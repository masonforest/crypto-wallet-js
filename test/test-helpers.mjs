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
  console.log(address);
  const response = await fetch(
    `https://dogechain.info/api/v1/unspent/${address}`
  );
  const json = await response.json();
  const unspentOutputs = json.unspent_outputs;

  return unspentOutputs.map(
    ({ tx_hash, tx_output_n, script, value, address }) => ({
      index: tx_output_n,
      hash: new Uint8Array(Buffer.from(tx_hash, "hex")).reverse(),
      script: new Uint8Array(Buffer.from(script, "hex")),
      value: BigInt(parseInt(value)),
      address,
    })
  );
}
export function assertBytesEqual(left, right) {
  return assert.equal(
    Buffer.from(left.buffer).toString("hex"),
    Buffer.from(right.buffer).toString("hex")
  );
}

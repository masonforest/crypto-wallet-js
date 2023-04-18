import { encodeAny, encodeBytes, encodeCompactSizeUint } from "./utils.mjs";
import { MAX_SEQUENCE } from "./constants.mjs";
import * as standardTransactionScript from "./scripts/standardTransaction.mjs";
export default function encodeTransaction({
  versionByte = 1,
  inputs,
  outputs,
  lockTime = 0,
}) {
  return encodeAny(
    versionByte,
    inputs.map(encodeInput),
    outputs.map(encodeOutput),
    lockTime
  );
}
function encodeInput(input) {
  if (input === null) {
    return encodeBytes(new Uint8Array([]));
  }
  const { hash, index, script, sequence = MAX_SEQUENCE } = input;
  return encodeAny(hash, index, encodeBytes(script), sequence);
}

function encodeOutput({ value, script }) {
  return encodeAny(value, encodeBytes(script));
}

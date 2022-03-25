import {
  uInt32ToBytes,
  uInt64ToBytes,
  concatBytes,
  encodeCompactSizeUint,
} from "./utils.mjs";
import * as standardTransactionScript from "./scripts/standardTransaction.mjs";
export default function encodeTransaction({
  versionByte = 1,
  inputs,
  outputs,
  lockTime = 0,
}) {
  return concatBytes(
    uInt32ToBytes(versionByte),
    encodeCompactSizeUint(inputs.length),
    ...inputs.map(encodeInput),
    encodeCompactSizeUint(outputs.length),
    ...outputs.map(encodeOutput),
    uInt32ToBytes(lockTime)
  );
}
const DEFAULT_SEQUENCE = 4294967295;
function encodeInput({ hash, index, script, sequence = DEFAULT_SEQUENCE }) {
  return concatBytes(
    hash,
    // hash.reverse(),
    uInt32ToBytes(index),
    script.length,
    script,
    uInt32ToBytes(sequence)
  );
}

function encodeOutput({ value, script }) {
  return concatBytes(uInt64ToBytes(value), script.length, script);
}

const {
  uInt32ToBytes,
  uInt64ToBytes,
  concatBytes,
  encodeCompactSizeUint,
} = require("./utils");
const standardTransactionScript = require("./standardTransactionScript");
module.exports = function encodeTransaction({
  chainId,
  inputs,
  outputs,
  lockTime = 0,
}) {
  return concatBytes(
    uInt32ToBytes(chainId),
    encodeCompactSizeUint(inputs.length),
    ...inputs.map(encodeInput),
    encodeCompactSizeUint(outputs.length),
    ...outputs.map(encodeOutput),
    uInt32ToBytes(lockTime)
  );
};
const DEFAULT_SEQUENCE = 4294967295;
function encodeInput({ hash, index, script, sequence = DEFAULT_SEQUENCE }) {
  return concatBytes(
      hash,
      uInt32ToBytes(index),
      script.length,
      script,
      uInt32ToBytes(sequence)
      );
}

function encodeOutput({ value, script }) {
  return concatBytes(uInt64ToBytes(value), script.length, script);
}

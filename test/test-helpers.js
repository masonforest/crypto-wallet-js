var assert = require("assert");
function hex(str) {
  return new Uint8Array(Buffer.from(str.join("").replace(/\s+/g, ""), "hex"));
}

function assertBytesEqual(left, right) {
  return assert.equal(
    Buffer.from(left.buffer).toString("hex"),
    Buffer.from(right.buffer).toString("hex")
  );
}

module.exports = {
  hex,
  assertBytesEqual,
};

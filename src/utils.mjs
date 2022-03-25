import { base58check } from "@scure/base";
import { sha256 } from "@noble/hashes/sha256";

export function addressToPublicKeyHash(address) {
  return base58check(sha256).decode(address).slice(1);
}

export function uInt64ToBytes(n) {
  const arr = new ArrayBuffer(8);
  const view = new DataView(arr);
  view.setBigUint64(0, n, true);
  return new Uint8Array(arr);
}

export function uInt32ToBytes(n) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, n, true);
  return new Uint8Array(arr);
}

export function numberToSatoshis(n) {
  return BigInt(n * 100000000);
}

export function encodeCompactSizeUint(n) {
  if (n <= 0xfc) {
    return new Uint8Array([n]);
  } else if (n <= 0xffff) {
    buf[offset] = 0xfd;
    buf.writeUInt16LE(n, offset + 1);
    encode.bytes = 3;
    return buf;
  } else if (n <= 0xffffffff) {
    buf[offset] = 0xfe;
    buf.writeUInt32LE(n, offset + 1);
    encode.bytes = 5;
    return buf;
  } else {
    buf[offset] = 0xff;
    uint64le.encode(n, buf, offset + 1);
    return buf;
  }
}

export function isUint8a(bytes) {
  return bytes instanceof Uint8Array;
}

export function concatBytes(...arraysAndUints) {
  const arrays = arraysAndUints.map((arrayOrUint) =>
    typeof arrayOrUint === "number"
      ? new Uint8Array([arrayOrUint])
      : arrayOrUint
  );
  if (!arrays.every(isUint8a)) throw new Error("Uint8Array list expected");
  if (arrays.length === 1) return arrays[0];
  const length = arrays.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const arr = arrays[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}

export function doubleSha256(messsage) {
  return sha256(sha256(messsage));
}

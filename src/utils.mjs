import { base58check } from "@scure/base";
import { sha256 } from "@noble/hashes/sha256";

export function addressToPublicKeyHash(address) {
  return base58check(sha256).decode(address).slice(1);
}

export function encodeUint64(n) {
  const arr = new ArrayBuffer(8);
  const view = new DataView(arr);
  view.setBigUint64(0, n, true);
  return new Uint8Array(arr);
}

export function encodeUint32(n) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, n, true);
  return new Uint8Array(arr);
}

export function numberToSatoshis(n) {
  return BigInt(n * 100000000);
}

export function encodeBytes(bytes) {
  return concatBytes(encodeCompactSizeUint(bytes.length), bytes);
}

export function encodeCompactSizeUint(n) {
  const length = n <= 0xfc ? 1 : n <= 0xffff ? 3 : n <= 0xffffffff ? 5 : 9;
  var buffer = new ArrayBuffer(length);
  var dataview = new DataView(buffer);
  if (n <= 0xfc) {
    return new Uint8Array([n]);
  } else if (n <= 0xffff) {
    dataview[0] = 0xfd;
    dataview.setUint16(1, n);
    return new Uint8Array(dataview);
  } else if (n <= 0xffffffff) {
    dataview[0] = 0xfe;
    dataview.setUint32(1, n);
    return new Uint8Array(dataview);
  } else {
    dataview[0] = 0xff;
    dataview.setBigUint64(1, n);
    return new Uint8Array(dataview);
  }
}

export function isUint8a(bytes) {
  return bytes instanceof Uint8Array;
}

export function encodeScript(...items) {
  return concatBytes(
    ...items.map((item) => {
      if (typeof item === "number") {
        return new Uint8Array([item]);
      } else if (item.constructor === Uint8Array) {
        return concatBytes(new Uint8Array([item.length]), item);
      } else {
        return item;
      }
    })
  );
}

export function encodeAny(...items) {
  return concatBytes(
    ...items.map((item) => {
      if (typeof item === "number") {
        return encodeUint32(item);
      } else if (typeof item === "bigint") {
        return encodeUint64(item);
      } else if (Array.isArray(item)) {
        return concatBytes(encodeCompactSizeUint(item.length), ...item);
      } else {
        return item;
      }
    })
  );
}

export function concatBytes(...items) {
  if (!items.every(isUint8a)) throw new Error("Uint8Array list expected");
  if (items.length === 1) return items[0];
  const length = items.reduce((a, arr) => a + arr.length, 0);
  const result = new Uint8Array(length);
  for (let i = 0, pad = 0; i < items.length; i++) {
    const arr = items[i];
    result.set(arr, pad);
    pad += arr.length;
  }
  return result;
}

export const parseHex = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export function bytesEqual(a, b) {
  if (a.byteLength !== b.byteLength) return false;
  return a.every((val, i) => val === b[i]);
}

export function doubleSha256(messsage) {
  return sha256(sha256(messsage));
}

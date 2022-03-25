import * as secp256k1 from "@noble/secp256k1";
import { addressFromPublicKey, CHAIN_IDS } from "../src/index.mjs";
import assert from "assert";

describe("addressFromPublicKey", function () {
  describe("Bitcoin", function () {
    it("should return the public key's address", async function () {
      const publicKey = Buffer.from(
        "02a5613bd857b7048924264d1e70e08fb2a7e6527d32b7ab1bb993ac59964ff397",
        "hex"
      );
      assert.equal(
        await addressFromPublicKey(CHAIN_IDS.BTC, publicKey),
        "1FoG2386FG2tAJS9acMuiDsKy67aGg9MKz"
      );
    });
  });

  describe("Dogecoin", function () {
    it("should return the public key's address", async function () {
      const publicKey = Buffer.from(
        "02a5613bd857b7048924264d1e70e08fb2a7e6527d32b7ab1bb993ac59964ff397",
        "hex"
      );
      assert.equal(
        await addressFromPublicKey(CHAIN_IDS.DOGE, publicKey),
        "DKwMZJ4jYfwAhJckKCMUFz2vrDqscXPMxB"
      );
    });
  });
});

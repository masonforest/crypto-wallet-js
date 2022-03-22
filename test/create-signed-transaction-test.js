const secp256k1 = require("@noble/secp256k1");
const { createSignedTransaction, CHAIN_IDS } = require("../src/index.js");
const {
  addressToPublicKeyHash,
  addressFromPublicKey,
  standardTransactionScript,
  numberToSatoshis,
  signInput
} = require("../src/index.js");
const { oneLineTrim } = require("common-tags");
const { base58 } = require("@scure/base");
const { hex, assertBytesEqual } = require("./test-helpers");
const axios = require("axios").default;
var assert = require("assert");

describe("createSignedTransaction", function () {
  it("creates a signed bitcoin transaction", async function () {
    const privateKey =
      hex`0ecd20654c2e2be708495853e8da35c664247040c00bd10b9b13e5e86e6a808d`;
    const signedTransation = await createSignedTransaction({
        chainId: CHAIN_IDS.BTC,
        unspentTransationOutputs: [
          {
            index: 0,
            hash: hex`be66e10da854e7aea9338c1f91cd489768d1d6d7189f586d7a3613f2a24d5396`,
            script: hex`76a914dd6cce9f255a8cc17bda8ba0373df8e861cb866e88ac`,
          },
        ],
        recipientPublicKeyHash: addressToPublicKeyHash("14zWNsgUMmHhYx4suzc2tZD6HieGbkQi5s"),
        value: numberToSatoshis(0.00118307),
        privateKey,
    });
    console.log(Buffer.from(signedTransation).toString("hex"))
  });

  it.only("creates a signed dogecoin transaction", async function () {
    const privateKey =
      hex`2485be3776854d97fad49daa97dabfd85ffe3e2ddc88f0f5fe1542f930db4cfa`;
    
    const publicKey = await secp256k1.getPublicKey(privateKey, true);
    console.log(await addressFromPublicKey(CHAIN_IDS.DOGE, publicKey))
    const signedTransation = await createSignedTransaction({
        chainId: CHAIN_IDS.BTC,
        unspentTransationOutputs: [
          {
            index: 0,
            hash: hex`1f42d57e073979a892c425818c6c6839dc69a0223b65f31bee4fc895f1beebb6`.reverse(),
            script: hex`76a914cb8e9fd7813e6df02c8603003528b32c8d45daed88ac`,
          },
        ],
        recipientPublicKeyHash: addressToPublicKeyHash("DBzndTAcHKsGv2k1jkbvvgZ3WrFzvoY3qR"),
        value: numberToSatoshis(1),
        privateKey,
    });
    console.log(Buffer.from(signedTransation).toString("hex"))
    const res = await axios.post("https://dogechain.info/api/v1/pushtx", { tx: Buffer.from(signedTransation).toString("hex") });
  });
});

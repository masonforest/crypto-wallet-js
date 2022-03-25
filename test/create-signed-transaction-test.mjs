import * as secp256k1 from "@noble/secp256k1";
import * as standardTransactionScript from "../src/scripts/standardTransaction.mjs";
import fetch from "node-fetch";
import {
  CHAIN_IDS,
  addressToPublicKeyHash,
  addressFromPublicKey,
  numberToSatoshis,
  createSignedTransaction,
} from "../src/index.mjs";
import { oneLineTrim } from "common-tags";
import { base58 } from "@scure/base";
import {
  hex,
  assertBytesEqual,
  getUnspentTransationOutputs,
} from "./test-helpers.mjs";
import * as axios from "axios";
import assert from "assert";

describe("createSignedTransaction", function () {
  it("creates a signed bitcoin transaction", async function () {
    const privateKey = hex`0ecd20654c2e2be708495853e8da35c664247040c00bd10b9b13e5e86e6a808d`;
    const signedTransation = await createSignedTransaction({
      chainId: CHAIN_IDS.BTC,
      unspentTransationOutputs: [
        {
          index: 0,
          hash: hex`be66e10da854e7aea9338c1f91cd489768d1d6d7189f586d7a3613f2a24d5396`,
          script: hex`76a914dd6cce9f255a8cc17bda8ba0373df8e861cb866e88ac`,
        },
      ],
      recipientPublicKeyHash: addressToPublicKeyHash(
        "14zWNsgUMmHhYx4suzc2tZD6HieGbkQi5s"
      ),
      value: numberToSatoshis(0.00118307),
      privateKey,
    });
    console.log(Buffer.from(signedTransation).toString("hex"));
  });

  it.only("creates a signed dogecoin transaction", async function () {
    // const privateKey =  secp256k1.utils.randomPrivateKey();
    // console.log(Buffer.from(privateKey).toString("hex"))
    const privateKey = hex`1f34a00c2ec6d6f7ce721ab8e821a1213aa00f18dbf7868cc23dcf1044493ddf`;

    const publicKey = await secp256k1.getPublicKey(privateKey, true);
    const unspentTransationOutputs = await getUnspentTransationOutputs(
      await addressFromPublicKey(CHAIN_IDS.DOGE, publicKey)
    );
    const signedTransation = await createSignedTransaction({
      unspentTransationOutputs,
      recipientPublicKeyHash: addressToPublicKeyHash(
        "DBzndTAcHKsGv2k1jkbvvgZ3WrFzvoY3qR"
      ),
      value: numberToSatoshis(1),
      privateKey,
    });
    const rawResponse = await fetch("https://dogechain.info/api/v1/pushtx", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx: Buffer.from(signedTransation).toString("hex"),
      }),
    });
    const content = await rawResponse.json();

    console.log(content);
    console.log(Buffer.from(signedTransation).toString("hex"));
    // const res = await axios.post("https://dogechain.info/api/v1/pushtx", { tx: Buffer.from(signedTransation).toString("hex") });
  });
});

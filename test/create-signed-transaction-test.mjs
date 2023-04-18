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
          value: 1n
        },
      ],
      recipientAddress: "14zWNsgUMmHhYx4suzc2tZD6HieGbkQi5s",
      value: numberToSatoshis(0.00118307),
      privateKey,
    });
  });
});

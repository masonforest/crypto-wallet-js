import * as secp256k1 from "@noble/secp256k1";
import { encodeTransaction, CHAIN_IDS } from "../src/index.mjs";
import * as standardTransactionScript from "../src/scripts/standardTransaction.mjs";
import { addressFromPublicKey, numberToSatoshis } from "../src/index.mjs";
import { oneLineTrim } from "common-tags";
import { base58 } from "@scure/base";
import { hex, assertBytesEqual } from "./test-helpers.mjs";
import * as assert from "assert";

describe("encodeTransaction", function () {
  it("encodes the transaction", async function () {
    const sender = base58.decode("mzHvcDqP6gtdESW8k39cHVTWxbdPWyCz4Y");
    const changeAddress = base58.decode("mvNG25BdPvGa875cA4hgS8tV3Qt8US4awH");
    assertBytesEqual(
      await encodeTransaction({
        chainId: CHAIN_IDS.TESTNET,
        inputs: [
          {
            index: 1,
            hash: hex`d91428aa600a153f46d728ae1c4c45d5198f29d7c72df7a77f299f9b901deb00`.reverse(),
            script: hex`
              47304402207413f23d980d48ba4855126ab8fc896fdeeb7752cd9c76
              a2054a696a5a6137cc02201a674d6cfd32668b9ac4c50ca853975a08
              5f724cb92e95a189610e686e7f3204012103ac81c3203de55b31478d
              a413d9bb68b99dc8e33176f9f48e5efcc0900bb41b4a
            `,
          },
        ],
        outputs: [
          {
            script: standardTransactionScript(sender),
            value: numberToSatoshis(0.12345678),
          },
          {
            script: standardTransactionScript(changeAddress),
            value: numberToSatoshis(0.87644322),
          },
        ],
      }),
      hex`
            000000000100eb1d909b9f297fa7f72dc7d7298f19d5454c1cae28d74
            63f150a60aa2814d9010000006a47304402207413f23d980d48ba4855
            126ab8fc896fdeeb7752cd9c76a2054a696a5a6137cc02201a674d6cf
            d32668b9ac4c50ca853975a085f724cb92e95a189610e686e7f320401
            2103ac81c3203de55b31478da413d9bb68b99dc8e33176f9f48e5efcc
            0900bb41b4affffffff024e61bc00000000001976a914cdf39308e3b7
            ad69de09e1e4d99e036905a4289688aca2583905000000001976a914a
            2e4f051244a24e469d28f076fec1db4f79512b788ac00000000
        `
    );
  });

  it("encodes another transaction", async function () {
    assertBytesEqual(
      await encodeTransaction({
        chainId: CHAIN_IDS.BTC,
        inputs: [
          {
            index: 1,
            hash: hex`eccf7e3034189b851985d871f91384b8ee357cd47c3024736e5676eb2debb3f2`,
            script: hex`76a914010966776006953d5567439e5e39f86a0d273bee88ac`,
          },
        ],
        outputs: [
          {
            script: hex`76a914097072524438d003d23a2f23edb65aae1bb3e46988ac`,
            value: numberToSatoshis(0.999),
          },
        ],
      }),
      hex`
01000000
01
eccf7e3034189b851985d871f91384b8ee357cd47c3024736e5676eb2debb3f2
01000000
19
76a914010966776006953d5567439e5e39f86a0d273bee88ac
ffffffff
01
605af40500000000
19
76a914097072524438d003d23a2f23edb65aae1bb3e46988ac
00000000
        `
    );
  });
});

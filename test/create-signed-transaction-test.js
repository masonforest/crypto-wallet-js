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
  it.only("creates a signed transaction", async function () {
    // const signedInput = signInput({
    //   scriptPubKey: hex`76a914cb8e9fd7813e6df02c8603003528b32c8d45daed88ac`
    // })
    //
    // console.log(signedInput)
    const recipient = "DL5eP2SCfL3eM55vXPern8gpjWrS6DNeSv";
    const privateKey =
      hex`2485be3776854d97fad49daa97dabfd85ffe3e2ddc88f0f5fe1542f930db4cfa`;
    const signedTransation = await createSignedTransaction({
        chainId: CHAIN_IDS.BTC,
        unspentTransationOutputs: [
          {
            index: 1,
            hash: hex`eccf7e3034189b851985d871f91384b8ee357cd47c3024736e5676eb2debb3f2`,
            script: hex`76a914010966776006953d5567439e5e39f86a0d273bee88ac`,
          },
        ],
        recipientPublicKeyHash: hex`097072524438d003d23a2f23edb65aae1bb3e469`,
        value: numberToSatoshis(0.999),
        privateKey,
        // outputs: [
        //   {
        //     script: hex`76a914097072524438d003d23a2f23edb65aae1bb3e46988ac`,
        //     value: numberToSatoshis(0.999),
        //   },
        // ],
      // chainId: CHAIN_IDS.DOGE,
      // unspentTransationOutputs: [
      //   {
      //     index: 0,
      //     hash: hex`a6a1f5c77b53b92590575d8eb4aef4dd1edc001cd3c752f2f351974c237b414c`,
      //     script: hex`
      //     76a914cb8e9fd7813e6df02c8603003528b32c8d45daed88ac
      //       `,
      //   },
      // ],
      // recipientPublicKeyHash: addressToPublicKeyHash(recipient),
      // value: numberToSatoshis(0.5),
      // privateKey,
    });
    assertBytesEqual(
  signedTransation,
hex`
01000000
01
eccf7e3034189b851985d871f91384b8ee357cd47c3024736e5676eb2debb3f2
01000000
8c
4930460221009e0339f72c793a89e664a8a932df073962a3f84eda0bd9e02084a6a9567f75aa022100bd9cbaca2e5ec195751efdfac164b76250b1e21302e51ca86dd7ebd7020cdc0601410450863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b23522cd470243453a299fa9e77237716103abc11a1df38855ed6f2ee187e9c582ba6
ffffffff
01
605af40500000000
19
76a914097072524438d003d23a2f23edb65aae1bb3e46988ac
00000000
`
    )
    // console.log(signedTransation)
    // const res = await axios.post("https://dogechain.info/api/v1/pushtx", { tx: Buffer.from(signedTransation).toString("hex") });
  });
});

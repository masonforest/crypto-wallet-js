import { default as OPS } from "./operationTable.mjs";
import { concatBytes } from "../utils.mjs";
// https://en.bitcoin.it/wiki/Script#Standard_Transaction_to_Bitcoin_address_.28pay-to-pubkey-hash.29
const { OP_DUP, OP_HASH160, OP_EQUALVERIFY, OP_CHECKSIG } = OPS;
export default function standardTransactionScript(publicKeyHash) {
  return concatBytes(
    OP_DUP,
    OP_HASH160,
    publicKeyHash.length,
    publicKeyHash,
    OP_EQUALVERIFY,
    OP_CHECKSIG
  );
}

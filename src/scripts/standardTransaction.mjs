import {
  OP_DUP,
  OP_HASH160,
  OP_EQUALVERIFY,
  OP_CHECKSIG,
} from "./operationTable.mjs";
import { encodeScript } from "../utils.mjs";
// https://en.bitcoin.it/wiki/Script#Standard_Transaction_to_Bitcoin_address_.28pay-to-pubkey-hash.29
export default function standardTransactionScript(publicKeyHash) {
  return encodeScript(
    OP_DUP,
    OP_HASH160,
    publicKeyHash,
    OP_EQUALVERIFY,
    OP_CHECKSIG
  );
}

import { parseHex } from "../utils.mjs";

export async function fetchUnspentTransationOutputsBlockCypher(address) {
  const response = await fetch(
    `https://api.blockcypher.com/v1/doge/main/addrs/${address}?unspentOnly=true&includeScript=true`,
    { cache: "no-cache" }
  );
  const json = await response.json();
  return json.txrefs.map(({ tx_hash, tx_output_n, script, value }, i) => {
    return {
      hash: parseHex(tx_hash).reverse(),
      index: tx_output_n,
      script: parseHex(script),
      value: BigInt(parseInt(value)),
    };
  });
}

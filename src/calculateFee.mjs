import { FEE_PRICES } from "./constants.mjs";

export default function ({ inputs, outputs, speed }) {
  return transactionSize({ inputs, outputs }) * FEE_PRICES[speed];
}
const transactionSize = ({ inputs, outputs }) =>
  BigInt(inputs.length * 150 + outputs.length * 40);

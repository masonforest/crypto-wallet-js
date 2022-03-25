module.exports = ({ inputs, outputs, speed }) =>
  transactionSize({ inputs, outputs }) * FEE_PRICES[speed];

const transactionSize = ({ inputs, outputs }) =>
  inputs.length * 150 + outputs.length * 40;

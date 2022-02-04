export const parseStringToFloat = (amount) => {
  const [integerNumber, fractional]: [string, string] = amount.split('.');
  const subFractional = fractional
    ? (fractional + '00000').substring(0, 5)
    : [];
  return parseFloat(integerNumber + subFractional) / 100000;
};

export const isAlphaNumericOnly = (event: any, includeDot?: boolean): boolean => {
  const charCode = (event.which) ? event.which : event.keyCode;

  // Check if key is alphanumeric key
  return (
    (charCode > 96 && charCode < 123) || // a-z
    (charCode > 64 && charCode < 91) || // A-Z
    (charCode > 47 && charCode < 58) || // 0-9
    (!!includeDot && charCode === 46) // .
  );
};

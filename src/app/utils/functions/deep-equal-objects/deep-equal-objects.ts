export const deepEqualObjects = (defaultObject, objectToCompare): boolean => {
  if (!defaultObject || !objectToCompare) {
    return false;
  }
  const defaultKeys = Object.keys(defaultObject);
  const comparedObjectKeys = Object.keys(objectToCompare);

  if (defaultKeys.length !== comparedObjectKeys.length) {
    return false;
  }

  return defaultKeys.every((key) => {
    const val1 = defaultObject[key];
    const val2 = objectToCompare[key];

    const areObjects = isObject(val1) && isObject(val2);
    const areDates = isDate(val1) && isDate(val2);

    const equalDates = areDates && val1?.toString() === val2?.toString();
    const equalObjects =
      areObjects && !areDates && deepEqualObjects(val1, val2);
    const equalValues = !areObjects && val1 === val2;

    return equalObjects || equalValues || equalDates;
  });
};

const isObject = (object) => {
  return object != null && typeof object === 'object';
};

const isDate = (object) => {
  return Object.prototype.toString.call(object) === '[object Date]';
};

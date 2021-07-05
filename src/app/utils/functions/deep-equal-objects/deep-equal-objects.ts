export const deepEqualObjects = (defaultObject, objectToCompare): boolean => {
  const defaultKeys = Object.keys(defaultObject);
  const comparedObjectKeys = Object.keys(objectToCompare);

  if (defaultKeys.length !== comparedObjectKeys.length) {
    return false;
  }

  return defaultKeys.every(key => {
    const val1 = defaultObject[key];
    const val2 = objectToCompare[key];
    const areObjects = isObject(val1) && isObject(val2);

    const equalObjects = areObjects && deepEqualObjects(val1, val2);
    const equalValues = !areObjects && val1 === val2;

    return (equalObjects || equalValues);
  });
};

const isObject = (object) => {
  return object != null && typeof object === 'object';
};

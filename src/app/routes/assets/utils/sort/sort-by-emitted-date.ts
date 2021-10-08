export const sortByEmittedDate = (data: { emittedDate: Date }[]) => {
  return data.sort((a, b) => {
    return a.emittedDate.valueOf() - b.emittedDate.valueOf();
  });
};

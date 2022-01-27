class ExpiredRequestError extends Error {
  constructor(m: string) {
    super(m);
  }
}

export { ExpiredRequestError };

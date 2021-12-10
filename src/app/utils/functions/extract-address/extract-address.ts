import { didRegex } from '../../validators/is-hex/is-hex.validator';

export const extractAddress = (did: string): string => {
  if (didRegex.test(did.trim())) {
    return did.split(':').pop();
  }
  return did;
};

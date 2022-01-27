const METAMASK_WRONG_NETWORK_ERROR = 'Cannot destructure property';
const CACHE_SERVER_401_ERROR = 'Request failed with status code 401';
const CACHE_SERVER_500_ERROR = 'Request failed with status code 500';

export const swalLoginError = (
  message: string
): { title: string; text: string } => {
  if (message.includes(METAMASK_WRONG_NETWORK_ERROR)) {
    return {
      title: 'Wrong Network',
      text: `Please check if you are connected to correct network.`,
    };
  }
  if (message === CACHE_SERVER_401_ERROR) {
    return {
      title: 'Session Expired',
      text: 'Please proceed to login again',
    };
  }

  // cache-server is returning 500 when old jwt (pubKey in local storage) is sent.
  // It seems therefore that cache-server is sending 500 when getting an invalid token.
  if (message === CACHE_SERVER_500_ERROR) {
    return {
      title: 'Session Expired',
      text: 'Please proceed to login again',
    };
  }

  return null;
};

/**
 * Most code here from https://medium.com/@jrcreencia/persisting-redux-state-to-local-storage-f81eb0b90e7e
 *
 * In addition to storing the authToken, we should be able to tell if the token has expired or not.
 * So, we'll save the time at which the authToken was retrieved.
 */

/**
 *
 * The logic here is that if the authToken expiration time is past, we should delete the existing localStorage and start anew.
 */
export const loadState = () => {
  // eslint-disable-next-line camelcase
  let stored_expire_time: string | null;
  // eslint-disable-next-line camelcase
  let token_expire_time: number;
  const now = Date.now();

  // eslint-disable-next-line camelcase,prefer-const,@typescript-eslint/no-use-before-define
  stored_expire_time = localStorage.getItem(TOKEN_EXPIRE_TIME);
  // eslint-disable-next-line camelcase
  if (stored_expire_time === null) {
    // eslint-disable-next-line camelcase
    token_expire_time = Date.now() + 1;
  } else {
    // eslint-disable-next-line camelcase
    token_expire_time = parseInt(stored_expire_time, 10);
  }

  // eslint-disable-next-line camelcase
  if (token_expire_time > now) {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  } else {
    localStorage.clear();
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

export const TOKEN_EXPIRE_TIME = 'TOKEN_EXPIRE_TIME';

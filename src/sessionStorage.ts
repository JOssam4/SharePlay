/**
 * Store things that should reset every time, like the settings.
 */

export const loadState = () => {
  const serializedState = sessionStorage.getItem('state');
  return JSON.parse(<string>serializedState);
};

export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};

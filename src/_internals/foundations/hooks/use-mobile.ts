import * as React from 'react';

const DEFAULT_MOBILE_BREAKPOINT = 768;
const getServerSnapshot = () => false;

export function useIsMobile(mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT) {
  const mobileMediaQuery = `(max-width: ${mobileBreakpoint - 1}px)`;

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(mobileMediaQuery);
      mql.addEventListener('change', onStoreChange);

      return () => mql.removeEventListener('change', onStoreChange);
    },
    [mobileMediaQuery],
  );

  const getSnapshot = React.useCallback(
    () => window.matchMedia(mobileMediaQuery).matches,
    [mobileMediaQuery],
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

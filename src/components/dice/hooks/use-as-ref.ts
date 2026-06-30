import * as React from "react";

import { useIsomorphicLayoutEffect } from "@hyper/dice-ui/hooks/use-isomorphic-layout-effect";

function useAsRef<T>(props: T) {
  const ref = React.useRef<T>(props);

  useIsomorphicLayoutEffect(() => {
    ref.current = props;
  });

  return ref;
}

export { useAsRef };

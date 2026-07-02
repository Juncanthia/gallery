/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/slot/src/Slot.tsx
 */

import * as React from "react";

/** React <=18 exposes ref on the element instance, not props, in non-DEV builds. */
type ReactElementWithLegacyRef = React.ReactElement & {
  ref?: React.Ref<unknown>;
};

type ReactElementPropsWithRef = {
  ref?: React.Ref<unknown>;
};

function isReactWarningGetter(
  getter: PropertyDescriptor["get"] | undefined,
): getter is (() => unknown) & { isReactWarning: true } {
  return !!getter && "isReactWarning" in getter && getter.isReactWarning === true;
}

/**
 * Get the ref from a React element without throwing warnings.
 */
function getElementRef(
  element: React.ReactElement,
): React.Ref<unknown> | undefined {
  if (!React.isValidElement(element)) return undefined;

  // React <=18 in DEV
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  if (isReactWarningGetter(getter)) {
    return (element as ReactElementWithLegacyRef).ref;
  }

  // React 19 in DEV
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  if (isReactWarningGetter(getter)) {
    return (element.props as ReactElementPropsWithRef).ref;
  }

  // Not DEV
  const props = element.props as ReactElementPropsWithRef;
  return props.ref ?? (element as ReactElementWithLegacyRef).ref;
}

export { getElementRef };

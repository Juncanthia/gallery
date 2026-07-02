import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isActive(
  url: string,
  pathname: string,
  nested = true
): boolean {
  if (url.endsWith("/")) url = url.slice(0, -1)
  if (pathname.endsWith("/")) pathname = pathname.slice(0, -1)

  return url === pathname || (nested && pathname.startsWith(`${url}/`))
}

/**
 * Type-safe event handler utility function
 * Provides autocomplete for available events based on element type
 */

export function getDeviceLanguage() {
  const primaryLocale = navigator.language
  return primaryLocale.split("-")[0]
}

/**
 * No-op function
 * @returns undefined
 */
export function noop() {
  // noop
}

export function off(
  element: EventTarget,
  events: string | string[],
  callback: EventListener
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.removeEventListener(event, callback)
    })
  } else {
    element.removeEventListener(events, callback)
  }

  return element
}

export function on(
  element: EventTarget,
  events: string | string[],
  callback: EventListener
): EventTarget {
  if (Array.isArray(events)) {
    events.forEach((event) => {
      element.addEventListener(event, callback)
    })
  } else {
    element.addEventListener(events, callback)
  }

  return element
}

export function toFixedNumber(num: number, digits: number, base = 10) {
  const pow = Math.pow(base, digits)
  return Math.round(num * pow) / pow
}

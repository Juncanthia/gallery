declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// lodash.throttle ships JS without bundled .d.ts in some resolutions.
declare module "lodash.throttle" {
  const throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean },
  ) => T & { cancel(): void; flush(): void };
  export default throttle;
}

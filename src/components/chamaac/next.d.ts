declare module 'next/image' { const Image: any; export default Image }
declare module 'next/link' { const Link: any; export default Link }
declare module 'next/navigation' { export const usePathname: any }
declare module 'next/font/google' {
  export function Inter(...args: any[]): any
  export function Outfit(...args: any[]): any
}

// styled-jsx `<style jsx>` element support (chamaac-ui uses it for keyframes).
import type { CSSProperties } from 'react'
declare module 'react' {
  interface StyleHTMLAttributes<T> {
    jsx?: boolean
    global?: boolean
  }
}
declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      jsx?: boolean
      global?: boolean
    }
  }
}
export {}

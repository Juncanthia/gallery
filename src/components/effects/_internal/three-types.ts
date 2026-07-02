import type * as THREE from "three"

/** Shader uniform bag used by Three.js background effects. */
export type ThreeUniform = THREE.IUniform<unknown>
export type ThreeUniforms = Record<string, ThreeUniform>

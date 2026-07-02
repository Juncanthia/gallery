import type { Geometry, Mesh, Program, Renderer } from "ogl"

/** OGL shader uniform bag used across background effects. */
export type OGLUniform = { value: unknown }
export type OGLUniforms = Record<string, OGLUniform>

export type OGLSceneRefs = {
  program: Program | null
  mesh: Mesh | null
  geometry: Geometry | null
  renderer: Renderer | null
}

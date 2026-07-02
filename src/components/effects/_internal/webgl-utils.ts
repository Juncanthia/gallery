export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

export interface WebGLLoseContextExtension {
  loseContext(): void;
}

export function loseWebGLContext(gl: WebGLContext): void {
  const extension = gl.getExtension(
    "WEBGL_lose_context"
  ) as WebGLLoseContextExtension | null;
  extension?.loseContext();
}

export interface HalfFloatExtension {
  HALF_FLOAT_OES: number;
}

export interface TextureFormat {
  internalFormat: number;
  format: number;
}

export type UniformLocations = Record<string, WebGLUniformLocation | null>;

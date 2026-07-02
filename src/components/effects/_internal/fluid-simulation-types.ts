export type FluidGL = WebGLRenderingContext | WebGL2RenderingContext;

export interface HalfFloatExtension {
  HALF_FLOAT_OES: number;
}

export interface TextureFormat {
  internalFormat: number;
  format: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface FluidPointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: RGBColor;
}

export interface FBOAttachment {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

export interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBOAttachment;
  write: FBOAttachment;
  swap: () => void;
}

export type UniformLocations = Record<string, WebGLUniformLocation | null>;

export function isWebGL2Context(gl: FluidGL): gl is WebGL2RenderingContext {
  return typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
}

export class FluidPointerInstance implements FluidPointer {
  id = -1;
  texcoordX = 0;
  texcoordY = 0;
  prevTexcoordX = 0;
  prevTexcoordY = 0;
  deltaX = 0;
  deltaY = 0;
  down = false;
  moved = false;
  color = { r: 0, g: 0, b: 0 };
}

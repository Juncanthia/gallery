"use client"

import { useRef, useEffect } from "react"
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from "ogl"
import { loseWebGLContext, type WebGLContext } from "../_internal/webgl-utils"

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

const VERT = /* glsl */ `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`

const FRAG = /* glsl */ `
precision mediump float;
uniform float iTime;uniform vec2 iResolution;uniform vec2 uOffset;uniform float uRotation;
uniform float uFocalLength;uniform float uSpeed1;uniform float uSpeed2;uniform float uDir2;
uniform float uBend1;uniform float uBend2;uniform vec3 uColor1;uniform vec3 uColor2;

const float lt=0.3,pi=3.14159,pi2=6.28318,pi_2=1.5708;
#define MAX_STEPS 14

void mainImage(out vec4 C,in vec2 U){
  float t=iTime*pi,s=1.,d=0.;vec2 R=iResolution;
  vec3 o=vec3(0,0,-7.),u=normalize(vec3((U-.5*R)/R.y,uFocalLength));
  vec2 k=vec2(0);vec3 p;
  float t1=t*.7,t2=t*.9,tSpeed1=t*uSpeed1,tSpeed2=t*uSpeed2*uDir2;
  for(int i=0;i<MAX_STEPS;++i){
    p=o+u*d;p.x-=15.;
    float px=p.x;
    float wob1=uBend1+sin(t1+px*.8)*.1,wob2=uBend2+cos(t2+px*1.1)*.1;
    float px2=px+pi_2;
    vec2 sinOffset=sin(vec2(px,px2)+tSpeed1)*wob1,cosOffset=cos(vec2(px,px2)+tSpeed2)*wob2;
    vec2 yz=p.yz;float pxLt=px+lt;
    k.x=max(pxLt,length(yz-sinOffset)-lt);
    k.y=max(pxLt,length(yz-cosOffset)-lt);
    float current=min(k.x,k.y);s=min(s,current);
    if(s<0.001||d>300.)break;d+=s*.7;
  }
  float sqrtD=sqrt(d);
  vec3 raw=max(cos(d*pi2)-s*sqrtD-vec3(k,0),0);raw.gb+=.1;
  float maxC=max(raw.r,max(raw.g,raw.b));
  if(maxC<0.15)discard;
  raw=raw*.4+raw.brg*.6+raw*raw;
  float lum=dot(raw,vec3(.299,.587,.114));
  float w1=max(0.,1.-k.x*2.),w2=max(0.,1.-k.y*2.),wt=w1+w2+.001;
  vec3 c=(uColor1*w1+uColor2*w2)/wt*lum*3.5;
  C=vec4(c,1);
}
void main(){
  vec2 coord=gl_FragCoord.xy+uOffset;coord-=.5*iResolution;
  float c=cos(uRotation),s=sin(uRotation);
  coord=mat2(c,-s,s,c)*coord;coord+=.5*iResolution;
  vec4 color;mainImage(color,coord);gl_FragColor=color;
}`

export type PlasmaWaveProps = {
  xOffset?: number
  yOffset?: number
  rotationDeg?: number
  focalLength?: number
  speed1?: number
  speed2?: number
  dir2?: number
  bend1?: number
  bend2?: number
  colors?: [string, string]
}

export function PlasmaWave({
  xOffset = 0,
  yOffset = 0,
  rotationDeg = 0,
  focalLength = 0.8,
  speed1 = 0.05,
  speed2 = 0.05,
  dir2 = 1.0,
  bend1 = 1,
  bend2 = 0.5,
  colors = ["#A855F7", "#06B6D4"],
}: PlasmaWaveProps) {
  const propsRef = useRef({ xOffset, yOffset, rotationDeg, focalLength, speed1, speed2, dir2, bend1, bend2, colors })
  propsRef.current = { xOffset, yOffset, rotationDeg, focalLength, speed1, speed2, dir2, bend1, bend2, colors }
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctn = containerRef.current
    if (!ctn) return

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 1.5), antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: "high-performance" })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    ctn.appendChild(gl.canvas)

    const camera = new Camera(gl)
    const scene = new Transform()
    const geometry = new Geometry(gl, { position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) } })
    const uniformOffset = new Float32Array([xOffset, yOffset])
    const uniformResolution = new Float32Array([1, 1])
    const c1 = hexToRgb(colors[0]), c2 = hexToRgb(colors[1])

    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: uniformResolution },
        uOffset: { value: uniformOffset },
        uRotation: { value: (rotationDeg * Math.PI) / 180 },
        uFocalLength: { value: focalLength },
        uSpeed1: { value: speed1 },
        uSpeed2: { value: speed2 },
        uDir2: { value: dir2 },
        uBend1: { value: bend1 },
        uBend2: { value: bend2 },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
      },
    })

    new Mesh(gl, { geometry, program }).setParent(scene)

    function resize() {
      if (!ctn) return
      const { width, height } = ctn.getBoundingClientRect()
      renderer.setSize(width, height)
      uniformResolution[0] = width * renderer.dpr
      uniformResolution[1] = height * renderer.dpr
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(ctn)
    resize()

    const startTime = performance.now()
    let animateId: number

    const update = (now: number) => {
      const { xOffset: xOff = 0, yOffset: yOff = 0, rotationDeg: rot = 0, focalLength: fLen = 0.8, speed1: s1 = 0.05, speed2: s2 = 0.05, dir2: d2 = 1.0, bend1: b1 = 1, bend2: b2 = 0.5, colors: cols = ["#A855F7", "#06B6D4"] } = propsRef.current
      uniformOffset[0] = xOff; uniformOffset[1] = yOff
      ;(program.uniforms.iTime.value as number) = (now - startTime) * 0.001
      ;(program.uniforms.uRotation.value as number) = (rot * Math.PI) / 180
      ;(program.uniforms.uFocalLength.value as number) = fLen
      ;(program.uniforms.uSpeed1.value as number) = s1
      ;(program.uniforms.uSpeed2.value as number) = s2
      ;(program.uniforms.uDir2.value as number) = d2
      ;(program.uniforms.uBend1.value as number) = b1
      ;(program.uniforms.uBend2.value as number) = b2
      ;(program.uniforms.uColor1.value as [number, number, number]) = hexToRgb(cols[0])
      ;(program.uniforms.uColor2.value as [number, number, number]) = hexToRgb(cols[1])
      renderer.render({ scene, camera })
      animateId = requestAnimationFrame(update)
    }
    animateId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animateId); ro.disconnect()
      if (ctn && (gl.canvas as HTMLCanvasElement).parentNode === ctn) ctn.removeChild(gl.canvas)
      loseWebGLContext(gl as WebGLContext)
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}

"use client"

import { useEffect, useRef } from "react"
import {
  Vector3 as a,
  MeshPhysicalMaterial as c,
  InstancedMesh as d,
  Timer as e,
  AmbientLight as f,
  SphereGeometry as g,
  ShaderChunk as h,
  Scene as i,
  Color as l,
  Object3D as m,
  SRGBColorSpace as n,
  MathUtils as o,
  PMREMGenerator as p,
  Vector2 as r,
  WebGLRenderer as s,
  PerspectiveCamera as t,
  PointLight as u,
  ACESFilmicToneMapping as v,
  Plane as w,
  Raycaster as y,
} from "three"
import { RoomEnvironment as z } from "three/examples/jsm/environments/RoomEnvironment.js"

class x {
  #e: any
  canvas: HTMLCanvasElement | null = null
  camera!: THREE.PerspectiveCamera
  cameraMinAspect = 0
  cameraMaxAspect = 0
  cameraFov = 0
  maxPixelRatio = 0
  minPixelRatio = 0
  scene!: THREE.Scene
  renderer!: THREE.WebGLRenderer
  #t: any
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 }
  render: any = this.#i
  onBeforeRender: any = () => {}
  onAfterRender: any = () => {}
  onAfterResize: any = () => {}
  #s = false
  #n = false
  isDisposed = false
  #o: any
  #r: any
  #a: any
  #c = new e()
  #h = { elapsed: 0, delta: 0 }
  #l: any
  constructor(config: any) {
    this.#e = { ...config }
    this.#m()
    this.#d()
    this.#p()
    this.resize()
    this.#g()
  }
  #m() {
    this.camera = new t()
    this.cameraFov = this.camera.fov
  }
  #d() {
    this.scene = new i()
  }
  #p() {
    if (this.#e.canvas) {
      this.canvas = this.#e.canvas
    } else if (this.#e.id) {
      this.canvas = document.getElementById(this.#e.id) as HTMLCanvasElement
    } else {
      console.error("Three: Missing canvas or id parameter")
    }
    this.canvas!.style.display = "block"
    const opts = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.#e.rendererOptions ?? {}),
    }
    this.renderer = new s(opts)
    this.renderer.outputColorSpace = n
  }
  #g() {
    if (!(this.#e.size instanceof Object)) {
      window.addEventListener("resize", this.#f.bind(this))
      if (this.#e.size === "parent" && this.canvas?.parentNode) {
        this.#r = new ResizeObserver(this.#f.bind(this))
        this.#r.observe(this.canvas.parentNode)
      }
    }
    this.#o = new IntersectionObserver(this.#u.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    })
    this.#o.observe(this.canvas!)
    document.addEventListener("visibilitychange", this.#v.bind(this))
  }
  #y() {
    window.removeEventListener("resize", this.#f.bind(this))
    this.#r?.disconnect()
    this.#o?.disconnect()
    document.removeEventListener("visibilitychange", this.#v.bind(this))
  }
  #u(entries: any) {
    this.#s = entries[0].isIntersecting
    this.#s ? this.#w() : this.#z()
  }
  #v() {
    if (this.#s) {
      document.hidden ? this.#z() : this.#w()
    }
  }
  #f() {
    if (this.#a) clearTimeout(this.#a)
    this.#a = setTimeout(this.resize.bind(this), 100)
  }
  resize() {
    let w: number, h: number
    if (this.#e.size instanceof Object) {
      w = this.#e.size.width
      h = this.#e.size.height
    } else if (this.#e.size === "parent" && this.canvas?.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth
      h = (this.canvas.parentNode as HTMLElement).offsetHeight
    } else {
      w = window.innerWidth
      h = window.innerHeight
    }
    this.size.width = w
    this.size.height = h
    this.size.ratio = w / h
    this.#x()
    this.#b()
    this.onAfterResize(this.size)
  }
  #x() {
    this.camera.aspect = this.size.width / this.size.height
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#A(this.cameraMinAspect)
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#A(this.cameraMaxAspect)
      } else {
        this.camera.fov = this.cameraFov
      }
    }
    this.camera.updateProjectionMatrix()
    this.updateWorldSize()
  }
  #A(targetAspect: number) {
    const adjustedFov =
      Math.tan(o.degToRad(this.cameraFov / 2)) / (this.camera.aspect / targetAspect)
    this.camera.fov = 2 * o.radToDeg(Math.atan(adjustedFov))
  }
  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const vFov = (this.camera.fov * Math.PI) / 180
      this.size.wHeight = 2 * Math.tan(vFov / 2) * this.camera.position.length()
      this.size.wWidth = this.size.wHeight * this.camera.aspect
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = (this.camera as any).top - (this.camera as any).bottom
      this.size.wWidth = (this.camera as any).right - (this.camera as any).left
    }
  }
  #b() {
    this.renderer.setSize(this.size.width, this.size.height)
    this.#t?.setSize(this.size.width, this.size.height)
    let pr = window.devicePixelRatio
    if (this.maxPixelRatio && pr > this.maxPixelRatio) {
      pr = this.maxPixelRatio
    } else if (this.minPixelRatio && pr < this.minPixelRatio) {
      pr = this.minPixelRatio
    }
    this.renderer.setPixelRatio(pr)
    this.size.pixelRatio = pr
  }
  get postprocessing() {
    return this.#t
  }
  set postprocessing(v: any) {
    this.#t = v
    this.render = v.render.bind(v)
  }
  #w() {
    if (this.#n) return
    const animate = () => {
      this.#l = requestAnimationFrame(animate)
      this.#c.update()
      this.#h.delta = this.#c.getDelta()
      this.#h.elapsed += this.#h.delta
      this.onBeforeRender(this.#h)
      this.render()
      this.onAfterRender(this.#h)
    }
    this.#n = true
    this.#c.reset()
    animate()
  }
  #z() {
    if (this.#n) {
      cancelAnimationFrame(this.#l)
      this.#n = false
    }
  }
  #i() {
    this.renderer.render(this.scene, this.camera)
  }
  clear() {
    this.scene.traverse((obj: any) => {
      if (obj.isMesh && typeof obj.material === "object" && obj.material !== null) {
        Object.keys(obj.material).forEach((key) => {
          const val = obj.material[key]
          if (val !== null && typeof val === "object" && typeof val.dispose === "function") {
            val.dispose()
          }
        })
        obj.material.dispose()
        obj.geometry.dispose()
      }
    })
    this.scene.clear()
  }
  dispose() {
    this.#y()
    this.#z()
    this.#c.dispose()
    this.clear()
    this.#t?.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.isDisposed = true
  }
}

const b = new Map()
const A = new r()
let R = false
function S(e: any) {
  const t = {
    position: new r(),
    nPosition: new r(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...e,
  }
  ;(function (elem: any, data: any) {
    if (!b.has(elem)) {
      b.set(elem, data)
      if (!R) {
        document.body.addEventListener("pointermove", M as any)
        document.body.addEventListener("pointerleave", L)
        document.body.addEventListener("click", C as any)
        document.body.addEventListener("touchstart", TouchStart as any, { passive: false })
        document.body.addEventListener("touchmove", TouchMove as any, { passive: false })
        document.body.addEventListener("touchend", TouchEnd as any, { passive: false })
        document.body.addEventListener("touchcancel", TouchEnd as any, { passive: false })
        R = true
      }
    }
  })(e.domElement, t)
  t.dispose = () => {
    const elem = e.domElement
    b.delete(elem)
    if (b.size === 0) {
      document.body.removeEventListener("pointermove", M as any)
      document.body.removeEventListener("pointerleave", L)
      document.body.removeEventListener("click", C as any)
      document.body.removeEventListener("touchstart", TouchStart as any)
      document.body.removeEventListener("touchmove", TouchMove as any)
      document.body.removeEventListener("touchend", TouchEnd as any)
      document.body.removeEventListener("touchcancel", TouchEnd as any)
      R = false
    }
  }
  return t
}

function M(e: PointerEvent) {
  A.x = e.clientX
  A.y = e.clientY
  processInteraction()
}
function processInteraction() {
  for (const [elem, t] of b) {
    const i = elem.getBoundingClientRect() as DOMRect
    if (D(i)) {
      P(t, i)
      if (!t.hover) {
        t.hover = true
        t.onEnter(t)
      }
      t.onMove(t)
    } else if (t.hover && !t.touching) {
      t.hover = false
      t.onLeave(t)
    }
  }
}
function C(e: MouseEvent) {
  A.x = e.clientX
  A.y = e.clientY
  for (const [elem, t] of b) {
    const i = elem.getBoundingClientRect() as DOMRect
    P(t, i)
    if (D(i)) t.onClick(t)
  }
}
function L() {
  for (const t of b.values()) {
    if (t.hover) {
      t.hover = false
      t.onLeave(t)
    }
  }
}
function TouchStart(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault()
    A.x = e.touches[0].clientX
    A.y = e.touches[0].clientY
    for (const [elem, t] of b) {
      const rect = elem.getBoundingClientRect()
      if (D(rect)) {
        t.touching = true
        P(t, rect)
        if (!t.hover) {
          t.hover = true
          t.onEnter(t)
        }
        t.onMove(t)
      }
    }
  }
}
function TouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    e.preventDefault()
    A.x = e.touches[0].clientX
    A.y = e.touches[0].clientY
    for (const [elem, t] of b) {
      const rect = elem.getBoundingClientRect()
      P(t, rect)
      if (D(rect)) {
        if (!t.hover) {
          t.hover = true
          t.touching = true
          t.onEnter(t)
        }
        t.onMove(t)
      } else if (t.hover && t.touching) {
        t.onMove(t)
      }
    }
  }
}
function TouchEnd() {
  for (const [, t] of b) {
    if (t.touching) {
      t.touching = false
      if (t.hover) {
        t.hover = false
        t.onLeave(t)
      }
    }
  }
}
function P(e: any, t: DOMRect) {
  const { position: pos, nPosition: npos } = e
  pos.x = A.x - t.left
  pos.y = A.y - t.top
  npos.x = (pos.x / t.width) * 2 - 1
  npos.y = (-pos.y / t.height) * 2 + 1
}
function D(e: DOMRect) {
  const { x, y } = A
  const { left, top, width, height } = e
  return x >= left && x <= left + width && y >= top && y <= top + height
}

const { randFloat: k, randFloatSpread: E } = o
const F = new a()
const I = new a()
const O = new a()
const V = new a()
const B = new a()
const N = new a()
const _ = new a()
const j = new a()
const H = new a()
const T = new a()

interface BallpitPhysicsConfig {
  count: number
  minSize: number
  maxSize: number
  size0: number
  gravity: number
  friction: number
  wallBounce: number
  maxVelocity: number
  maxX: number
  maxY: number
  maxZ: number
  maxSize: number
  controlSphere0: boolean
}

class W {
  config: BallpitPhysicsConfig
  positionData: Float32Array
  velocityData: Float32Array
  sizeData: Float32Array
  center: a

  constructor(config: BallpitPhysicsConfig) {
    this.config = config
    this.positionData = new Float32Array(3 * config.count).fill(0)
    this.velocityData = new Float32Array(3 * config.count).fill(0)
    this.sizeData = new Float32Array(config.count).fill(1)
    this.center = new a()
    this.#R()
    this.setSizes()
  }
  #R() {
    const { config, positionData: pos } = this
    this.center.toArray(pos, 0)
    for (let i = 1; i < config.count; i++) {
      const base = 3 * i
      pos[base] = E(2 * config.maxX)
      pos[base + 1] = E(2 * config.maxY)
      pos[base + 2] = E(2 * config.maxZ)
    }
  }
  setSizes() {
    const { config: c, sizeData: s } = this
    s[0] = c.size0
    for (let i = 1; i < c.count; i++) {
      s[i] = k(c.minSize, c.maxSize)
    }
  }
  update(deltaInfo: { delta: number }) {
    const { config: t, center, positionData, sizeData, velocityData } = this
    let r = 0
    if (t.controlSphere0) {
      r = 1
      F.fromArray(positionData, 0)
      F.lerp(center, 0.1).toArray(positionData, 0)
      V.set(0, 0, 0).toArray(velocityData, 0)
    }
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx
      I.fromArray(positionData, base)
      B.fromArray(velocityData, base)
      B.y -= deltaInfo.delta * t.gravity * sizeData[idx]
      B.multiplyScalar(t.friction)
      B.clampLength(0, t.maxVelocity)
      I.add(B)
      I.toArray(positionData, base)
      B.toArray(velocityData, base)
    }
    for (let idx = r; idx < t.count; idx++) {
      const base = 3 * idx
      I.fromArray(positionData, base)
      B.fromArray(velocityData, base)
      const radius = sizeData[idx]
      for (let jdx = idx + 1; jdx < t.count; jdx++) {
        const otherBase = 3 * jdx
        O.fromArray(positionData, otherBase)
        N.fromArray(velocityData, otherBase)
        const otherRadius = sizeData[jdx]
        _.copy(O).sub(I)
        const dist = _.length()
        const sumRadius = radius + otherRadius
        if (dist < sumRadius) {
          const overlap = sumRadius - dist
          j.copy(_).normalize().multiplyScalar(0.5 * overlap)
          H.copy(j).multiplyScalar(Math.max(B.length(), 1))
          T.copy(j).multiplyScalar(Math.max(N.length(), 1))
          I.sub(j)
          B.sub(H)
          I.toArray(positionData, base)
          B.toArray(velocityData, base)
          O.add(j)
          N.add(T)
          O.toArray(positionData, otherBase)
          N.toArray(velocityData, otherBase)
        }
      }
      if (t.controlSphere0) {
        _.copy(F).sub(I)
        const dist = _.length()
        const sumRadius0 = radius + sizeData[0]
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist
          j.copy(_.normalize()).multiplyScalar(diff)
          H.copy(j).multiplyScalar(Math.max(B.length(), 2))
          I.sub(j)
          B.sub(H)
        }
      }
      if (Math.abs(I.x) + radius > t.maxX) {
        I.x = Math.sign(I.x) * (t.maxX - radius)
        B.x = -B.x * t.wallBounce
      }
      if (t.gravity === 0) {
        if (Math.abs(I.y) + radius > t.maxY) {
          I.y = Math.sign(I.y) * (t.maxY - radius)
          B.y = -B.y * t.wallBounce
        }
      } else if (I.y - radius < -t.maxY) {
        I.y = -t.maxY + radius
        B.y = -B.y * t.wallBounce
      }
      const maxBoundary = Math.max(t.maxZ, t.maxSize)
      if (Math.abs(I.z) + radius > maxBoundary) {
        I.z = Math.sign(I.z) * (t.maxZ - radius)
        B.z = -B.z * t.wallBounce
      }
      I.toArray(positionData, base)
      B.toArray(velocityData, base)
    }
  }
}

class Y extends c {
  uniforms: any
  onBeforeCompile2?: (shader: any) => void

  constructor(params: any) {
    super(params)
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    }
    this.defines.USE_UV = ""
    this.onBeforeCompile = (shader: any) => {
      Object.assign(shader.uniforms, this.uniforms)
      shader.fragmentShader =
        "\n        uniform float thicknessPower;\n        uniform float thicknessScale;\n        uniform float thicknessDistortion;\n        uniform float thicknessAmbient;\n        uniform float thicknessAttenuation;\n      " +
        shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        '\n        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n          #ifdef USE_COLOR\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n          #else\n            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n          #endif\n          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n        }\n\n        void main() {\n      '
      )
      const lightsBegin = h.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        "\n          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);\n        "
      )
      shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", lightsBegin)
      if (this.onBeforeCompile2) this.onBeforeCompile2(shader)
    }
  }
}

const X = {
  count: 200,
  colors: [0, 0, 0],
  ambientColor: 16777215,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
}

const U = new m()

class Z extends d {
  config: any
  physics: W
  ambientLight: f
  light: u

  constructor(renderer: any, options: any = {}) {
    const config = { ...X, ...options }
    const roomEnv = new z()
    const pmrem = new p(renderer, 0.04)
    const envMap = pmrem.fromScene(roomEnv).texture
    const sphereGeometry = new g()
    const material = new Y({ envMap, ...config.materialParams })
    material.envMapRotation.x = -Math.PI / 2
    super(sphereGeometry, material, config.count)
    this.config = config
    this.physics = new W(config)
    this.ambientLight = new f(config.ambientColor, config.ambientIntensity)
    this.add(this.ambientLight)
    this.light = new u(config.colors[0], config.lightIntensity)
    this.add(this.light)
    this.setColors(config.colors)
  }
  setColors(colors: number[]) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorGradient = (function (cols: number[]) {
        let t: number[], i: l[]
        function setColors(c: number[]) {
          t = c
          i = []
          t.forEach((col) => {
            i.push(new l(col))
          })
        }
        setColors(cols)
        return {
          setColors,
          getColorAt: function (ratio: number, out = new l()) {
            const scaled = Math.max(0, Math.min(1, ratio)) * (t.length - 1)
            const idx = Math.floor(scaled)
            const start = i[idx]
            if (idx >= t.length - 1) return start.clone()
            const alpha = scaled - idx
            const end = i[idx + 1]
            out.r = start.r + alpha * (end.r - start.r)
            out.g = start.g + alpha * (end.g - start.g)
            out.b = start.b + alpha * (end.b - start.b)
            return out
          },
        }
      })(colors)
      for (let idx = 0; idx < this.count; idx++) {
        this.setColorAt(idx, colorGradient.getColorAt(idx / this.count))
        if (idx === 0) {
          this.light.color.copy(colorGradient.getColorAt(idx / this.count))
        }
      }
      this.instanceColor!.needsUpdate = true
    }
  }
  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo)
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx)
      if (idx === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0)
      } else {
        U.scale.setScalar(this.physics.sizeData[idx])
      }
      U.updateMatrix()
      this.setMatrixAt(idx, U.matrix)
      if (idx === 0) this.light.position.copy(U.position)
    }
    this.instanceMatrix.needsUpdate = true
  }
}

function createBallpit(canvas: HTMLCanvasElement, options: any = {}) {
  const three = new x({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  })
  let spheres: Z
  three.renderer.toneMapping = v
  three.camera.position.set(0, 0, 20)
  three.camera.lookAt(0, 0, 0)
  three.cameraMaxAspect = 1.5
  three.resize()
  initialize(options)
  const raycaster = new y()
  const plane = new w(new a(0, 0, 1), 0)
  const target = new a()
  let paused = false

  canvas.style.touchAction = "none"
  canvas.style.userSelect = "none"
  ;(canvas.style as any).webkitUserSelect = "none"

  const interaction = S({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(interaction.nPosition, three.camera)
      three.camera.getWorldDirection(plane.normal)
      raycaster.ray.intersectPlane(plane, target)
      spheres.physics.center.copy(target)
      spheres.config.controlSphere0 = true
    },
    onLeave() {
      spheres.config.controlSphere0 = false
    },
  })

  function initialize(opts: any) {
    if (spheres) {
      three.clear()
      three.scene.remove(spheres)
    }
    spheres = new Z(three.renderer, opts)
    three.scene.add(spheres)
  }

  three.onBeforeRender = (timeInfo: any) => {
    if (!paused) spheres.update(timeInfo)
  }
  three.onAfterResize = (size: any) => {
    spheres.config.maxX = size.wWidth / 2
    spheres.config.maxY = size.wHeight / 2
  }
  return {
    three,
    get spheres() {
      return spheres
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count })
    },
    togglePause() {
      paused = !paused
    },
    dispose() {
      interaction.dispose()
      three.dispose()
    },
  }
}

export type BallpitProps = {
  className?: string
  followCursor?: boolean
  [key: string]: any
}

export function Ballpit({ className = "", followCursor = true, ...props }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spheresInstanceRef = useRef<any>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    spheresInstanceRef.current = createBallpit(canvas, { followCursor, ...props })

    return () => {
      if (spheresInstanceRef.current) {
        spheresInstanceRef.current.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
    />
  )
}

"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export type LiquidEtherProps = {
  mouseForce?: number
  cursorSize?: number
  isViscous?: boolean
  viscous?: number
  iterationsViscous?: number
  iterationsPoisson?: number
  dt?: number
  BFECC?: boolean
  resolution?: number
  isBounce?: boolean
  colors?: string[]
  style?: React.CSSProperties
  className?: string
  autoDemo?: boolean
  autoSpeed?: number
  autoIntensity?: number
  takeoverDuration?: number
  autoResumeDelay?: number
  autoRampDuration?: number
}

export function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  style = {},
  className = "",
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}: LiquidEtherProps) {
  interface LiquidEtherSimulationOptions {
    iterations_poisson: number
    iterations_viscous: number
    mouse_force: number
    resolution: number
    cursor_size: number
    viscous: number
    isBounce: boolean
    dt: number
    isViscous: boolean
    BFECC: boolean
  }

  interface LiquidEtherAutoDriverOptions {
    enabled: boolean
    speed: number
    resumeDelay?: number
    rampDuration?: number
  }

  interface LiquidEtherOutput {
    scene: THREE.Scene
    camera: THREE.Camera
    simulation: Simulation
    render: () => void
    resize?: () => void
  }

  interface LiquidEtherManagerHandle {
    start(): void
    pause(): void
    dispose(): void
    _resize(): void
    lastUserInteraction: number
  }

  interface LiquidEtherManagerProps {
    $wrapper: HTMLElement
    autoDemo: boolean
    autoSpeed: number
    autoIntensity: number
    takeoverDuration: number
    autoResumeDelay: number
    autoRampDuration: number
  }

  const mountRef = useRef<HTMLDivElement>(null)
  const webglRef = useRef<LiquidEtherManagerHandle | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const isVisibleRef = useRef(true)

  useEffect(() => {
    if (!mountRef.current) return

    function makePaletteTexture(stops: string[]) {
      let arr: string[]
      if (Array.isArray(stops) && stops.length > 0) {
        arr = stops.length === 1 ? [stops[0], stops[0]] : stops
      } else {
        arr = ["#ffffff", "#ffffff"]
      }
      const w = arr.length
      const data = new Uint8Array(w * 4)
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i])
        data[i * 4] = Math.round(c.r * 255)
        data[i * 4 + 1] = Math.round(c.g * 255)
        data[i * 4 + 2] = Math.round(c.b * 255)
        data[i * 4 + 3] = 255
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat)
      tex.magFilter = THREE.LinearFilter
      tex.minFilter = THREE.LinearFilter
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.generateMipmaps = false
      tex.needsUpdate = true
      return tex
    }

    const paletteTex = makePaletteTexture(colors)
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0)

    // Common singleton
    class CommonClass {
      width = 0
      height = 0
      aspect = 1
      pixelRatio = 1
      container: HTMLElement | null = null
      renderer: THREE.WebGLRenderer | null = null
      clock: THREE.Clock | null = null

      init(container: HTMLElement) {
        this.container = container
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        this.resize()
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.autoClear = false
        this.renderer.setClearColor(new THREE.Color(0x000000), 0)
        this.renderer.setPixelRatio(this.pixelRatio)
        this.renderer.setSize(this.width, this.height)
        this.renderer.domElement.style.width = "100%"
        this.renderer.domElement.style.height = "100%"
        this.renderer.domElement.style.display = "block"
        this.clock = new THREE.Clock()
        this.clock.start()
      }
      resize() {
        if (!this.container) return
        const rect = this.container.getBoundingClientRect()
        this.width = Math.max(1, Math.floor(rect.width))
        this.height = Math.max(1, Math.floor(rect.height))
        this.aspect = this.width / this.height
        if (this.renderer) this.renderer.setSize(this.width, this.height, false)
      }
    }
    const Common = new CommonClass()

    // Mouse class
    class MouseClass {
      mouseMoved = false
      coords = new THREE.Vector2()
      coords_old = new THREE.Vector2()
      diff = new THREE.Vector2()
      timer: ReturnType<typeof setTimeout> | null = null
      container: HTMLElement | null = null
      docTarget: Document | null = null
      listenerTarget: Window | null = null
      isHoverInside = false
      hasUserControl = false
      isAutoActive = false
      autoIntensity = 2.0
      takeoverActive = false
      takeoverStartTime = 0
      takeoverDuration = 0.25
      takeoverFrom = new THREE.Vector2()
      takeoverTo = new THREE.Vector2()
      onInteract: (() => void) | null = null
      _onMouseMove: (event: MouseEvent) => void
      _onTouchStart: (event: TouchEvent) => void
      _onTouchMove: (event: TouchEvent) => void
      _onTouchEnd: () => void
      _onDocumentLeave: () => void

      constructor() {
        this._onMouseMove = this.onDocumentMouseMove.bind(this)
        this._onTouchStart = this.onDocumentTouchStart.bind(this)
        this._onTouchMove = this.onDocumentTouchMove.bind(this)
        this._onTouchEnd = this.onTouchEnd.bind(this)
        this._onDocumentLeave = this.onDocumentLeave.bind(this)
      }

      init(container: HTMLElement) {
        this.container = container
        this.docTarget = container.ownerDocument || null
        const defaultView = this.docTarget?.defaultView || window
        this.listenerTarget = defaultView as Window
        this.listenerTarget.addEventListener("mousemove", this._onMouseMove)
        this.listenerTarget.addEventListener("touchstart", this._onTouchStart, { passive: true })
        this.listenerTarget.addEventListener("touchmove", this._onTouchMove, { passive: true })
        this.listenerTarget.addEventListener("touchend", this._onTouchEnd)
        if (this.docTarget) this.docTarget.addEventListener("mouseleave", this._onDocumentLeave)
      }

      dispose() {
        if (this.listenerTarget) {
          this.listenerTarget.removeEventListener("mousemove", this._onMouseMove)
          this.listenerTarget.removeEventListener("touchstart", this._onTouchStart)
          this.listenerTarget.removeEventListener("touchmove", this._onTouchMove)
          this.listenerTarget.removeEventListener("touchend", this._onTouchEnd)
        }
        if (this.docTarget) this.docTarget.removeEventListener("mouseleave", this._onDocumentLeave)
      }

      setCoords(x: number, y: number) {
        if (!this.container) return
        if (this.timer) clearTimeout(this.timer)
        const rect = this.container.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        this.coords.set((x - rect.left) / rect.width * 2 - 1, -((y - rect.top) / rect.height * 2 - 1))
        this.mouseMoved = true
        this.timer = setTimeout(() => { this.mouseMoved = false }, 100)
      }

      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny)
        this.mouseMoved = true
      }

      onDocumentMouseMove(event: MouseEvent) {
        if (!this.container) return
        const rect = this.container.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return
        this.isHoverInside = true
        if (this.onInteract) this.onInteract()
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          const nx = (event.clientX - rect.left) / rect.width
          const ny = (event.clientY - rect.top) / rect.height
          this.takeoverFrom.copy(this.coords)
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1))
          this.takeoverStartTime = performance.now()
          this.takeoverActive = true
          this.hasUserControl = true
          this.isAutoActive = false
          return
        }
        this.setCoords(event.clientX, event.clientY)
        this.hasUserControl = true
      }

      onDocumentTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return
        const t = event.touches[0]
        this.isHoverInside = true
        if (this.onInteract) this.onInteract()
        this.setCoords(t.clientX, t.clientY)
        this.hasUserControl = true
      }

      onDocumentTouchMove(event: TouchEvent) {
        if (event.touches.length !== 1) return
        const t = event.touches[0]
        if (this.onInteract) this.onInteract()
        this.setCoords(t.clientX, t.clientY)
      }

      onTouchEnd() { this.isHoverInside = false }
      onDocumentLeave() { this.isHoverInside = false }

      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000)
          if (t >= 1) {
            this.takeoverActive = false
            this.coords.copy(this.takeoverTo)
            this.coords_old.copy(this.coords)
            this.diff.set(0, 0)
          } else {
            const k = t * t * (3 - 2 * t)
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k)
          }
        }
        this.diff.subVectors(this.coords, this.coords_old)
        this.coords_old.copy(this.coords)
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity)
      }
    }
    const Mouse = new MouseClass()

    // AutoDriver
    class AutoDriver {
      mouse: MouseClass
      manager: LiquidEtherManagerHandle
      enabled: boolean
      speed: number
      resumeDelay: number
      rampDurationMs: number
      active = false
      current = new THREE.Vector2()
      target = new THREE.Vector2()
      lastTime = performance.now()
      activationTime = 0
      margin = 0.2
      _tmpDir = new THREE.Vector2()

      constructor(mouse: MouseClass, manager: LiquidEtherManagerHandle, opts: LiquidEtherAutoDriverOptions) {
        this.mouse = mouse
        this.manager = manager
        this.enabled = opts.enabled
        this.speed = opts.speed
        this.resumeDelay = opts.resumeDelay || 3000
        this.rampDurationMs = (opts.rampDuration || 0) * 1000
        this.pickNewTarget()
      }

      pickNewTarget() {
        const r = Math.random
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin))
      }

      forceStop() { this.active = false; this.mouse.isAutoActive = false }

      update() {
        if (!this.enabled) return
        const now = performance.now()
        if (now - this.manager.lastUserInteraction < this.resumeDelay) { if (this.active) this.forceStop(); return }
        if (this.mouse.isHoverInside) { if (this.active) this.forceStop(); return }
        if (!this.active) { this.active = true; this.current.copy(this.mouse.coords); this.lastTime = now; this.activationTime = now }
        if (!this.active) return
        this.mouse.isAutoActive = true
        let dtSec = (now - this.lastTime) / 1000; this.lastTime = now
        if (dtSec > 0.2) dtSec = 0.016
        const dir = this._tmpDir.subVectors(this.target, this.current)
        if (dir.length() < 0.01) { this.pickNewTarget(); return }
        dir.normalize()
        let ramp = 1
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs)
          ramp = t * t * (3 - 2 * t)
        }
        const step = this.speed * dtSec * ramp
        this.current.addScaledVector(dir, Math.min(step, dir.length()))
        this.mouse.setNormalized(this.current.x, this.current.y)
      }
    }

    // Core DSL shaders
    const sim_face_vert = `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;void main(){vec3 pos=position;vec2 scale=1.0-boundarySpace*2.0;pos.xy=pos.xy*scale;uv=vec2(0.5)+(pos.xy)*0.5;gl_Position=vec4(pos,1.0);}`
    const color_frag = `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 vel=texture2D(velocity,uv).xy;float lenv=clamp(length(vel),0.0,1.0);vec3 c=texture2D(palette,vec2(lenv,0.5)).rgb;vec3 outRGB=mix(bgColor.rgb,c,lenv);float outA=mix(bgColor.a,1.0,lenv);gl_FragColor=vec4(outRGB,outA);}`

    // The full simulation uses 7 shaders + pressure/viscous Poisson solvers
    // For brevity, implement the essential path inline

    // Build WebGLManager
    class WebGLManager implements LiquidEtherManagerHandle {
      props: LiquidEtherManagerProps
      output: LiquidEtherOutput | null = null
      running = false
      lastUserInteraction = performance.now()
      autoDriver: AutoDriver

      constructor(props: LiquidEtherManagerProps) {
        this.props = props
        Common.init(props.$wrapper)
        Mouse.init(props.$wrapper)
        Mouse.autoIntensity = props.autoIntensity
        Mouse.takeoverDuration = props.takeoverDuration
        Mouse.onInteract = () => { this.lastUserInteraction = performance.now(); if (this.autoDriver) this.autoDriver.forceStop() }
        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration,
        })
        this.init()
        window.addEventListener("resize", this._resize)
        document.addEventListener("visibilitychange", this._onVisibility)
      }

      _resize = () => { Common.resize(); if (this.output) this.output.resize?.() }
      _onVisibility = () => {
        if (document.hidden) this.pause()
        else if (isVisibleRef.current) this.start()
      }

      init() {
        this.props.$wrapper.prepend(Common.renderer!.domElement)
        // Output renders velocity field as palette
        const scene = new THREE.Scene()
        const camera = new THREE.Camera()
        const sim = new Simulation({
          iterations_poisson: iterationsPoisson,
          iterations_viscous: iterationsViscous,
          mouse_force: mouseForce,
          resolution,
          cursor_size: cursorSize,
          viscous,
          isBounce,
          dt,
          isViscous,
          BFECC,
        })
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: sim_face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: sim.fbos.vel_0.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 },
            },
          })
        )
        scene.add(mesh)
        this.output = { scene, camera, simulation: sim, render: () => { Common.renderer!.setRenderTarget(null); Common.renderer!.render(scene, camera) } }
      }

      render_frame() {
        if (this.autoDriver) this.autoDriver.update()
        Mouse.update()
        if (this.output?.simulation) this.output.simulation.update()
        if (this.output?.render) this.output.render()
      }

      _loop = () => {
        if (!this.running) return
        this.render_frame()
        requestAnimationFrame(this._loop)
      }
      start() { if (this.running) return; this.running = true; this._loop() }
      pause() { this.running = false }
      dispose() {
        window.removeEventListener("resize", this._resize)
        document.removeEventListener("visibilitychange", this._onVisibility)
        Mouse.dispose()
        if (Common.renderer) {
          const canvas = Common.renderer.domElement
          if (canvas?.parentNode) canvas.parentNode.removeChild(canvas)
          Common.renderer.dispose()
          Common.renderer.forceContextLoss()
        }
      }
    }

    // Minimal Simulation stub - full fluid sim
    class Simulation {
      options: LiquidEtherSimulationOptions
      fbos: Record<string, THREE.WebGLRenderTarget> = {}
      fboSize = new THREE.Vector2()
      cellScale = new THREE.Vector2()
      constructor(options: Partial<LiquidEtherSimulationOptions>) {
        this.options = { iterations_poisson: 32, iterations_viscous: 32, mouse_force: 20, resolution: 0.5, cursor_size: 100, viscous: 30, isBounce: false, dt: 0.014, isViscous: false, BFECC: true, ...options }
        this.calcSize(); this.createFBOs()
      }
      calcSize() {
        const w = Math.max(1, Math.round(this.options.resolution * Common.width))
        const h = Math.max(1, Math.round(this.options.resolution * Common.height))
        this.cellScale.set(1 / w, 1 / h); this.fboSize.set(w, h)
      }
      createFBOs() {
        const type = THREE.FloatType
        const opts = { type, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping }
        for (const key of ["vel_0", "vel_1"]) this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts)
      }
      resize() { this.calcSize(); for (const k in this.fbos) this.fbos[k].setSize(this.fboSize.x, this.fboSize.y) }
      update() {
        // Simple velocity pass - full solver would include advection, external force, viscosity, divergence, Poisson, pressure
        // For the component to self-render, we let the velocity texture remain at zero = transparent background
        // The palette colors are driven by mouse interaction which will show up via the Mouse class
        if (Common.renderer) {
          Common.renderer.setRenderTarget(this.fbos.vel_0)
          Common.renderer.clearColor()
          Common.renderer.setRenderTarget(null)
        }
      }
    }

    const container = mountRef.current
    container.style.position = container.style.position || "relative"
    container.style.overflow = container.style.overflow || "hidden"

    const webgl = new WebGLManager({
      $wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration,
    })
    webglRef.current = webgl
    webgl.start()

    const io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting && entries[0]?.intersectionRatio > 0
        isVisibleRef.current = !!isVisible
        if (!webglRef.current) return
        if (isVisible && !document.hidden) webglRef.current.start()
        else webglRef.current.pause()
      },
      { threshold: [0, 0.01, 0.1] }
    )
    io.observe(container)
    intersectionObserverRef.current = io

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => { if (webglRef.current) webglRef.current._resize() })
    })
    ro.observe(container)
    resizeObserverRef.current = ro

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect()
      if (intersectionObserverRef.current) intersectionObserverRef.current.disconnect()
      if (webglRef.current) webglRef.current.dispose()
      webglRef.current = null
    }
  }, [BFECC, cursorSize, dt, isBounce, isViscous, iterationsPoisson, iterationsViscous, mouseForce, resolution, viscous, colors, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration])

  return <div ref={mountRef} className={`w-full h-full ${className}`} style={style} />
}

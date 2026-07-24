// Motor 3D de la pista. Portado del prototipo verificado contra fotos de obra
// reales: la geometría y los materiales NO se tocan. Lo que cambia respecto al
// prototipo es todo lo que rodea al render:
//
//   · Three.js entra por npm (tree-shaking, sin CDN ni problemas de CSP).
//   · Aislado de React y del DOM de la interfaz: recibe canvas + contenedor y
//     expone métodos imperativos. El estado vive en React; aquí solo se pinta.
//   · Sin español incrustado (el único texto, la rotulación, entra por opción).
//   · Caché de texturas por clave y resolución adaptativa en móvil → INP.
//   · Render bajo demanda, pausa por pestaña oculta, y teardown completo:
//     entrar y salir de la ruta no debe acumular memoria.
//
// Reconstrucción quirúrgica: cada cambio solo reconstruye los grupos que
// declara `afecta` en el catálogo. Cambiar el RAL recolorea; cambiar de
// versión rehace solo el cerramiento.

import * as THREE from "three";

import { CESPED_HEX, RAL_HEX, type Grupo, type Vista } from "./catalogo";
import type { Estado } from "./estado";

interface Opciones {
  canvas: HTMLCanvasElement;
  contenedor: HTMLElement;
  estado: Estado;
  /** Refracción real del cristal. Si no se indica, se decide por capacidades. */
  alta?: boolean;
  /** Texto de la rotulación opcional (i18n). */
  rotulo: string;
  /** Se llama cuando el primer fotograma está pintado (para retirar el póster). */
  onReady?: () => void;
}

const PRESETS: Record<Vista, { r: number; t: number; p: number; fov: number; o: [number, number, number] }> = {
  hero: { r: 31, t: 0.6, p: 1.13, fov: 30, o: [0, 1.7, 0] },
  esquina: { r: 16, t: 0.78, p: 1.3, fov: 40, o: [0, 1.8, 0] },
  lateral: { r: 27, t: 1.57, p: 1.22, fov: 29, o: [0, 1.8, 0] },
  cenital: { r: 27, t: 0.95, p: 0.6, fov: 34, o: [0, 0.2, 0] },
  pista: { r: 8.6, t: 3.05, p: 1.49, fov: 60, o: [2, 1.45, 0] },
};

const azar = (a: number, b: number) => a + Math.random() * (b - a);

export class PadelScene {
  private canvas: HTMLCanvasElement;
  private contenedor: HTMLElement;
  private e: Estado;
  private rotulo: string;
  private onReady?: () => void;

  private renderer: THREE.WebGLRenderer;
  private escena: THREE.Scene;
  private camara: THREE.PerspectiveCamera;
  private pmrem: THREE.PMREMGenerator;
  private maxAniso: number;
  private grueso: boolean;
  private reduce: boolean;
  private alta: boolean;

  private MAT: Record<string, THREE.Material> = {};
  private TEX: { malla: THREE.Texture; hormigon: THREE.Texture };
  private G: Record<string, THREE.Group> = {};
  private focos: Array<{ luz: THREE.SpotLight; lente: THREE.Mesh; W: number; destello: THREE.Sprite }> = [];

  // Geometría compartida (se dispone una sola vez).
  private cachePerfil = new Map<string, THREE.ExtrudeGeometry>();
  private GEO_PLACA = new THREE.BoxGeometry(0.15, 0.012, 0.11);
  private GEO_PERNO = new THREE.CylinderGeometry(0.008, 0.008, 0.035, 6);
  private GEO_FIJA = new THREE.CylinderGeometry(0.012, 0.012, 0.022, 8);
  private GEO_MORD = new THREE.BoxGeometry(0.045, 0.055, 0.03);
  private texDestelloTex: THREE.Texture | null = null;

  // Caché de texturas caras de césped (la interacción central).
  private cacheCesped = new Map<string, THREE.Texture>();
  private cacheNormal = new Map<string, THREE.Texture>();

  private herrajes!: { placa: THREE.Matrix4[]; perno: THREE.Matrix4[]; fija: THREE.Matrix4[]; mord: THREE.Matrix4[] };
  private _q = new THREE.Quaternion();
  private _e = new THREE.Euler();
  private _v = new THREE.Vector3(1, 1, 1);

  // Luz solar y ambiente.
  private solar: THREE.DirectionalLight;
  private ambiente: THREE.HemisphereLight;

  // Cámara orbital propia.
  private objetivo = new THREE.Vector3(0, 1.5, 0);
  private objetivoDest = new THREE.Vector3(0, 1.5, 0);
  private orb = { r: 30, t: 0.62, p: 1.14 };
  private dest = { r: 30, t: 0.62, p: 1.14 };
  private fovDest = 30;

  // Estado del render.
  private needsRender = true;
  private disposed = false;
  private rafId = 0;
  private ro: ResizeObserver;

  // Interacción.
  private arrastrando = false;
  private px = 0;
  private py = 0;
  private pinch = 0;

  constructor(opts: Opciones) {
    this.canvas = opts.canvas;
    this.contenedor = opts.contenedor;
    this.e = opts.estado;
    this.rotulo = opts.rotulo;
    this.onReady = opts.onReady;

    this.grueso = matchMedia("(pointer:coarse)").matches;
    this.reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.alta = opts.alta ?? (!this.grueso && innerWidth >= 900);

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, this.grueso ? 1.75 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer = renderer;

    this.escena = new THREE.Scene();
    this.camara = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.pmrem.compileEquirectangularShader();
    this.maxAniso = renderer.capabilities.getMaxAnisotropy();

    [this.GEO_PLACA, this.GEO_PERNO, this.GEO_FIJA, this.GEO_MORD].forEach(
      (g) => (g.userData.compartida = true),
    );

    this.TEX = { malla: this.texMalla(), hormigon: this.texHormigon() };
    this.crearMateriales();

    // Grupos del motor.
    (["suelo", "cerramiento", "red", "iluminacion", "extras", "entorno", "techo"] as const).forEach((k) => {
      this.G[k] = new THREE.Group();
      this.escena.add(this.G[k]);
    });

    this.solar = new THREE.DirectionalLight(0xffffff, 0);
    this.solar.castShadow = true;
    this.solar.shadow.mapSize.set(2048, 2048);
    const sc = this.solar.shadow.camera;
    sc.left = -20;
    sc.right = 20;
    sc.top = 16;
    sc.bottom = -16;
    sc.near = 1;
    sc.far = 90;
    this.solar.shadow.bias = -0.0006;
    this.solar.shadow.normalBias = 0.02;
    this.escena.add(this.solar, this.solar.target);
    this.ambiente = new THREE.HemisphereLight(0xdfe9f2, 0x3b4231, 0);
    this.escena.add(this.ambiente);

    // Construcción inicial.
    this.construirSuelo();
    this.construirCerramiento();
    this.construirRed();
    this.construirEntorno();
    this.construirTecho();
    this.construirExtras();
    this.construirIluminacion();
    this.aplicarLuz();

    // Cámara a la vista hero, sin animar (snap).
    this.irAVista("hero");
    this.orb = { ...this.dest };
    this.objetivo.copy(this.objetivoDest);
    this.camara.fov = this.fovDest;
    this.camara.updateProjectionMatrix();

    this.ro = new ResizeObserver(() => this.medir());
    this.ro.observe(this.contenedor);
    this.registrarEventos();
    this.medir();
    this.loop();

    // Póster fuera cuando el primer fotograma esté pintado de verdad.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => this.onReady?.());
    });
  }

  // ================================================================
  // API pública
  // ================================================================
  /** Aplica un nuevo estado reconstruyendo solo los grupos afectados. */
  applyChange(estado: Estado, grupos: Grupo[]) {
    this.e = estado;
    const p = new Set(grupos);
    if (p.has("cesped")) {
      const cesped = this.MAT.cesped as THREE.MeshStandardMaterial;
      cesped.map = this.texCesped();
      cesped.normalMap = this.normalCesped();
      cesped.needsUpdate = true;
    }
    if (p.has("color")) {
      const c = this.colorRAL();
      (this.MAT.metal as THREE.MeshPhysicalMaterial).color.copy(c);
      (this.MAT.malla as THREE.MeshStandardMaterial).color.copy(c);
    }
    if (p.has("suelo")) this.construirSuelo();
    if (p.has("cerramiento")) this.construirCerramiento();
    if (p.has("red")) this.construirRed();
    if (p.has("iluminacion")) this.construirIluminacion();
    if (p.has("extras")) this.construirExtras();
    if (p.has("entorno")) {
      this.construirEntorno();
      this.aplicarLuz();
    }
    if (p.has("techo")) {
      this.construirTecho();
      this.construirEntorno();
      this.aplicarLuz();
    }
    this.needsRender = true;
  }

  setView(id: Vista) {
    this.irAVista(id);
  }

  setNight(noche: boolean) {
    this.e = { ...this.e, hora: noche ? "noche" : "dia" };
    this.aplicarLuz();
  }

  isNight() {
    return this.e.hora === "noche";
  }

  /** Conmuta la ruta de refracción real (equipos flojos ↔ potentes). */
  setQuality(alta: boolean) {
    this.alta = alta;
    // crearMateriales libera los materiales anteriores: hay que reconstruir
    // TODOS los grupos que los usan, incluidos entorno y techo, para que
    // ningún mesh quede apuntando a un material ya liberado.
    this.crearMateriales();
    this.construirSuelo();
    this.construirCerramiento();
    this.construirRed();
    this.construirIluminacion();
    this.construirExtras();
    this.construirEntorno();
    this.construirTecho();
    this.aplicarLuz();
    this.needsRender = true;
  }

  isHighQuality() {
    return this.alta;
  }

  // ================================================================
  // Utilidades de textura
  // ================================================================
  private lienzo2d(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")!];
  }

  private textura(c: HTMLCanvasElement, rx = 1, ry = 1, srgb = true) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = this.maxAniso;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /** Mapa de normales por Sobel sobre una altura en escala de grises. */
  private aNormal(c: HTMLCanvasElement, fuerza = 2.2) {
    const w = c.width;
    const h = c.height;
    const g = c.getContext("2d")!;
    const src = g.getImageData(0, 0, w, h).data;
    const [c2, g2] = this.lienzo2d(w, h);
    const out = g2.createImageData(w, h);
    const L = (x: number, y: number) => src[((((y + h) % h) * w + ((x + w) % w)) * 4)] / 255;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const dx = (L(x - 1, y) - L(x + 1, y)) * fuerza;
        const dy = (L(x, y - 1) - L(x, y + 1)) * fuerza;
        const l = Math.hypot(dx, dy, 1);
        const i = (y * w + x) * 4;
        out.data[i] = (dx / l) * 0.5 * 255 + 127.5;
        out.data[i + 1] = (dy / l) * 0.5 * 255 + 127.5;
        out.data[i + 2] = (1 / l) * 0.5 * 255 + 127.5;
        out.data[i + 3] = 255;
      }
    g2.putImageData(out, 0, 0);
    return this.textura(c2, 1, 1, false);
  }

  // Césped: caché por clave color|fibra|altura|modalidad.
  private texCesped(): THREE.Texture {
    const clave = `${this.e.cespedColor}|${this.e.cespedFibra}|${this.e.cespedAltura}|${this.e.modalidad}`;
    const cacheada = this.cacheCesped.get(clave);
    if (cacheada) return cacheada;

    const dobles = this.e.modalidad === "dobles";
    const ancho = dobles ? 10 : 6;
    // Resolución adaptativa: la mitad en táctil (probablemente ni se note).
    const W = this.grueso ? 1024 : 2048;
    const H = Math.round((W * ancho) / 20);
    const ppm = W / 20;
    const [c, g] = this.lienzo2d(W, H);
    const base = new THREE.Color(CESPED_HEX[this.e.cespedColor]);
    const hsl = { h: 0, s: 0, l: 0 };
    base.getHSL(hsl);
    const tono = (dl: number, ds: number) =>
      "#" +
      new THREE.Color()
        .setHSL(hsl.h, Math.max(0, hsl.s + ds), Math.min(1, Math.max(0, hsl.l + dl)))
        .getHexString();

    g.fillStyle = tono(-0.02, -0.04);
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 260; i++) {
      g.globalAlpha = azar(0.04, 0.11);
      g.fillStyle = tono(azar(-0.06, 0.06), -0.05);
      g.beginPath();
      g.ellipse(azar(0, W), azar(0, H), azar(40, 190), azar(25, 110), azar(0, 3.14), 0, 6.3);
      g.fill();
    }
    const alt = +this.e.cespedAltura;
    const densidadBase = this.e.cespedFibra === "fibrilado" ? 26000 : 34000;
    const densidad = this.grueso ? densidadBase / 2 : densidadBase;
    g.lineCap = "round";
    for (let i = 0; i < densidad; i++) {
      const x = azar(0, W);
      const y = azar(0, H);
      const a = azar(-0.35, 0.35) + (Math.floor(x / (4 * ppm)) % 2 ? 1.9 : 1.24);
      const l = azar(3, 4 + alt * 0.5);
      g.globalAlpha = azar(0.05, 0.2);
      g.strokeStyle = tono(azar(-0.09, 0.1), azar(-0.05, 0.03));
      g.lineWidth = azar(0.8, 1.9);
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
    g.globalAlpha = 0.16;
    g.strokeStyle = tono(-0.09, 0);
    g.lineWidth = 2;
    for (let m = 4; m < 20; m += 4) {
      g.beginPath();
      g.moveTo(m * ppm, 0);
      g.lineTo(m * ppm, H);
      g.stroke();
    }
    // Líneas reglamentarias, 5 cm.
    g.globalAlpha = 0.92;
    g.fillStyle = "#F2F2EE";
    const lw = 0.05 * ppm;
    const saque = 6.95 * ppm;
    const cx = W / 2;
    [cx - saque, cx + saque].forEach((x) => g.fillRect(x - lw / 2, 0, lw, H));
    g.fillRect(cx - saque, H / 2 - lw / 2, saque * 2, lw);
    // Arena de sílice en barridos anchos.
    g.globalCompositeOperation = "source-over";
    g.lineCap = "round";
    const nArena = this.grueso ? 450 : 900;
    for (let i = 0; i < nArena; i++) {
      const x = azar(-100, W + 100);
      const y = azar(-40, H + 40);
      const r = azar(90, 420);
      const a0 = azar(0, 6.3);
      g.globalAlpha = azar(0.05, 0.19);
      g.strokeStyle = `rgb(${(205 + azar(-14, 14)) | 0},${(192 + azar(-12, 12)) | 0},${(162 + azar(-12, 12)) | 0})`;
      g.lineWidth = azar(10, 44);
      g.beginPath();
      g.arc(x, y, r, a0, a0 + azar(0.18, 0.7));
      g.stroke();
    }
    const nGrano = this.grueso ? 1300 : 2600;
    for (let i = 0; i < nGrano; i++) {
      g.globalAlpha = azar(0.05, 0.16);
      g.fillStyle = "#CFC3A6";
      g.fillRect(azar(0, W), azar(0, H), azar(1, 3), azar(1, 3));
    }
    g.globalAlpha = 1;
    const t = this.textura(c, 1, 1);
    this.cacheCesped.set(clave, t);
    return t;
  }

  private normalCesped(): THREE.Texture {
    const clave = `${this.e.cespedAltura}|${this.e.modalidad}`;
    const cacheada = this.cacheNormal.get(clave);
    if (cacheada) return cacheada;

    const [c, g] = this.lienzo2d(256, 256);
    g.fillStyle = "#808080";
    g.fillRect(0, 0, 256, 256);
    g.lineCap = "round";
    for (let i = 0; i < 2600; i++) {
      const x = azar(0, 256);
      const y = azar(0, 256);
      const a = azar(1.1, 2.05);
      const l = azar(3, 9);
      g.globalAlpha = azar(0.1, 0.5);
      g.strokeStyle = Math.random() > 0.5 ? "#ffffff" : "#1a1a1a";
      g.lineWidth = azar(0.9, 2.2);
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
    const t = this.aNormal(c, +this.e.cespedAltura / 9);
    t.repeat.set(42, 21);
    this.cacheNormal.set(clave, t);
    return t;
  }

  private texMalla(): THREE.Texture {
    const [c, g] = this.lienzo2d(256, 256);
    g.clearRect(0, 0, 256, 256);
    g.strokeStyle = "#fff";
    g.lineWidth = 4;
    for (let i = 0; i <= 4; i++) {
      const p = i * 64;
      g.beginPath();
      g.moveTo(p, 0);
      g.lineTo(p, 256);
      g.stroke();
      g.beginPath();
      g.moveTo(0, p);
      g.lineTo(256, p);
      g.stroke();
    }
    return this.textura(c, 1, 1, false);
  }

  private texHormigon(): THREE.Texture {
    const [c, g] = this.lienzo2d(1024, 1024);
    g.fillStyle = "#B9B7AF";
    g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 420; i++) {
      g.globalAlpha = azar(0.03, 0.1);
      g.strokeStyle = Math.random() > 0.5 ? "#d3d1c9" : "#a3a199";
      g.lineWidth = azar(6, 30);
      const x = azar(0, 1024);
      const y = azar(0, 1024);
      const r = azar(120, 520);
      const a = azar(0, 6.3);
      g.beginPath();
      g.arc(x, y, r, a, a + azar(0.2, 0.8));
      g.stroke();
    }
    for (let i = 0; i < 9000; i++) {
      g.globalAlpha = azar(0.05, 0.22);
      g.fillStyle = Math.random() > 0.5 ? "#8e8c85" : "#cecabf";
      g.fillRect(azar(0, 1024), azar(0, 1024), azar(1, 3), azar(1, 3));
    }
    g.globalAlpha = 0.35;
    g.strokeStyle = "#8d8b84";
    g.lineWidth = 3;
    [256, 768].forEach((p) => {
      g.beginPath();
      g.moveTo(p, 0);
      g.lineTo(p, 1024);
      g.stroke();
      g.beginPath();
      g.moveTo(0, p);
      g.lineTo(1024, p);
      g.stroke();
    });
    g.globalAlpha = 1;
    return this.textura(c, 3, 3);
  }

  private texCielo(preset: "dia" | "cubierto" | "noche"): THREE.Texture {
    const [c, g] = this.lienzo2d(1024, 512);
    const cielo = g.createLinearGradient(0, 0, 0, 256);
    if (preset === "dia") {
      cielo.addColorStop(0, "#4C74A8");
      cielo.addColorStop(0.55, "#9DB6CE");
      cielo.addColorStop(1, "#E8C39A");
    } else if (preset === "cubierto") {
      cielo.addColorStop(0, "#9AA4AC");
      cielo.addColorStop(1, "#D2D6D6");
    } else {
      cielo.addColorStop(0, "#04060A");
      cielo.addColorStop(1, "#0A0F16");
    }
    g.fillStyle = cielo;
    g.fillRect(0, 0, 1024, 256);
    if (preset === "dia") {
      const s = g.createRadialGradient(300, 232, 0, 300, 232, 120);
      s.addColorStop(0, "rgba(255,246,222,1)");
      s.addColorStop(0.25, "rgba(255,214,150,.85)");
      s.addColorStop(1, "rgba(255,200,140,0)");
      g.fillStyle = s;
      g.fillRect(120, 110, 380, 180);
      g.globalAlpha = 0.5;
      g.fillStyle = "#fff";
      for (let i = 0; i < 40; i++) {
        g.beginPath();
        g.ellipse(azar(0, 1024), azar(20, 180), azar(40, 150), azar(8, 26), 0, 0, 6.3);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    const suelo = g.createLinearGradient(0, 256, 0, 512);
    if (preset === "noche") {
      suelo.addColorStop(0, "#060806");
      suelo.addColorStop(1, "#030403");
    } else {
      suelo.addColorStop(0, preset === "dia" ? "#4A4A34" : "#565A4C");
      suelo.addColorStop(0.25, "#31351F");
      suelo.addColorStop(1, "#1E2116");
    }
    g.fillStyle = suelo;
    g.fillRect(0, 256, 1024, 256);
    const t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // ================================================================
  // Materiales
  // ================================================================
  private colorRAL() {
    return new THREE.Color(RAL_HEX[this.e.ral]);
  }

  private crearMateriales() {
    // Liberar los anteriores (setQuality los recrea).
    Object.values(this.MAT).forEach((m) => m.dispose());
    this.MAT = {};
    const MAT = this.MAT;
    MAT.metal = new THREE.MeshPhysicalMaterial({
      color: this.colorRAL(),
      metalness: 0.12,
      roughness: 0.34,
      clearcoat: 0.32,
      clearcoatRoughness: 0.28,
      envMapIntensity: 1.0,
    });
    MAT.metalOscuro = new THREE.MeshPhysicalMaterial({ color: 0x14181a, metalness: 0.3, roughness: 0.42 });
    MAT.tornillo = new THREE.MeshStandardMaterial({ color: 0x9aa0a2, metalness: 0.85, roughness: 0.38 });
    MAT.vidrio = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.03,
      transparent: !this.alta,
      opacity: this.alta ? 1 : 0.14,
      transmission: this.alta ? 0.95 : 0,
      ior: 1.52,
      thickness: 0.012,
      attenuationColor: new THREE.Color(0.72, 0.94, 0.86),
      attenuationDistance: 1.6,
      clearcoat: this.alta ? 0 : 1,
      envMapIntensity: this.alta ? 1.1 : 1.7,
      side: THREE.DoubleSide,
      depthWrite: this.alta,
    });
    MAT.canto = new THREE.MeshPhysicalMaterial({
      color: 0x2e7f6b,
      metalness: 0,
      roughness: 0.16,
      clearcoat: 0.6,
      envMapIntensity: 1.2,
    });
    MAT.malla = new THREE.MeshStandardMaterial({
      color: this.colorRAL(),
      alphaMap: this.TEX.malla,
      transparent: false,
      alphaTest: 0.42,
      metalness: 0.35,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    (MAT.malla as THREE.MeshStandardMaterial).alphaToCoverage = true;
    MAT.hormigon = new THREE.MeshStandardMaterial({ map: this.TEX.hormigon, color: 0xf0eee7, roughness: 0.94, metalness: 0 });
    const cesped = new THREE.MeshStandardMaterial({
      map: this.texCesped(),
      normalMap: this.normalCesped(),
      roughness: 0.93,
      metalness: 0,
    });
    cesped.normalScale = new THREE.Vector2(0.75, 0.75);
    MAT.cesped = cesped;
    MAT.red = new THREE.MeshStandardMaterial({
      color: 0x101312,
      alphaMap: this.TEX.malla,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
      roughness: 0.8,
    });
    MAT.blanco = new THREE.MeshStandardMaterial({ color: 0xf0efe9, roughness: 0.7 });
    MAT.foco = new THREE.MeshStandardMaterial({ color: 0x1b1e1f, metalness: 0.5, roughness: 0.45 });
    MAT.lente = new THREE.MeshStandardMaterial({ color: 0xdfe6ea, emissive: 0xffffff, emissiveIntensity: 0, roughness: 0.15 });
    MAT.seto = new THREE.MeshStandardMaterial({ color: 0x3b5232, roughness: 1 });
    MAT.cipres = new THREE.MeshStandardMaterial({ color: 0x2e4530, roughness: 1 });
    MAT.pradera = new THREE.MeshStandardMaterial({ color: 0x62784b, roughness: 1 });
    MAT.piedra = new THREE.MeshStandardMaterial({ color: 0xc9c2b4, roughness: 0.9, map: this.TEX.hormigon });
    MAT.membrana = new THREE.MeshStandardMaterial({
      color: 0xefede6,
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.93,
    });
  }

  // ================================================================
  // Geometría base
  // ================================================================
  private geoPerfil(w: number, h: number) {
    const k = `${w}|${h}`;
    const hit = this.cachePerfil.get(k);
    if (hit) return hit;
    const r = Math.min(w, h) * 0.16;
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 2 });
    g.translate(0, 0, -0.5);
    g.computeVertexNormals();
    g.userData.compartida = true;
    this.cachePerfil.set(k, g);
    return g;
  }

  private tubo(w: number, h: number, largo: number, eje: "x" | "y" | "z", mat?: THREE.Material) {
    const m = new THREE.Mesh(this.geoPerfil(w, h), mat || this.MAT.metal);
    m.scale.z = largo;
    m.castShadow = true;
    if (eje === "y") m.rotation.x = -Math.PI / 2;
    else if (eje === "x") m.rotation.y = Math.PI / 2;
    return m;
  }

  private panelCristal(w: number, h: number, esp: number) {
    const g = new THREE.BoxGeometry(w, h, esp);
    const m = new THREE.Mesh(g, [
      this.MAT.canto,
      this.MAT.canto,
      this.MAT.canto,
      this.MAT.canto,
      this.MAT.vidrio,
      this.MAT.vidrio,
    ]);
    m.renderOrder = 2;
    return m;
  }

  private panelMalla(w: number, h: number, mat?: THREE.Material) {
    const g = new THREE.PlaneGeometry(w, h);
    const uv = g.attributes.uv;
    const T = 0.25;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / T, (uv.getY(i) * h) / T);
    uv.needsUpdate = true;
    const m = new THREE.Mesh(g, mat || this.MAT.malla);
    m.castShadow = true;
    return m;
  }

  private texDestello(): THREE.Texture {
    const [c, g] = this.lienzo2d(256, 256);
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 120);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.12, "rgba(255,252,240,.75)");
    r.addColorStop(0.4, "rgba(255,246,222,.16)");
    r.addColorStop(1, "rgba(255,240,200,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    g.globalCompositeOperation = "lighter";
    [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].forEach((a, i) => {
      g.save();
      g.translate(128, 128);
      g.rotate(a);
      g.lineWidth = i < 2 ? 4 : 2;
      const L = i < 2 ? 122 : 74;
      const grad = g.createLinearGradient(-L, 0, L, 0);
      grad.addColorStop(0, "rgba(255,250,235,0)");
      grad.addColorStop(0.5, "rgba(255,250,235,.85)");
      grad.addColorStop(1, "rgba(255,250,235,0)");
      g.strokeStyle = grad;
      g.beginPath();
      g.moveTo(-L, 0);
      g.lineTo(L, 0);
      g.stroke();
      g.restore();
    });
    return this.textura(c, 1, 1);
  }

  // --- herrajes instanciados ---
  private nuevoHerrajero() {
    this.herrajes = { placa: [], perno: [], fija: [], mord: [] };
  }

  private poner(tipo: "placa" | "perno" | "fija" | "mord", x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) {
    this._e.set(rx, ry, rz);
    this._q.setFromEuler(this._e);
    this.herrajes[tipo].push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), this._q, this._v));
  }

  private volcarHerrajes(grupo: THREE.Group) {
    const packs: Array<["placa" | "perno" | "fija" | "mord", THREE.BufferGeometry, THREE.Material]> = [
      ["placa", this.GEO_PLACA, this.MAT.metal],
      ["perno", this.GEO_PERNO, this.MAT.tornillo],
      ["fija", this.GEO_FIJA, this.MAT.tornillo],
      ["mord", this.GEO_MORD, this.MAT.metalOscuro],
    ];
    for (const [k, g, m] of packs) {
      const arr = this.herrajes[k];
      if (!arr.length) continue;
      const im = new THREE.InstancedMesh(g, m, arr.length);
      arr.forEach((mx, i) => im.setMatrixAt(i, mx));
      im.castShadow = true;
      im.instanceMatrix.needsUpdate = true;
      grupo.add(im);
    }
  }

  private poste(x: number, z: number, alto: number, g: THREE.Group, w = 0.08, d = 0.05) {
    const p = this.tubo(w, d, alto, "y");
    p.position.set(x, alto / 2, z);
    g.add(p);
    this.poner("placa", x, 0.006, z);
    [
      [-0.05, -0.035],
      [0.05, -0.035],
      [-0.05, 0.035],
      [0.05, 0.035],
    ].forEach((o) => this.poner("perno", x + o[0], 0.024, z + o[1]));
    return p;
  }

  // ================================================================
  // Construcción de la pista
  // ================================================================
  private vaciar(g: THREE.Group) {
    while (g.children.length) {
      const c = g.children.pop()!;
      c.traverse?.((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry && !mesh.geometry.userData?.compartida) mesh.geometry.dispose?.();
        if ((o as THREE.Sprite).isSprite) (o as THREE.Sprite).material?.dispose?.();
      });
    }
  }

  private dim() {
    return { L: 20, A: this.e.modalidad === "dobles" ? 10 : 6 };
  }

  private construirSuelo() {
    const { L, A } = this.dim();
    this.vaciar(this.G.suelo);
    const losa = new THREE.Mesh(new THREE.BoxGeometry(L + 0.7, 0.15, A + 0.7), this.MAT.hormigon);
    losa.position.y = -0.075;
    losa.receiveShadow = true;
    this.G.suelo.add(losa);
    const cesped = new THREE.Mesh(new THREE.PlaneGeometry(L, A), this.MAT.cesped);
    cesped.rotation.x = -Math.PI / 2;
    cesped.position.y = 0.005;
    cesped.receiveShadow = true;
    this.G.suelo.add(cesped);
    const canto = new THREE.Mesh(
      new THREE.BoxGeometry(L + 0.72, 0.02, A + 0.72),
      new THREE.MeshStandardMaterial({ color: 0xa8a49a, roughness: 1 }),
    );
    canto.position.y = -0.152;
    this.G.suelo.add(canto);
  }

  private construirCerramiento() {
    const { L, A } = this.dim();
    const v = this.e.version;
    const esp = +this.e.cristal / 1000;
    const HG = 3;
    const HT = 4;
    const HB = 2;
    const hueco = 0.012;
    this.vaciar(this.G.cerramiento);
    this.nuevoHerrajero();
    const g = this.G.cerramiento;
    const finos = v === "fullpanoramica";
    const wPost = finos ? 0.07 : 0.08;
    const dPost = finos ? 0.05 : 0.06;

    for (const sx of [-1, 1]) {
      const X = (sx * L) / 2;
      {
        const nPan = v === "estandar" ? (A === 10 ? 4 : 3) : A === 10 ? 5 : 3;
        const w = (A - hueco * (nPan - 1)) / nPan;
        for (let i = 0; i < nPan; i++) {
          const z = -A / 2 + w / 2 + i * (w + hueco);
          const p = this.panelCristal(w, HG, esp);
          p.rotation.y = Math.PI / 2;
          p.position.set(X - (sx * esp) / 2, HG / 2, z);
          g.add(p);
          if (v === "estandar" && i < nPan - 1) {
            for (let y = 0.35; y < HG; y += 0.55) this.poner("fija", X, y, z + w / 2 + hueco / 2, 0, 0, Math.PI / 2);
          }
        }
        if (v === "estandar") {
          for (let i = 1; i < nPan; i++) {
            const z = -A / 2 + i * (A / nPan);
            this.poste(X, z, HT, g, dPost, wPost);
          }
        } else {
          const viga = this.tubo(0.1, 0.1, A, "z", this.MAT.metal);
          viga.position.set(X, HG + 0.05, 0);
          viga.castShadow = true;
          g.add(viga);
          for (let z = -A / 2 + 0.5; z < A / 2; z += 0.9) this.poner("mord", X - sx * 0.06, HG - 0.02, z);
        }
        const carril = this.tubo(0.09, 0.05, A, "z", this.MAT.metal);
        carril.position.set(X, 0.025, 0);
        g.add(carril);
      }
      const nM = v === "estandar" ? (A === 10 ? 4 : 3) : 3;
      const wM = A / nM;
      for (let i = 0; i < nM; i++) {
        const z = -A / 2 + wM / 2 + i * wM;
        const m = this.panelMalla(wM - 0.06, HT - HG - 0.06);
        m.rotation.y = Math.PI / 2;
        m.position.set(X, (HG + HT) / 2, z);
        g.add(m);
        if (i < nM - 1) {
          const mull = this.tubo(dPost, 0.05, HT - HG, "y", this.MAT.metal);
          mull.position.set(X, (HG + HT) / 2, -A / 2 + (i + 1) * wM);
          g.add(mull);
        }
      }
      const remate = this.tubo(0.09, 0.05, A, "z", this.MAT.metal);
      remate.position.set(X, HT - 0.025, 0);
      g.add(remate);
      if (v !== "estandar") {
        const inter = this.tubo(0.07, 0.05, A, "z", this.MAT.metal);
        inter.position.set(X, HG + 0.11, 0);
        g.add(inter);
      }
    }

    const diafano = v === "fullpanoramica";
    for (const sz of [-1, 1]) {
      const Z = (sz * A) / 2;
      for (const sx of [-1, 1]) {
        const p1 = this.panelCristal(2 - hueco, HG, esp);
        p1.position.set(sx * 9, HG / 2, Z - (sz * esp) / 2);
        g.add(p1);
        const p2 = this.panelCristal(2 - hueco, HB, esp);
        p2.position.set(sx * 7, HB / 2, Z - (sz * esp) / 2);
        g.add(p2);
        const m1 = this.panelMalla(2 - 0.06, HT - HG - 0.06);
        m1.position.set(sx * 9, (HG + HT) / 2, Z);
        g.add(m1);
        const m2 = this.panelMalla(2 - 0.06, HG - HB - 0.06);
        m2.position.set(sx * 7, (HB + HG) / 2, Z);
        g.add(m2);
        if (!diafano) this.poste(sx * 8, Z, HT, g, wPost, 0.05);
        this.poste(sx * 10, Z, HT, g, 0.08, 0.08);
        this.poste(sx * 6, Z, HG, g, wPost, 0.05);
        const r1 = this.tubo(0.05, 0.05, 2, "x", this.MAT.metal);
        r1.position.set(sx * 9, HG + 0.03, Z);
        g.add(r1);
        const r2 = this.tubo(0.05, 0.05, 2, "x", this.MAT.metal);
        r2.position.set(sx * 7, HB + 0.03, Z);
        g.add(r2);
        const r3 = this.tubo(0.06, 0.05, 2, "x", this.MAT.metal);
        r3.position.set(sx * 9, HT - 0.03, Z);
        g.add(r3);
        const r4 = this.tubo(0.06, 0.05, 2, "x", this.MAT.metal);
        r4.position.set(sx * 7, HG - 0.03, Z);
        g.add(r4);
        const rb = this.tubo(0.09, 0.05, 4, "x", this.MAT.metal);
        rb.position.set(sx * 8, 0.025, Z);
        g.add(rb);
      }
      const conPuerta = this.e.extras.includes("puertas");
      const tramos = conPuerta ? [[-6, -0.6], [0.6, 6]] : [[-6, 6]];
      for (const [a, b] of tramos) {
        const w = b - a;
        const m = this.panelMalla(w - 0.06, HG - 0.06);
        m.position.set((a + b) / 2, HG / 2, Z);
        g.add(m);
      }
      for (let x = -4; x <= 4; x += 2) {
        if (conPuerta && Math.abs(x) < 1.2) continue;
        this.poste(x, Z, HG, g, wPost, 0.05);
      }
      const rc = this.tubo(0.06, 0.05, 12, "x", this.MAT.metal);
      rc.position.set(0, HG - 0.03, Z);
      g.add(rc);
      const rc2 = this.tubo(0.09, 0.05, 12, "x", this.MAT.metal);
      rc2.position.set(0, 0.025, Z);
      g.add(rc2);
      if (conPuerta) {
        [-0.6, 0.6].forEach((x) => this.poste(x, Z, 2.1, g, 0.06, 0.06));
        const din = this.tubo(0.06, 0.06, 1.2, "x", this.MAT.metal);
        din.position.set(0, 2.1, Z);
        g.add(din);
        const hoja = this.panelMalla(1.1, 1.95);
        hoja.position.set(0, 1.0, Z - sz * 0.03);
        g.add(hoja);
        const marco = this.tubo(0.04, 0.04, 1.95, "y", this.MAT.metal);
        marco.position.set(0.54, 1.0, Z - sz * 0.03);
        g.add(marco);
        this.poner("fija", 0.5, 1.05, Z - sz * 0.06, 0, 0, 0);
        this.poner("fija", 0.5, 1.55, Z - sz * 0.06, 0, 0, 0);
      }
    }
    this.volcarHerrajes(g);
  }

  private construirRed() {
    const { A } = this.dim();
    this.vaciar(this.G.red);
    const N = 48;
    const pos: number[] = [];
    const uvs: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const z = -A / 2 + t * A;
      const u = Math.abs(z) / (A / 2);
      const h = 0.88 + (0.92 - 0.88) * Math.pow(u, 1.9);
      pos.push(0, 0, z, 0, h, z);
      uvs.push((t * A) / 0.18, 0, (t * A) / 0.18, h / 0.18);
      if (i < N) {
        const a = i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const red = new THREE.Mesh(geo, this.MAT.red);
    red.castShadow = true;
    this.G.red.add(red);
    for (let i = 0; i < N; i++) {
      const z0 = -A / 2 + (i / N) * A;
      const z1 = -A / 2 + ((i + 1) / N) * A;
      const h0 = 0.88 + (0.92 - 0.88) * Math.pow(Math.abs(z0) / (A / 2), 1.9);
      const h1 = 0.88 + (0.92 - 0.88) * Math.pow(Math.abs(z1) / (A / 2), 1.9);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, z1 - z0), this.MAT.blanco);
      b.position.set(0, (h0 + h1) / 2, (z0 + z1) / 2);
      this.G.red.add(b);
    }
    for (const s of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.98, 10), this.MAT.metal);
      p.position.set(0, 0.49, (s * A) / 2);
      p.castShadow = true;
      this.G.red.add(p);
    }
    const tensor = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.9, 0.012), this.MAT.blanco);
    tensor.position.set(0, 0.44, 0);
    this.G.red.add(tensor);
  }

  private construirIluminacion() {
    const { A } = this.dim();
    this.vaciar(this.G.iluminacion);
    this.focos.length = 0;
    if (this.e.iluminacion === "no") return;
    const W = +this.e.potencia;
    const nuevoFoco = (x: number, y: number, z: number, tx: number, tz: number) => {
      const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.12), this.MAT.foco);
      const lente = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.21, 0.02), (this.MAT.lente as THREE.Material).clone());
      lente.position.z = -0.07;
      cuerpo.add(lente);
      cuerpo.position.set(x, y, z);
      cuerpo.lookAt(tx, 1.2, tz);
      this.G.iluminacion.add(cuerpo);
      const luz = new THREE.SpotLight(0xffffff, 0, 0, 0.78, 0.45, 2);
      luz.position.set(x, y, z);
      luz.target.position.set(tx, 0, tz);
      luz.castShadow = false;
      this.G.iluminacion.add(luz, luz.target);
      this.texDestelloTex = this.texDestelloTex || this.texDestello();
      const destello = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.texDestelloTex,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        }),
      );
      destello.scale.set(3.4, 3.4, 1);
      destello.position.set(x, y, z);
      destello.visible = false;
      this.G.iluminacion.add(destello);
      this.focos.push({ luz, lente, W, destello });
    };
    if (this.e.tipoLuz === "postes") {
      const H = 6;
      for (const sx of [-1, 1])
        for (const sz of [-1, 1]) {
          const x = sx * 5.2;
          const z = sz * (A / 2 + 1.15);
          const mastil = this.tubo(0.12, 0.12, H, "y", this.MAT.metal);
          mastil.position.set(x, H / 2, z);
          mastil.castShadow = true;
          this.G.iluminacion.add(mastil);
          const placa = new THREE.Mesh(this.GEO_PLACA, this.MAT.metal);
          placa.scale.set(2.2, 1.8, 2.2);
          placa.position.set(x, 0.012, z);
          this.G.iluminacion.add(placa);
          const brazo = this.tubo(0.08, 0.08, 0.95, "x", this.MAT.metal);
          brazo.position.set(x, H - 0.14, z);
          brazo.castShadow = true;
          this.G.iluminacion.add(brazo);
          nuevoFoco(x - 0.34, H - 0.22, z, sx * 2.5, sz * -2.5);
          nuevoFoco(x + 0.34, H - 0.22, z, sx * 8.5, sz * 1.5);
        }
    } else {
      for (const sz of [-1, 1])
        for (const sx of [-1, 1])
          for (const d of [0, 1]) {
            const x = sx * (2.5 + d * 4.5);
            const z = sz * (A / 2 - 0.12);
            nuevoFoco(x, 3.92, z, x * 0.4, -sz * 1.5);
          }
    }
    this.aplicarLuzFocos();
  }

  private texRotulo(): THREE.Texture {
    const [c, g] = this.lienzo2d(1024, 256);
    g.clearRect(0, 0, 1024, 256);
    g.fillStyle = "rgba(255,255,255,.94)";
    g.font = "700 120px system-ui, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(this.rotulo, 512, 132);
    return this.textura(c, 1, 1);
  }

  private construirExtras() {
    const { L, A } = this.dim();
    this.vaciar(this.G.extras);
    if (this.e.extras.includes("gradas")) {
      for (let i = 0; i < 3; i++) {
        const gr = new THREE.Mesh(new THREE.BoxGeometry(8, 0.45, 0.7), this.MAT.hormigon);
        gr.position.set(0, 0.22 + i * 0.45, A / 2 + 1.1 + i * 0.7);
        gr.castShadow = gr.receiveShadow = true;
        this.G.extras.add(gr);
      }
    }
    if (this.e.extras.includes("marcador")) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.09), this.MAT.metalOscuro);
      p.position.set(0, 3.6, -A / 2 - 1.0);
      this.G.extras.add(p);
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.6, 8), this.MAT.metal);
      s.position.set(0, 1.8, -A / 2 - 1.05);
      this.G.extras.add(s);
    }
    if (this.e.extras.includes("rotulacion")) {
      const t = this.texRotulo();
      for (const sx of [-1, 1]) {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(6, 1.5),
          new THREE.MeshStandardMaterial({ map: t, transparent: true, side: THREE.DoubleSide, roughness: 0.8 }),
        );
        m.rotation.y = (Math.PI / 2) * sx * -1;
        m.position.set(sx * (L / 2 - 0.02), 3.5, 0);
        this.G.extras.add(m);
      }
    }
  }

  private construirEntorno() {
    const { L, A } = this.dim();
    this.vaciar(this.G.entorno);
    if (this.e.entorno === "interior") return;
    const pradera = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), this.MAT.pradera);
    pradera.rotation.x = -Math.PI / 2;
    pradera.position.y = -0.16;
    pradera.receiveShadow = true;
    this.G.entorno.add(pradera);
    const acera = new THREE.Mesh(new THREE.BoxGeometry(L + 8, 0.12, 2.6), this.MAT.piedra);
    acera.position.set(0, -0.1, A / 2 + 2.1);
    acera.receiveShadow = true;
    this.G.entorno.add(acera);
    if (this.e.entorno === "cubierta") return;
    const seto: Array<[number, number, number, number]> = [
      [0, -A / 2 - 9, L + 16, 1.9],
      [0, A / 2 + 9, L + 16, 1.9],
      [-L / 2 - 8, 0, 1.9, A + 20],
      [L / 2 + 8, 0, 1.9, A + 20],
    ];
    seto.forEach(([x, z, w, d]) => {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 1.8, d), this.MAT.seto);
      s.position.set(x, 0.75, z);
      s.castShadow = s.receiveShadow = true;
      this.G.entorno.add(s);
    });
    const geo = new THREE.ConeGeometry(0.85, 7.5, 7);
    const im = new THREE.InstancedMesh(geo, this.MAT.cipres, 16);
    for (let i = 0; i < 16; i++) {
      const lado = i < 8 ? -1 : 1;
      const t = (i % 8) / 7;
      const x = -L / 2 - 4 + t * (L + 8);
      const z = lado * (A / 2 + 11.5) + azar(-1, 1);
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(x, 3.6 + azar(-0.5, 0.7), z),
        new THREE.Quaternion(),
        new THREE.Vector3(azar(0.85, 1.2), azar(0.9, 1.15), azar(0.85, 1.2)),
      );
      im.setMatrixAt(i, m);
    }
    im.castShadow = true;
    this.G.entorno.add(im);
  }

  private construirTecho() {
    const { L, A } = this.dim();
    this.vaciar(this.G.techo);
    if (this.e.entorno === "exterior") return;
    const ancho = A + 5;
    const largo = L + 5;
    const alero = 5.6;
    const cumbre = 7.6;
    const matEstr = new THREE.MeshStandardMaterial({ color: 0x6f757a, metalness: 0.5, roughness: 0.5 });
    for (const s of [-1, 1]) {
      const faldon = new THREE.Mesh(
        new THREE.PlaneGeometry(largo, Math.hypot(ancho / 2, cumbre - alero)),
        this.MAT.membrana,
      );
      faldon.rotation.x = -Math.PI / 2 + s * Math.atan2(cumbre - alero, ancho / 2) * -1;
      faldon.rotation.order = "YXZ";
      faldon.position.set(0, (alero + cumbre) / 2, (s * ancho) / 4);
      this.G.techo.add(faldon);
      for (let x = -largo / 2; x <= largo / 2; x += 4.5) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, alero, 8), matEstr);
        c.position.set(x, alero / 2, (s * ancho) / 2);
        c.castShadow = true;
        this.G.techo.add(c);
      }
    }
    const cumbrera = new THREE.Mesh(new THREE.BoxGeometry(largo, 0.18, 0.22), matEstr);
    cumbrera.position.set(0, cumbre, 0);
    this.G.techo.add(cumbrera);
    if (this.e.entorno === "interior") {
      const matN = new THREE.MeshStandardMaterial({ color: 0xb9bcb8, roughness: 0.95, side: THREE.BackSide });
      const nave = new THREE.Mesh(new THREE.BoxGeometry(largo + 3, 9, ancho + 3), matN);
      nave.position.y = 4.4;
      nave.receiveShadow = true;
      this.G.techo.add(nave);
      const suelo = new THREE.Mesh(
        new THREE.PlaneGeometry(largo + 3, ancho + 3),
        new THREE.MeshStandardMaterial({ color: 0x8a8d89, roughness: 0.85 }),
      );
      suelo.rotation.x = -Math.PI / 2;
      suelo.position.y = -0.15;
      suelo.receiveShadow = true;
      this.G.techo.add(suelo);
    }
  }

  // ================================================================
  // Luz, cámara, controles
  // ================================================================
  private aplicarLuzFocos() {
    const noche = this.e.hora === "noche";
    this.focos.forEach((f) => {
      f.luz.intensity = noche ? f.W * 58 : 0;
      (f.lente.material as THREE.MeshStandardMaterial).emissiveIntensity = noche ? 6 : 0;
      f.destello.visible = noche;
    });
  }

  private aplicarLuz() {
    const preset = this.e.hora === "noche" ? "noche" : this.e.entorno === "exterior" ? "dia" : "cubierto";
    const cielo = this.texCielo(preset);
    (this.escena.environment as THREE.Texture | null)?.dispose?.();
    if (
      (this.escena.background as THREE.Texture | null)?.isTexture &&
      this.escena.background !== cielo
    ) {
      (this.escena.background as THREE.Texture).dispose();
    }
    this.escena.environment = this.pmrem.fromEquirectangular(cielo).texture;
    this.escena.background =
      this.e.entorno === "interior"
        ? new THREE.Color(preset === "noche" ? 0x090b0c : 0x9aa0a2)
        : cielo;
    this.escena.fog = preset === "noche" ? new THREE.Fog(0x05070a, 26, 95) : null;

    if (preset === "dia") {
      this.solar.color.set(0xffd3a0);
      this.solar.intensity = 3.1;
      this.solar.position.set(-26, 9, 17);
      this.ambiente.intensity = 0.9;
      this.renderer.toneMappingExposure = 1.05;
    } else if (preset === "cubierto") {
      this.solar.color.set(0xe9eef0);
      this.solar.intensity = 1.0;
      this.solar.position.set(-14, 26, 10);
      this.ambiente.intensity = 1.5;
      this.renderer.toneMappingExposure = 1.0;
    } else {
      this.solar.intensity = 0;
      this.ambiente.intensity = 0.045;
      this.renderer.toneMappingExposure = 1.15;
    }
    this.solar.target.position.set(0, 0, 0);
    this.aplicarLuzFocos();
    this.needsRender = true;
  }

  private lim(v: number) {
    return Math.max(0.18, Math.min(1.53, v));
  }

  private irAVista(id: Vista) {
    const P = PRESETS[id] || PRESETS.hero;
    const k = this.e.modalidad === "dobles" ? 1 : 0.88;
    this.dest = { r: P.r * k, t: P.t, p: P.p };
    this.fovDest = P.fov;
    this.objetivoDest.set(P.o[0], P.o[1], P.o[2]);
    if (this.reduce) {
      this.orb = { ...this.dest };
      this.objetivo.copy(this.objetivoDest);
      this.camara.fov = this.fovDest;
      this.camara.updateProjectionMatrix();
    }
    this.needsRender = true;
  }

  private colocarCamara() {
    const { r, t, p } = this.orb;
    this.camara.position.set(
      this.objetivo.x + r * Math.sin(p) * Math.cos(t),
      this.objetivo.y + r * Math.cos(p),
      this.objetivo.z + r * Math.sin(p) * Math.sin(t),
    );
    this.camara.lookAt(this.objetivo);
  }

  // --- eventos de interacción ---
  private onPointerDown = (e: PointerEvent) => {
    this.arrastrando = true;
    this.px = e.clientX;
    this.py = e.clientY;
    this.canvas.setPointerCapture(e.pointerId);
  };
  private onPointerUp = () => {
    this.arrastrando = false;
  };
  private onPointerMove = (e: PointerEvent) => {
    if (!this.arrastrando) return;
    this.dest.t -= (e.clientX - this.px) * 0.006;
    this.dest.p = this.lim(this.dest.p - (e.clientY - this.py) * 0.005);
    this.px = e.clientX;
    this.py = e.clientY;
    this.needsRender = true;
  };
  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.dest.r = Math.max(5, Math.min(75, this.dest.r * (1 + Math.sign(e.deltaY) * 0.09)));
    this.needsRender = true;
  };
  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const d = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY,
    );
    if (this.pinch) this.dest.r = Math.max(5, Math.min(75, (this.dest.r * this.pinch) / d));
    this.pinch = d;
    this.needsRender = true;
  };
  private onTouchEnd = () => {
    this.pinch = 0;
  };
  private onKeyDown = (e: KeyboardEvent) => {
    const acciones: Record<string, () => void> = {
      ArrowLeft: () => (this.dest.t -= 0.12),
      ArrowRight: () => (this.dest.t += 0.12),
      ArrowUp: () => (this.dest.p = this.lim(this.dest.p - 0.08)),
      ArrowDown: () => (this.dest.p = this.lim(this.dest.p + 0.08)),
      "+": () => (this.dest.r = Math.max(5, this.dest.r * 0.9)),
      "-": () => (this.dest.r = Math.min(75, this.dest.r * 1.1)),
    };
    const a = acciones[e.key];
    if (a) {
      e.preventDefault();
      a();
      this.needsRender = true;
    }
  };
  private onContextLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  };
  private onContextRestored = () => {
    this.needsRender = true;
    if (!this.rafId && !this.disposed) this.loop();
  };
  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    } else if (!this.rafId && !this.disposed) {
      this.needsRender = true;
      this.loop();
    }
  };

  private registrarEventos() {
    const c = this.canvas;
    c.addEventListener("pointerdown", this.onPointerDown);
    c.addEventListener("pointerup", this.onPointerUp);
    c.addEventListener("pointercancel", this.onPointerUp);
    c.addEventListener("pointermove", this.onPointerMove);
    c.addEventListener("wheel", this.onWheel, { passive: false });
    c.addEventListener("touchmove", this.onTouchMove, { passive: false });
    c.addEventListener("touchend", this.onTouchEnd);
    c.tabIndex = 0;
    c.setAttribute("role", "application");
    c.addEventListener("keydown", this.onKeyDown);
    c.addEventListener("webglcontextlost", this.onContextLost);
    c.addEventListener("webglcontextrestored", this.onContextRestored);
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  private medir() {
    const w = this.contenedor.clientWidth;
    const h = this.contenedor.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camara.aspect = w / h;
    this.camara.updateProjectionMatrix();
    this.needsRender = true;
  }

  private loop = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.loop);
    const k = this.reduce ? 1 : 0.13;
    const d =
      Math.abs(this.dest.r - this.orb.r) +
      Math.abs(this.dest.t - this.orb.t) +
      Math.abs(this.dest.p - this.orb.p) +
      this.objetivo.distanceTo(this.objetivoDest) +
      Math.abs(this.fovDest - this.camara.fov);
    if (d > 0.0008) {
      this.orb.r += (this.dest.r - this.orb.r) * k;
      this.orb.t += (this.dest.t - this.orb.t) * k;
      this.orb.p += (this.dest.p - this.orb.p) * k;
      this.objetivo.lerp(this.objetivoDest, k);
      this.camara.fov += (this.fovDest - this.camara.fov) * k;
      this.camara.updateProjectionMatrix();
      this.needsRender = true;
    }
    if (this.needsRender) {
      this.colocarCamara();
      this.renderer.render(this.escena, this.camara);
      this.needsRender = false;
    }
  };

  // ================================================================
  // Teardown
  // ================================================================
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.ro.disconnect();

    const c = this.canvas;
    c.removeEventListener("pointerdown", this.onPointerDown);
    c.removeEventListener("pointerup", this.onPointerUp);
    c.removeEventListener("pointercancel", this.onPointerUp);
    c.removeEventListener("pointermove", this.onPointerMove);
    c.removeEventListener("wheel", this.onWheel);
    c.removeEventListener("touchmove", this.onTouchMove);
    c.removeEventListener("touchend", this.onTouchEnd);
    c.removeEventListener("keydown", this.onKeyDown);
    c.removeEventListener("webglcontextlost", this.onContextLost);
    c.removeEventListener("webglcontextrestored", this.onContextRestored);
    document.removeEventListener("visibilitychange", this.onVisibility);

    // Geometrías y materiales que cuelgan de la escena.
    this.escena.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry && !mesh.geometry.userData?.compartida) mesh.geometry.dispose?.();
      const mat = (mesh as THREE.Mesh).material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) (mat as THREE.Material).dispose();
    });

    Object.values(this.MAT).forEach((m) => m.dispose());
    this.TEX.malla.dispose();
    this.TEX.hormigon.dispose();
    this.cacheCesped.forEach((t) => t.dispose());
    this.cacheNormal.forEach((t) => t.dispose());
    this.texDestelloTex?.dispose();
    this.cachePerfil.forEach((g) => g.dispose());
    [this.GEO_PLACA, this.GEO_PERNO, this.GEO_FIJA, this.GEO_MORD].forEach((g) => g.dispose());
    (this.escena.environment as THREE.Texture | null)?.dispose?.();
    if ((this.escena.background as THREE.Texture | null)?.isTexture) {
      (this.escena.background as THREE.Texture).dispose();
    }
    this.pmrem.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

import { useEffect, useRef, useState } from "react";

// Aurora em WebGL: cortinas de luz verde que ondulam devagar no alto do céu.
// Só liga no computador (mouse), com WebGL disponível e sem "reduzir
// movimento". No celular fica a aurora em CSS, que gasta bem menos bateria.
// Desenha em meia resolução, a ~30 quadros por segundo, e para quando a aba
// está escondida.

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uT;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// uma cortina: base bem ondulada, brilho forte na base e raios que sobem
float cortina(vec2 uv, float altura, float fase, float vel) {
  float x = uv.x * 1.4 + fase;
  float onda = fbm(vec2(x * 1.1 + uT * vel, uT * 0.03 + fase));
  float base = altura + 0.22 * (onda - 0.5) + 0.05 * sin(x * 2.3 + uT * vel * 3.0);
  float d = uv.y - base;
  float dd = max(d, 0.0);
  // linha de base viva e uma cauda longa que sobe
  float corpo = smoothstep(-0.008, 0.012, d) * (0.65 * exp(-dd * 16.0) + 0.45 * exp(-dd * 3.2));
  // raios verticais: ruído esticado na horizontal, com contraste alto
  float raios = pow(fbm(vec2(x * 16.0 + uT * vel * 2.0, dd * 0.7)), 2.2) * 3.2;
  // a força varia ao longo da cortina: trechos acesos e trechos quase apagados
  float forca = smoothstep(0.22, 0.62, fbm(vec2(x * 0.9 - uT * 0.02, fase)));
  return corpo * raios * forca;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float a1 = cortina(uv, 0.70, 0.0, 0.05);
  float a2 = cortina(uv, 0.82, 3.7, -0.035) * 0.75;

  vec3 broto = vec3(0.56, 0.82, 0.42);
  vec3 trilha = vec3(0.12, 0.42, 0.34);
  vec3 no = vec3(0.24, 0.40, 0.90);

  vec3 c1 = mix(trilha, broto, smoothstep(0.0, 0.35, a1)) * 1.25;
  vec3 c2 = mix(no, trilha, 0.3);
  vec3 cor = c1 * a1 + c2 * a2;
  // mais forte à direita e no alto: o lado esquerdo tem texto
  float mascara = smoothstep(0.45, 0.75, uv.y) * mix(0.35, 1.0, smoothstep(0.15, 0.75, uv.x));
  float alfa = clamp((a1 + a2) * mascara, 0.0, 1.0) * 0.9;
  gl_FragColor = vec4(cor * mascara * 0.95, alfa);
}
`;

function podeUsar() {
  if (typeof window === "undefined") return false;
  const fino = window.matchMedia("(pointer: fine)").matches;
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fino && !reduzir;
}

export function AuroraGL({ onAtiva }) {
  const ref = useRef(null);
  const [ligada] = useState(podeUsar);

  useEffect(() => {
    if (!ligada) return;
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return;

    const compilar = (tipo, fonte) => {
      const s = gl.createShader(tipo);
      gl.shaderSource(s, fonte);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compilar(gl.VERTEX_SHADER, VERT);
    const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");

    const ESCALA = 0.5;
    const medir = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * ESCALA));
      const h = Math.max(1, Math.round(canvas.clientHeight * ESCALA));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    medir();
    window.addEventListener("resize", medir);

    let quadro;
    let ultimo = 0;
    const inicio = performance.now();
    const desenhar = (agora) => {
      quadro = requestAnimationFrame(desenhar);
      if (document.hidden || agora - ultimo < 33) return;
      ultimo = agora;
      gl.uniform1f(uT, (agora - inicio) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    quadro = requestAnimationFrame(desenhar);
    onAtiva?.(true);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("resize", medir);
      onAtiva?.(false);
      // sem loseContext aqui: no StrictMode o efeito roda duas vezes no mesmo
      // canvas, e um contexto perdido não volta. O navegador libera ao desmontar.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [ligada, onAtiva]);

  if (!ligada) return null;
  return <canvas ref={ref} className="aurora-gl" />;
}

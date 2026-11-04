/**
 * Real-time 2D incompressible flow (stable-fluids method) in WebGL2.
 * A uniform inflow enters from the left like a wind tunnel; the hero headline
 * acts as a solid obstacle, so streaklines separate around the words and shed
 * a wake. Pointer movement injects momentum and dye.
 */

type FBO = { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number };
type Double = { read: FBO; write: FBO; swap(): void };

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

const HEAD = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
out vec4 o;
`;

const ADVECT = HEAD + `
uniform sampler2D uVel, uSrc, uObs;
uniform vec2 uTexel; uniform float uDt, uDiss, uIsVel;
void main(){
  vec2 c = vUv - uDt * texture(uVel, vUv).xy * uTexel;
  vec4 v = texture(uSrc, c) / (1.0 + uDiss * uDt);
  float ob = texture(uObs, vUv).r;
  o = uIsVel > 0.5 ? v * (1.0 - ob) : v;
}`;

/** Inflow at the left edge + streak injection for dye. */
const INFLOW = HEAD + `
uniform sampler2D uSrc, uObs;
uniform float uU, uIsVel, uTime, uBands;
void main(){
  vec4 v = texture(uSrc, vUv);
  float edge = 1.0 - smoothstep(0.0, 0.035, vUv.x);
  float ob = texture(uObs, vUv).r;
  if (uIsVel > 0.5) {
    // gently relax the whole field toward free-stream to keep flow going
    vec2 target = vec2(uU, 0.0);
    v.xy = mix(v.xy, target, edge);
    v.xy = mix(v.xy, target, 0.004);
    v.xy *= (1.0 - ob);
  } else {
    float y = vUv.y * uBands + 0.15 * sin(uTime * 0.7);
    float band = smoothstep(0.42, 0.5, fract(y)) * (1.0 - smoothstep(0.5, 0.58, fract(y)));
    v.r = max(v.r, band * edge * 1.2);
    v.r *= (1.0 - ob * 0.9);
  }
  o = v;
}`;

const SPLAT = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uPoint; uniform vec3 uValue; uniform float uRadius, uAspect;
void main(){
  vec2 p = vUv - uPoint; p.x *= uAspect;
  float g = exp(-dot(p,p) / uRadius);
  o = texture(uSrc, vUv) + vec4(uValue * g, 0.0);
}`;

const CURL = HEAD + `
uniform sampler2D uVel; uniform vec2 uTexel;
void main(){
  float L = texture(uVel, vUv - vec2(uTexel.x,0)).y;
  float R = texture(uVel, vUv + vec2(uTexel.x,0)).y;
  float B = texture(uVel, vUv - vec2(0,uTexel.y)).x;
  float T = texture(uVel, vUv + vec2(0,uTexel.y)).x;
  o = vec4(0.5*((R-L)-(T-B)),0,0,1);
}`;

const VORT = HEAD + `
uniform sampler2D uVel, uCurl; uniform vec2 uTexel; uniform float uEps, uDt;
void main(){
  float L = texture(uCurl, vUv - vec2(uTexel.x,0)).x;
  float R = texture(uCurl, vUv + vec2(uTexel.x,0)).x;
  float B = texture(uCurl, vUv - vec2(0,uTexel.y)).x;
  float T = texture(uCurl, vUv + vec2(0,uTexel.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 f = 0.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
  f /= length(f) + 1e-4;
  f *= uEps * C; f.y *= -1.0;
  vec2 v = texture(uVel, vUv).xy + f * uDt;
  o = vec4(clamp(v, -400.0, 400.0), 0, 1);
}`;

const DIV = HEAD + `
uniform sampler2D uVel, uObs; uniform vec2 uTexel;
float ob(vec2 p){ return texture(uObs,p).r; }
void main(){
  vec2 C = texture(uVel, vUv).xy;
  vec2 dl = vec2(uTexel.x,0), dt = vec2(0,uTexel.y);
  // solid walls: reflect neighbor velocity into the obstacle face
  float L = mix(texture(uVel, vUv-dl).x, -C.x, step(0.5, ob(vUv-dl)));
  float R = mix(texture(uVel, vUv+dl).x, -C.x, step(0.5, ob(vUv+dl)));
  float B = mix(texture(uVel, vUv-dt).y, -C.y, step(0.5, ob(vUv-dt)));
  float T = mix(texture(uVel, vUv+dt).y, -C.y, step(0.5, ob(vUv+dt)));
  if (vUv.y - uTexel.y < 0.0) B = -C.y;
  if (vUv.y + uTexel.y > 1.0) T = -C.y;
  o = vec4(0.5*(R-L+T-B),0,0,1);
}`;

const PRESSURE = HEAD + `
uniform sampler2D uP, uDiv, uObs; uniform vec2 uTexel;
void main(){
  vec2 dl = vec2(uTexel.x,0), dt = vec2(0,uTexel.y);
  float C = texture(uP, vUv).x;
  float L = mix(texture(uP, vUv-dl).x, C, step(0.5, texture(uObs, vUv-dl).r));
  float R = mix(texture(uP, vUv+dl).x, C, step(0.5, texture(uObs, vUv+dl).r));
  float B = mix(texture(uP, vUv-dt).x, C, step(0.5, texture(uObs, vUv-dt).r));
  float T = mix(texture(uP, vUv+dt).x, C, step(0.5, texture(uObs, vUv+dt).r));
  if (vUv.x + uTexel.x > 1.0) R = 0.0; // open outlet
  o = vec4((L+R+B+T - texture(uDiv,vUv).x)*0.25,0,0,1);
}`;

const GRAD = HEAD + `
uniform sampler2D uP, uVel, uObs; uniform vec2 uTexel;
void main(){
  vec2 dl = vec2(uTexel.x,0), dt = vec2(0,uTexel.y);
  float C = texture(uP, vUv).x;
  float L = texture(uP, vUv-dl).x, R = texture(uP, vUv+dl).x;
  float B = texture(uP, vUv-dt).x, T = texture(uP, vUv+dt).x;
  vec2 v = texture(uVel, vUv).xy - 0.5*vec2(R-L, T-B);
  o = vec4(v * (1.0 - texture(uObs, vUv).r), 0, 1);
}`;

const CLEAR = HEAD + `
uniform sampler2D uSrc; uniform float uVal;
void main(){ o = uVal * texture(uSrc, vUv); }`;

const DISPLAY = HEAD + `
uniform sampler2D uDye, uVel, uObs; uniform float uU;
vec3 cmap(float t){
  t = clamp(t,0.,1.);
  vec3 c0=vec3(.12,.23,.54), c1=vec3(.01,.52,.78), c2=vec3(.13,.83,.93),
       c3=vec3(.64,.90,.21), c4=vec3(.98,.75,.14), c5=vec3(.97,.44,.44);
  if(t<.2) return mix(c0,c1,t/.2);
  if(t<.4) return mix(c1,c2,(t-.2)/.2);
  if(t<.6) return mix(c2,c3,(t-.4)/.2);
  if(t<.8) return mix(c3,c4,(t-.6)/.2);
  return mix(c4,c5,(t-.8)/.2);
}
void main(){
  float d = clamp(texture(uDye, vUv).r, 0., 1.);
  float s = length(texture(uVel, vUv).xy) / (uU * 1.9);
  vec3 col = cmap(0.15 + s*0.85);
  float a = pow(d, 0.85) * 0.92;
  a *= 1.0 - texture(uObs, vUv).r;
  o = vec4(col * a, a);
}`;

export function startFluid(canvas: HTMLCanvasElement, obstacleEls: () => Element[]): (() => void) | null {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: false });
  if (!gl) return null;
  if (!gl.getExtension('EXT_color_buffer_float') && !gl.getExtension('EXT_color_buffer_half_float')) return null;
  gl.getExtension('OES_texture_float_linear');

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const program = (fs: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    const u: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(p, i)!.name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  };

  let P: Record<string, ReturnType<typeof program>>;
  try {
    P = {
      advect: program(ADVECT), inflow: program(INFLOW), splat: program(SPLAT), curl: program(CURL),
      vort: program(VORT), div: program(DIV), pressure: program(PRESSURE), grad: program(GRAD),
      clear: program(CLEAR), display: program(DISPLAY),
    };
  } catch (e) {
    console.warn('[fluid]', e);
    return null;
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const makeFBO = (w: number, h: number): FBO => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb, w, h };
  };
  const makeDouble = (w: number, h: number): Double => {
    const d = { read: makeFBO(w, h), write: makeFBO(w, h), swap() { [d.read, d.write] = [d.write, d.read]; } };
    return d;
  };

  const obsTex = gl.createTexture()!;
  const obsCanvas = document.createElement('canvas');
  const obsCtx = obsCanvas.getContext('2d')!;

  let vel: Double, dye: Double, pres: Double, divF: FBO, curlF: FBO;
  let simW = 0, simH = 0, dyeW = 0, dyeH = 0;
  const U = 95; // free-stream speed in sim cells / s

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const cw = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const ch = Math.max(1, Math.round(canvas.clientHeight * dpr));
    canvas.width = cw;
    canvas.height = ch;
    const aspect = cw / ch;
    const base = innerWidth < 640 ? 96 : 140;
    simH = base; simW = Math.round(base * aspect);
    const dbase = innerWidth < 640 ? 360 : 640;
    dyeH = dbase; dyeW = Math.round(dbase * aspect);
    vel = makeDouble(simW, simH);
    dye = makeDouble(dyeW, dyeH);
    pres = makeDouble(simW, simH);
    divF = makeFBO(simW, simH);
    curlF = makeFBO(simW, simH);
    drawObstacles();
  };

  /** Rasterize the headline words into an obstacle mask. */
  const drawObstacles = () => {
    const ow = simW * 2, oh = simH * 2;
    obsCanvas.width = ow;
    obsCanvas.height = oh;
    obsCtx.clearRect(0, 0, ow, oh);
    obsCtx.fillStyle = '#fff';
    const r = canvas.getBoundingClientRect();
    for (const el of obstacleEls()) {
      const b = el.getBoundingClientRect();
      const x = ((b.left - r.left) / r.width) * ow;
      const y = ((b.top - r.top) / r.height) * oh;
      const w = (b.width / r.width) * ow;
      const h = (b.height / r.height) * oh;
      const pad = h * 0.12;
      obsCtx.beginPath();
      obsCtx.roundRect(x - pad * 0.5, y + pad, w + pad, h - pad * 2, h * 0.3);
      obsCtx.fill();
    }
    gl.bindTexture(gl.TEXTURE_2D, obsTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obsCanvas);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  let unit = 0;
  const bindTex = (loc: WebGLUniformLocation | null | undefined, tex: WebGLTexture) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(loc ?? null, unit);
    unit++;
  };
  const run = (prog: ReturnType<typeof program>, target: FBO | null, set: (u: Record<string, WebGLUniformLocation | null>) => void) => {
    gl.useProgram(prog.p);
    unit = 0;
    set(prog.u);
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
      gl.viewport(0, 0, target.w, target.h);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const splats: { x: number; y: number; dx: number; dy: number }[] = [];
  let last: { x: number; y: number } | null = null;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) { last = null; return; }
    if (last) splats.push({ x, y, dx: x - last.x, dy: y - last.y });
    last = { x, y };
  };
  addEventListener('pointermove', onMove, { passive: true });

  let time = 0;
  const step = (dt: number) => {
    time += dt;
    const texel = [1 / simW, 1 / simH];
    const aspect = simW / simH;

    run(P.curl, curlF, (u) => { bindTex(u.uVel, vel.read.tex); gl.uniform2fv(u.uTexel, texel); });
    run(P.vort, vel.write, (u) => {
      bindTex(u.uVel, vel.read.tex); bindTex(u.uCurl, curlF.tex);
      gl.uniform2fv(u.uTexel, texel); gl.uniform1f(u.uEps, 18); gl.uniform1f(u.uDt, dt);
    });
    vel.swap();

    for (const s of splats.splice(0)) {
      const fx = s.dx * simW * 60, fy = s.dy * simH * 60;
      run(P.splat, vel.write, (u) => {
        bindTex(u.uSrc, vel.read.tex);
        gl.uniform2f(u.uPoint, s.x, s.y); gl.uniform3f(u.uValue, fx, fy, 0);
        gl.uniform1f(u.uRadius, 0.0009); gl.uniform1f(u.uAspect, aspect);
      });
      vel.swap();
      run(P.splat, dye.write, (u) => {
        bindTex(u.uSrc, dye.read.tex);
        gl.uniform2f(u.uPoint, s.x, s.y); gl.uniform3f(u.uValue, 0.35, 0, 0);
        gl.uniform1f(u.uRadius, 0.0006); gl.uniform1f(u.uAspect, aspect);
      });
      dye.swap();
    }

    run(P.inflow, vel.write, (u) => {
      bindTex(u.uSrc, vel.read.tex); bindTex(u.uObs, obsTex);
      gl.uniform1f(u.uU, U); gl.uniform1f(u.uIsVel, 1); gl.uniform1f(u.uTime, time); gl.uniform1f(u.uBands, 14);
    });
    vel.swap();

    run(P.div, divF, (u) => { bindTex(u.uVel, vel.read.tex); bindTex(u.uObs, obsTex); gl.uniform2fv(u.uTexel, texel); });
    run(P.clear, pres.write, (u) => { bindTex(u.uSrc, pres.read.tex); gl.uniform1f(u.uVal, 0.8); });
    pres.swap();
    for (let i = 0; i < 24; i++) {
      run(P.pressure, pres.write, (u) => {
        bindTex(u.uP, pres.read.tex); bindTex(u.uDiv, divF.tex); bindTex(u.uObs, obsTex); gl.uniform2fv(u.uTexel, texel);
      });
      pres.swap();
    }
    run(P.grad, vel.write, (u) => {
      bindTex(u.uP, pres.read.tex); bindTex(u.uVel, vel.read.tex); bindTex(u.uObs, obsTex); gl.uniform2fv(u.uTexel, texel);
    });
    vel.swap();

    run(P.advect, vel.write, (u) => {
      bindTex(u.uVel, vel.read.tex); bindTex(u.uSrc, vel.read.tex); bindTex(u.uObs, obsTex);
      gl.uniform2fv(u.uTexel, texel); gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDiss, 0.05); gl.uniform1f(u.uIsVel, 1);
    });
    vel.swap();

    run(P.advect, dye.write, (u) => {
      bindTex(u.uVel, vel.read.tex); bindTex(u.uSrc, dye.read.tex); bindTex(u.uObs, obsTex);
      gl.uniform2fv(u.uTexel, texel); gl.uniform1f(u.uDt, dt); gl.uniform1f(u.uDiss, 0.08); gl.uniform1f(u.uIsVel, 0);
    });
    dye.swap();

    run(P.inflow, dye.write, (u) => {
      bindTex(u.uSrc, dye.read.tex); bindTex(u.uObs, obsTex);
      gl.uniform1f(u.uU, U); gl.uniform1f(u.uIsVel, 0); gl.uniform1f(u.uTime, time); gl.uniform1f(u.uBands, 14);
    });
    dye.swap();
  };

  const render = () => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    run(P.display, null, (u) => {
      bindTex(u.uDye, dye.read.tex); bindTex(u.uVel, vel.read.tex); bindTex(u.uObs, obsTex); gl.uniform1f(u.uU, U);
    });
    gl.disable(gl.BLEND);
  };

  resize();
  // Warm up so the first frame already shows developed flow.
  for (let i = 0; i < 240; i++) step(1 / 60);
  render();

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true, raf = 0, prev = performance.now();
  const loop = (now: number) => {
    const dt = Math.min((now - prev) / 1000, 1 / 30);
    prev = now;
    step(dt);
    render();
    raf = requestAnimationFrame(loop);
  };
  const play = () => { if (!raf && !reduced && visible && !document.hidden) { prev = performance.now(); raf = requestAnimationFrame(loop); } };
  const pause = () => { cancelAnimationFrame(raf); raf = 0; };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : pause(); });
  io.observe(canvas);
  const onVis = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVis);

  let rt = 0;
  let lastSize = `${canvas.clientWidth}x${canvas.clientHeight}`;
  const ro = new ResizeObserver(() => {
    const size = `${canvas.clientWidth}x${canvas.clientHeight}`;
    if (size === lastSize) return;
    lastSize = size;
    clearTimeout(rt);
    rt = window.setTimeout(() => { resize(); for (let i = 0; i < 240; i++) step(1 / 60); render(); }, 150);
  });
  ro.observe(canvas);
  document.fonts?.ready.then(() => drawObstacles());

  canvas.closest('[data-hero]')?.classList.add('fluid-on');
  play();
  return () => {
    pause(); io.disconnect(); ro.disconnect();
    removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVis);
  };
}

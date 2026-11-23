const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ParticleField-_1cfUuhM.js","assets/jsx-runtime-DTJ6URaS.js","assets/react-three-fiber.esm-CMcAE3ih.js"])))=>i.map(i=>d[i]);
import{n as e,s as t,t as n}from"./jsx-runtime-DTJ6URaS.js";import{t as r}from"./preload-helper-ca-nBW7U.js";import{f as i,g as a,i as o,n as s,p as c,t as l}from"./react-three-fiber.esm-CMcAE3ih.js";var u=t(e()),d=parseInt(`183`.replace(/\D+/g,``)),f=class extends i{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${d>=154?`colorspace_fragment`:`encodings_fragment`}>
      }`})}},p=e=>new a().setFromSpherical(new c(e,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),m=u.forwardRef(({radius:e=100,depth:t=50,count:n=5e3,saturation:r=0,factor:i=4,fade:a=!1,speed:c=1},l)=>{let d=u.useRef(),[m,h,g]=u.useMemo(()=>{let a=[],s=[],c=Array.from({length:n},()=>(.5+.5*Math.random())*i),l=new o,u=e+t,d=t/n;for(let e=0;e<n;e++)u-=d*Math.random(),a.push(...p(u).toArray()),l.setHSL(e/n,r,.9),s.push(l.r,l.g,l.b);return[new Float32Array(a),new Float32Array(s),new Float32Array(c)]},[n,t,i,e,r]);s(e=>d.current&&(d.current.uniforms.time.value=e.clock.elapsedTime*c));let[_]=u.useState(()=>new f);return u.createElement(`points`,{ref:l},u.createElement(`bufferGeometry`,null,u.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[m,3]}),u.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[h,3]}),u.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[g,1]})),u.createElement(`primitive`,{ref:d,object:_,attach:`material`,blending:2,"uniforms-fade-value":a,depthWrite:!1,transparent:!0,vertexColors:!0}))}),h=n(),g=(0,u.lazy)(()=>r(()=>import(`./ParticleField-_1cfUuhM.js`),__vite__mapDeps([0,1,2])));function _({count:e=3e3}){return(0,h.jsx)(`div`,{className:`pointer-events-none absolute inset-0 -z-10`,children:(0,h.jsx)(l,{"aria-hidden":`true`,camera:{position:[0,0,6],fov:60},children:(0,h.jsxs)(u.Suspense,{fallback:null,children:[(0,h.jsx)(g,{count:e}),(0,h.jsx)(m,{radius:90,depth:40,count:800,factor:3,fade:!0,speed:.8})]})})})}var v={crazing:{color:`#FF6B6B`,icon:`⬡`,description:`Network of fine surface cracks`},inclusion:{color:`#FFD93D`,icon:`◈`,description:`Foreign material embedded in surface`},patches:{color:`#6BCB77`,icon:`▦`,description:`Irregular surface discoloration areas`},pitted_surface:{color:`#4D96FF`,icon:`◉`,description:`Small cavities or craters on surface`},"rolled-in_scale":{color:`#C77DFF`,icon:`≋`,description:`Oxide scale pressed into surface`},scratches:{color:`#FF9A3C`,icon:`∕∕`,description:`Linear surface damage marks`}},y=(e=``)=>e.replace(/[-_]/g,` `).split(` `).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(` `);export{y as n,_ as r,v as t};
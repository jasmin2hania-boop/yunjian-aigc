import { fragment } from './cloud-shader.js';

// No host scripts or CDN dependencies. Every frame, listener and GL resource is
// owned by the homepage and released when VitePress changes the route.
export function mountCloud(scene) {
  const hub=scene.querySelector('.ca-hub'), canvas=scene.querySelector('.ca-cloud-canvas');
  const atmosphere=scene.querySelector('.ca-atmosphere'), ctx=atmosphere.getContext('2d');
  const media=matchMedia('(prefers-reduced-motion: reduce)'), cleanups=[];
  let disposed=false, frame=0, last=0, gl, program, buffer, vs, fs;
  let visible=true, targetX=0,targetY=0,currentX=0,currentY=0;
  const response={x:0,y:0,tx:0,ty:0,target:0,depth:0,velocity:0,squash:0,sv:0,hover:false,pressed:false};
  const particles=[], motes=Array.from({length:25},()=>({x:Math.random(),y:Math.random(),phase:Math.random()*6.28}));
  function listen(el,type,fn,options) { el.addEventListener(type,fn,options);cleanups.push(()=>el.removeEventListener(type,fn,options)); }
  function touch(e) {const b=hub.getBoundingClientRect();response.tx=((e.clientX-b.left)/b.width*2-1)*b.width/b.height*1.38;response.ty=(1-(e.clientY-b.top)/b.height*2)*1.38;}
  function dust(count=12,force=1) {
    if(media.matches||!ctx) return;
    const b=hub.getBoundingClientRect(),w=atmosphere.getBoundingClientRect();
    for(let i=0;i<count;i++) {const a=Math.random()*6.28,speed=(12+Math.random()*50)*force;
      particles.push({x:b.left-w.left+b.width*.5+Math.cos(a)*b.width*.27,y:b.top-w.top+b.height*.49+Math.sin(a)*b.height*.18,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed*.65-8,age:0,life:1.3+Math.random()*1.2,r:.4+Math.random()*1.2});}
    if(particles.length>200) particles.splice(0,particles.length-200);
  }
  listen(hub,'pointerenter',e=>{touch(e);response.hover=true;response.target=.62;dust();});
  listen(hub,'pointermove',touch);
  listen(hub,'pointerdown',e=>{touch(e);response.pressed=true;response.target=1.18;response.sv+=1.2;dust(20);});
  listen(hub,'pointerleave',()=>{response.hover=false;response.pressed=false;response.target=0;});
  listen(window,'pointerup',()=>{response.pressed=false;response.target=response.hover?.62:0;});
  listen(hub,'pointercancel',()=>{response.pressed=false;response.target=0;});
  listen(hub,'click',()=>{response.sv+=5.2;dust(80,1.3);});
  listen(scene,'pointermove',e=>{const b=scene.getBoundingClientRect();targetX=(e.clientX-b.left)/b.width*2-1;targetY=(e.clientY-b.top)/b.height*2-1;});
  listen(scene,'pointerleave',()=>{targetX=0;targetY=0;});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;wake();});observer.observe(scene);
  function wake(){if(!frame&&!disposed&&!document.hidden&&visible)frame=requestAnimationFrame(tick);}
  listen(document,'visibilitychange',wake);
  listen(media,'change',()=>{response.depth=0;response.velocity=0;response.squash=0;response.sv=0;particles.length=0;wake();});
  try {
    gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'low-power'});
    if(gl) {
      function compile(type,code) {const shader=gl.createShader(type);gl.shaderSource(shader,code);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;}
      vs=compile(gl.VERTEX_SHADER,'attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}');fs=compile(gl.FRAGMENT_SHADER,fragment);
      if(vs&&fs) {
        program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
        if(!gl.getProgramParameter(program,gl.LINK_STATUS)){gl.deleteProgram(program);program=null;}
      }
      if(program) {
        gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
        const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
      }
    }
  } catch { gl=null; }
  listen(canvas,'webglcontextlost',e=>{e.preventDefault();scene.dataset.webgl='false';program=null;});
  const uniforms={};if(program) for(const name of ['resolution','yaw','pitch','touch','pressure','impact','clock','softness']) uniforms[name]=gl.getUniformLocation(program,name);
  function paint(time,dt) {
    const reduced=media.matches;
    currentX+=(targetX-currentX)*.07;currentY+=(targetY-currentY)*.07;
    if(!reduced){
      response.x+=(response.tx-response.x)*.2;response.y+=(response.ty-response.y)*.2;
      response.velocity+=((response.target-response.depth)*75-response.velocity*11)*dt;
      response.depth=Math.min(1.4,Math.max(-.12,response.depth+response.velocity*dt));
      response.sv+=(-response.squash*90-response.sv*10)*dt;
      response.squash=Math.min(.65,Math.max(-.18,response.squash+response.sv*dt));
    }
    scene.style.setProperty('--ca-look-x',(reduced?0:currentX*4)+'px');scene.style.setProperty('--ca-look-y',(reduced?0:currentY*3)+'px');
    hub.style.setProperty('--ca-squeeze-x',String(1+response.squash*.045));hub.style.setProperty('--ca-squeeze-y',String(1-response.squash*.06));
    if(program){
      const b=canvas.getBoundingClientRect(),r=Math.min(devicePixelRatio||1,1.25),w=Math.round(b.width*r),h=Math.round(b.height*r);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
      gl.uniform2f(uniforms.resolution,w,h);gl.uniform1f(uniforms.yaw,currentX*.06+(reduced?0:Math.sin(time*.00035)*.035));gl.uniform1f(uniforms.pitch,currentY*.04-.035);
      gl.uniform2f(uniforms.touch,response.x,response.y);gl.uniform1f(uniforms.pressure,reduced?0:response.depth);gl.uniform1f(uniforms.impact,reduced?0:response.squash);gl.uniform1f(uniforms.clock,reduced?0:time/1000);gl.uniform1f(uniforms.softness,.85);
      gl.drawArrays(gl.TRIANGLES,0,6);scene.dataset.webgl='true';scene.dataset.pressure=response.depth.toFixed(3);
    }
    if(ctx){
      const b=atmosphere.getBoundingClientRect(),r=Math.min(devicePixelRatio||1,1.5),w=Math.round(b.width*r),h=Math.round(b.height*r);
      if(atmosphere.width!==w||atmosphere.height!==h){atmosphere.width=w;atmosphere.height=h;}
      ctx.setTransform(r,0,0,r,0,0);ctx.clearRect(0,0,b.width,b.height);
      if(!reduced){
        for(const m of motes){ctx.globalAlpha=.12+.1*Math.sin(time*.0008+m.phase);ctx.fillStyle='#fffaff';ctx.beginPath();ctx.arc(m.x*b.width+Math.sin(time*.0002+m.phase)*10,m.y*b.height+Math.sin(time*.00012+m.phase)*12,1,0,6.28);ctx.fill();}
        for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.age+=dt;if(p.age>p.life){particles.splice(i,1);continue;}p.vx*=Math.exp(-dt*.8);p.vy-=dt*4;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=.6*Math.pow(1-p.age/p.life,1.5);ctx.fillStyle=i%4?'#fffaff':'#d1b8e8';ctx.beginPath();ctx.ellipse(p.x,p.y,p.r*.7,p.r*1.4,p.age,0,6.28);ctx.fill();}
      }ctx.globalAlpha=1;
    }
  }
  function tick(time){frame=0;if(disposed||document.hidden||!visible)return;if(time-last>45){const dt=Math.min((time-last)/1000,.045);last=time;paint(time,dt);}if(!media.matches)wake();}
  paint(0,.016);wake();
  return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();cleanups.forEach(fn=>fn());if(gl){if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}

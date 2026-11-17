export const fragment = `precision highp float;
    uniform vec2 resolution; uniform vec2 touch;
    uniform float yaw,pitch,clock,pressure,impact,softness;
    float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.17,.19));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
    float noise(vec3 p){
      vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
    float smoothMin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
    float ellipsoid(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/max(k1,.001);}
    float shape(vec3 p){
      vec2 delta=p.xy-touch;
      float contact=exp(-dot(delta,delta)*5.3)*pressure;
      p.z+=contact*.85*smoothstep(-.5,.45,p.z);
      p.xy+=delta*contact*.065;
      p.x/=1.+impact*.15;p.y/=1.-impact*.20;p.z/=1.+impact*.08;
      float cy=cos(yaw),sy=sin(yaw);p.xz=mat2(cy,-sy,sy,cy)*p.xz;
      float cp=cos(pitch),sp=sin(pitch);p.yz=mat2(cp,-sp,sp,cp)*p.yz;
      float d=ellipsoid(p-vec3(0.,-.28,-.02),vec3(1.30,.40,.48));
      d=smoothMin(d,length(p-vec3(-1.0,-.12,0.))-.47,.16);
      d=smoothMin(d,length(p-vec3(-.63,.24,-.06))-.58,.18);
      d=smoothMin(d,length(p-vec3(.03,.47,-.03))-.69,.18);
      d=smoothMin(d,length(p-vec3(.72,.23,-.09))-.58,.18);
      d=smoothMin(d,length(p-vec3(1.10,-.13,.05))-.43,.20);
      d=smoothMin(d,length(p-vec3(-.15,-.18,.34))-.56,.18);
      return d;
    }
    float density(vec3 p){
      float d=shape(p);if(d>.25)return 0.;
      vec3 drift=vec3(clock*.013,clock*.006,0.);
      float fleece=noise(p*4.8+drift)*.60+noise(p*11.7-drift)*.28+noise(p*28.5)*.12;
      d+=(fleece-.47)*(.21+softness*.07);
      return smoothstep(.065+softness*.022,-.085,d);
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy*2.-resolution)/resolution.y;
      vec3 color=vec3(0.);float alpha=0.;
      vec3 sun=normalize(vec3(-.55,.85,.55));
      for(int i=0;i<48;i++){
        vec3 p=vec3(uv*1.38,1.43-float(i)*.061);
        float den=density(p);
        if(den>.008){
          float a=1.-exp(-den*.205);
          float lightDepth=max(-shape(p+sun*.30),0.);
          float light=exp(-lightDepth*2.8);
          float folds=noise(p*5.5+vec3(0.,clock*.008,0.))*.65+noise(p*17.)*.35;
          float brightness=clamp(.52+light*.31+p.y*.24-(folds-.4)*.22,0.,1.);
          vec2 offset=p.xy-touch;
          float dent=pressure*exp(-dot(offset,offset)*5.3);
          vec3 cottonNormal=normalize(vec3(-offset*dent*8.5,1.));
          brightness+=(dot(cottonNormal,sun)-sun.z)*.36*smoothstep(-.4,.55,p.z);
          brightness-=dent*.045;
          vec3 shade=vec3(.57,.48,.69),cream=vec3(1.,.99,1.);
          vec3 sampleColor=mix(shade,cream,clamp(brightness,0.,1.));
          float fibers=noise(vec3(p.x*75.,p.y*40.,2.3))*.65+noise(vec3(p.xy*120.,5.4))*.35;
          sampleColor+=(fibers-.5)*.045;
          sampleColor-=vec3(.06,.07,.04)*pressure*exp(-dot(p.xy-touch,p.xy-touch)*7.)*smoothstep(-.3,.65,p.z);
          color+=(1.-alpha)*a*sampleColor;alpha+=(1.-alpha)*a;
          if(alpha>.986)break;
        }
      }
      if(alpha<.004){gl_FragColor=vec4(0.);return;}
      gl_FragColor=vec4(clamp(color/alpha,0.,1.),smoothstep(0.,1.,alpha));
    }`;

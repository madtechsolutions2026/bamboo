import {useEffect} from 'react';

/** Gentle desktop wheel easing; native touch, keyboard and nested scrolling stay intact. */
export function useSmoothPage(enabled:boolean,blocked:boolean){
 useEffect(()=>{
  if(!enabled||blocked)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer: fine)');
  if(reduce.matches||!fine.matches)return;
  let frame=0,target=window.scrollY,lastTime=0;
  const root=document.documentElement;
  const limit=()=>Math.max(0,root.scrollHeight-window.innerHeight);
  const stop=()=>{cancelAnimationFrame(frame);frame=0;lastTime=0;root.classList.remove('wheel-easing');target=window.scrollY};
  const tick=(time:number)=>{
   const dt=lastTime?Math.min(50,time-lastTime):16.7;lastTime=time;
   target=Math.min(limit(),Math.max(0,target));
   const distance=target-window.scrollY;
   if(Math.abs(distance)<.8){window.scrollTo(0,target);stop();return}
   window.scrollTo(0,window.scrollY+distance*(1-Math.exp(-dt/95)));
   frame=requestAnimationFrame(tick);
  };
  const wheel=(event:WheelEvent)=>{
   if(reduce.matches||!fine.matches||event.ctrlKey||event.metaKey||!event.cancelable||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
   const element=event.target instanceof Element?event.target:null;
   if(element?.closest('[role="dialog"],input,textarea,select,[contenteditable="true"]'))return;
   // Let independently scrollable controls and panels consume their own wheel input.
   for(let node=element;node&&node!==document.body;node=node.parentElement){
    const style=getComputedStyle(node);
    if(/auto|scroll/.test(style.overflowY)&&node.scrollHeight>node.clientHeight+1)return;
   }
   const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
   if(!delta)return;
   const next=Math.max(0,Math.min(limit(),(frame?target:window.scrollY)+delta));
   if(!frame&&next===window.scrollY)return;
   event.preventDefault();target=next;
   if(!frame){root.classList.add('wheel-easing');frame=requestAnimationFrame(tick)}
  };
  const key=(event:KeyboardEvent)=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Tab','Escape'].includes(event.key))stop()};
  window.addEventListener('wheel',wheel,{passive:false});
  window.addEventListener('pointerdown',stop,{passive:true});
  window.addEventListener('touchstart',stop,{passive:true});
  window.addEventListener('keydown',key);
  window.addEventListener('hashchange',stop);
  window.addEventListener('resize',stop);
  reduce.addEventListener('change',stop);
  return()=>{stop();window.removeEventListener('wheel',wheel);window.removeEventListener('pointerdown',stop);window.removeEventListener('touchstart',stop);window.removeEventListener('keydown',key);window.removeEventListener('hashchange',stop);window.removeEventListener('resize',stop);reduce.removeEventListener('change',stop)};
 },[enabled,blocked]);

 useEffect(()=>{
  if(!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const sections=Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero), footer'));
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('section-arrived');observer.unobserve(entry.target)}});
  },{threshold:.04,rootMargin:'0px 0px -20px 0px'});
  sections.forEach(section=>{
   const rect=section.getBoundingClientRect();section.classList.add('section-reveal');
   if(rect.top<innerHeight&&rect.bottom>0)section.classList.add('section-arrived');else observer.observe(section);
  });
  return()=>{observer.disconnect();sections.forEach(section=>section.classList.remove('section-reveal','section-arrived'))};
 },[enabled]);
}

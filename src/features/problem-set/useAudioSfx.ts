import { useCallback, useRef } from "react";
export type SfxName = "click" | "hover" | "whoosh" | "chime";
/** Small UI sound hook. Plays optional public/sfx/*.mp3 assets and falls back to a tiny synthesized tone. */
export function useAudioSfx() {
 const audio=useRef<HTMLAudioElement|null>(null);
 const play=useCallback((name:SfxName)=>{
  if(typeof window==="undefined")return;
  const src=`/sfx/${name}.mp3`;
  try{
   const player=new Audio(src);player.volume=name==="hover"?.12:.22;audio.current=player;
   player.play().catch(()=>{try{const Ctx=window.AudioContext||(window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Ctx)return;const ctx=new Ctx();const osc=ctx.createOscillator();const gain=ctx.createGain();const now=ctx.currentTime;const freq:Record<SfxName,number>={click:520,hover:760,whoosh:260,chime:880};osc.type="sine";osc.frequency.setValueAtTime(freq[name],now);if(name==="whoosh")osc.frequency.exponentialRampToValueAtTime(90,now+.16);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(name==="hover"?.018:.045,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+(name==="whoosh"?.18:.11));osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+(name==="whoosh"?.19:.12));osc.onended=()=>void ctx.close();}catch{/* Audio is an optional enhancement. */}});
  }catch{/* Audio is an optional enhancement. */}
 },[]);
 return {play};
}

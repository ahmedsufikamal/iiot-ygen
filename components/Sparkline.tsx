'use client';
import { TelemetryPoint } from '@/lib/types';
export function Sparkline({ data, height=100 }:{ data:TelemetryPoint[]; height?:number; }){
  if(!data || data.length<2) return <svg width="100%" height={height}></svg>;
  const ys = data.map(p=>p.metrics?.vAvg ?? p.v);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const nx = (i:number)=> i/(data.length-1)*100;
  const ny = (y:number)=> 40 - ((y-minY)/(maxY-minY || 1))*40;
  const d = data.map((p,i)=>`${i?'L':'M'}${nx(i).toFixed(2)},${ny(ys[i]).toFixed(2)}`).join(' ');
  return (
    <svg width="100%" height={height} viewBox="0 0 100 40" preserveAspectRatio="none">
      {[0,25,50,75,100].map((x)=> <line key={'v'+x} x1={x} y1={0} x2={x} y2={40} stroke='currentColor' strokeWidth='.25' opacity='.15'/>) }
      {[0,10,20,30,40].map((y)=> <line key={'h'+y} x1={0} y1={y} x2={100} y2={y} stroke='currentColor' strokeWidth='.25' opacity='.15'/>) }
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" opacity=".85" shapeRendering="crispEdges"/>
    </svg>
  );
}

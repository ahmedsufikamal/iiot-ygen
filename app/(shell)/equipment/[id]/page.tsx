'use client';
import { useParams } from 'next/navigation'; import { useEffect, useState } from 'react';
import { Device, TelemetryPoint } from '@/lib/types'; import { Sparkline } from '@/components/Sparkline'; import { StatusBadge } from '@/components/StatusBadge'; import { TaskModal } from '@/components/TaskModal'; import { subscribeSSE } from '@/lib/client-sse';
type DeviceWithData = { device: Device; telemetry: TelemetryPoint[]; };
async function fetchDevice(id:string): Promise<DeviceWithData|null>{ const res=await fetch(`/api/devices?deviceId=${encodeURIComponent(id)}`,{cache:'no-store'}); const json=await res.json(); return (json.devices&&json.devices[0])||null; }
export default function DevicePage(){ const { id } = useParams<{id:string}>(); const [device,setDevice]=useState<Device|null>(null); const [series,setSeries]=useState<TelemetryPoint[]>([]);
  useEffect(()=>{ fetchDevice(id).then(dd=>{ if(dd){ setDevice(dd.device); setSeries(dd.telemetry);} }); },[id]);
  useEffect(()=>{ const unsub=subscribeSSE('/api/realtime',(msg)=>{ if(!device) return; if(msg.type==='device_update'&&msg.deviceId===device.id) setDevice(msg.device); else if(msg.type==='telemetry'&&msg.deviceId===device.id){ setSeries(prev=>{ const next=[...prev,msg.point]; if(next.length>300) next.shift(); return next; }); } }); return ()=>unsub(); },[device]);
  if(!device) return <div className='card'>Loading…</div>;
  const m = device.metrics; const pfPct = Math.round(((m?.pf ?? 0) * 100));
  return (<div className='grid' style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
    <section className='card' style={{gridColumn:'span 8'}}>
      <h2 style={{marginTop:0}}>{device.name} <span style={{opacity:.6,fontWeight:400}}>• {device.model}</span></h2>
      <div style={{marginBottom:12}}><StatusBadge status={device.status}/></div>
      {m && (<div className='metrics'>
        <div className='group'>
          <div className='label'>Voltage (V)</div>
          <div className='row'><span className='v'>V1</span><span>{m.v1.toFixed(1)}</span></div>
          <div className='row'><span className='v'>V2</span><span>{m.v2.toFixed(1)}</span></div>
          <div className='row'><span className='v'>V3</span><span>{m.v3.toFixed(1)}</span></div>
          <div className='row' style={{fontWeight:700}}><span className='v'>Average V</span><span>{m.vAvg.toFixed(1)}</span></div>
        </div>
        <div className='group'>
          <div className='label'>Current (A)</div>
          <div className='row'><span className='i'>I1</span><span>{m.i1.toFixed(2)}</span></div>
          <div className='row'><span className='i'>I2</span><span>{m.i2.toFixed(2)}</span></div>
          <div className='row'><span className='i'>I3</span><span>{m.i3.toFixed(2)}</span></div>
          <div className='row' style={{fontWeight:700}}><span className='i'>Average I</span><span>{m.iAvg.toFixed(2)}</span></div>
        </div>
      </div>)}
      <div className="pfwrap" style={{marginTop:8}}>
        <div style={{opacity:.8}}>Power Factor</div>
        <div className="pfbar" style={{flex:1}}><i style={{width: `${pfPct}%`}} /></div>
        <div className="pct">{m ? `${pfPct}%` : '—'}</div>
      </div>
      <div style={{height:12}}/>
      <Sparkline data={series} height={200}/>
      <div style={{opacity:.7,fontSize:12, marginTop:6}}>Last Update: {new Date((device as any).lastMaintenanceAt ?? device.lastTs).toLocaleString()}</div>
    </section>
    <aside className='card' style={{gridColumn:'span 4'}}>
      <h3>Actions</h3>
      <TaskModal deviceId={device.id} onCreated={()=>{}}/>
      <div style={{height:12}}/>
      <div className='row'>
        <button className='btn' onClick={()=>fetch('/api/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device.id,status:'OK'})})}>Set OK</button>
        <button className='btn' onClick={()=>fetch('/api/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device.id,status:'MAINTENANCE'})})}>Maintenance</button>
        <button className='btn btn-danger' onClick={()=>fetch('/api/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId:device.id,status:'FAULT'})})}>Fault</button>
      </div>
    </aside>
  </div>); }

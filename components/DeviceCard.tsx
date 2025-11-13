'use client';
import Link from 'next/link';
import { Device, TelemetryPoint } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Sparkline } from '@/components/Sparkline';
export function DeviceCard({ device, data }:{ device:Device; data:TelemetryPoint[]; }){
  const m = device.metrics; const pfPct = Math.round(((m?.pf ?? 0) * 100));
  return (
    <div className="card" style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div style={{fontWeight:700,overflow:'hidden',textOverflow:'ellipsis'}}>
          {device.name} <span style={{opacity:.6,fontWeight:400}}>• {device.model}</span>
        </div>
        <StatusBadge status={device.status}/>
      </div>
      <div className="row" style={{justifyContent:'space-between',opacity:.7,fontSize:12}}>
        <div>Device ID: {device.id}</div>
        <div>Last: {(device.lastValue ?? 0).toFixed(2)}</div>
      </div>
      <div className="metrics">
        <div className="group">
          <div className="label">Voltage (V)</div>
          <div className="row"><span className="v">V1</span><span>{m ? m.v1.toFixed(1) : '—'}</span></div>
          <div className="row"><span className="v">V2</span><span>{m ? m.v2.toFixed(1) : '—'}</span></div>
          <div className="row"><span className="v">V3</span><span>{m ? m.v3.toFixed(1) : '—'}</span></div>
          <div className="row" style={{fontWeight:700}}><span className="v">Average V</span><span>{m ? m.vAvg.toFixed(1) : '—'}</span></div>
        </div>
        <div className="group">
          <div className="label">Current (A)</div>
          <div className="row"><span className="i">I1</span><span>{m ? m.i1.toFixed(2) : '—'}</span></div>
          <div className="row"><span className="i">I2</span><span>{m ? m.i2.toFixed(2) : '—'}</span></div>
          <div className="row"><span className="i">I3</span><span>{m ? m.i3.toFixed(2) : '—'}</span></div>
          <div className="row" style={{fontWeight:700}}><span className="i">Average I</span><span>{m ? m.iAvg.toFixed(2) : '—'}</span></div>
        </div>
      </div>
      <div className="pfwrap">
        <div style={{opacity:.8}}>Power Factor</div>
        <div className="pfbar" style={{flex:1}}><i style={{width: `${pfPct}%`}} /></div>
        <div className="pct">{m ? `${pfPct}%` : '—'}</div>
      </div>
      <Sparkline data={data} height={100}/>
      <div style={{opacity:.7,fontSize:12}}>Last Update: {new Date(device.lastMaintenanceAt ?? device.lastTs).toLocaleString()}</div>
      <div className="row" style={{justifyContent:'flex-end'}}>
        <Link className="btn" href={`/equipment/${encodeURIComponent(device.id)}`}>Open</Link>
      </div>
    </div>
  );
}

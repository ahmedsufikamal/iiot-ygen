'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Device, EquipmentStatus, TelemetryPoint } from '@/lib/types';
import { subscribeSSE } from '@/lib/client-sse';
import { DeviceCard } from '@/components/DeviceCard';
type DeviceWithData = { device: Device; telemetry: TelemetryPoint[]; };
function uniq<T>(arr:T[]){ return Array.from(new Set(arr)); }
async function fetchDevices(qs:string): Promise<DeviceWithData[]>{ const res=await fetch(`/api/devices${qs}`,{cache:'no-store'}); const json=await res.json(); return json.devices as DeviceWithData[]; }
export default function DashboardPage(){
  const [statusFilter,setStatusFilter]=useState<EquipmentStatus|''>(''); const [items,setItems]=useState<DeviceWithData[]>([]); const [loading,setLoading]=useState(true);
  const [all,setAll]=useState<DeviceWithData[]>([]);
  const [division,setDivision]=useState(''); const [district,setDistrict]=useState(''); const [upazila,setUpazila]=useState(''); const [hospital,setHospital]=useState(''); const [equipment,setEquipment]=useState('');
  useEffect(()=>{ fetch('/api/meta',{cache:'no-store'}).then(r=>r.json()).then(j=>setAll((j.devices||[]).map((d:any)=>({device:d, telemetry:[]})))); },[]);
  const load=async()=>{ setLoading(true); try{ const params=new URLSearchParams(); if(statusFilter) params.set('status', String(statusFilter)); if(division) params.set('division', division); if(district) params.set('district', district); if(upazila) params.set('upazila', upazila); if(hospital) params.set('hospital', hospital); if(equipment) params.set('equipment', equipment); setItems(await fetchDevices(`?${params.toString()}`)); } finally{ setLoading(false);} }; useEffect(()=>{ load(); },[statusFilter, division, district, upazila, hospital, equipment]);
  useEffect(()=>{ const unsub=subscribeSSE('/api/realtime',(msg)=>{ if(msg.type==='device_update'){ setItems(prev=>prev.map(x=>x.device.id===msg.deviceId?{...x,device:msg.device}:x)); } else if(msg.type==='telemetry'){ setItems(prev=>prev.map(x=>{ if(x.device.id!==msg.deviceId) return x; const next=[...x.telemetry,msg.point]; if(next.length>300) next.shift(); return {...x,telemetry:next,device:{...x.device,lastValue:msg.point.metrics?.vAvg ?? msg.point.v,lastTs:new Date(msg.point.ts).toISOString(),metrics: msg.point.metrics}}; })); } }); return ()=>unsub(); },[]);
  const stats=useMemo(()=>{ const total=items.length; const counts={OK:0,MAINTENANCE:0,FAULT:0,EMERGENCY:0,OFFLINE:0} as Record<EquipmentStatus,number>; for(const it of items) counts[it.device.status]++; return { total, counts }; },[items]);
  const divisions=useMemo(()=> uniq(all.map(d=>d.device.division).filter(Boolean) as string[]), [all]);
  const districts=useMemo(()=> uniq(all.filter(d=>!division || d.device.division===division).map(d=>d.device.district).filter(Boolean) as string[]), [all, division]);
  const upazilas=useMemo(()=> uniq(all.filter(d=>(!division||d.device.division===division)&&(!district||d.device.district===district)).map(d=>d.device.upazila).filter(Boolean) as string[]), [all, division, district]);
  const hospitals=useMemo(()=> uniq(all.filter(d=>(!division||d.device.division===division)&&(!district||d.device.district===district)&&(!upazila||d.device.upazila===upazila)).map(d=>d.device.hospitalName).filter(Boolean) as string[]), [all, division, district, upazila]);
  const equipments=useMemo(()=> uniq(all.map(d=>d.device.equipmentType).filter(Boolean) as string[]), [all]);
  return (<div className="grid" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
    <section className="card" style={{gridColumn:'span 12'}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        <h2 style={{margin:0}}>Live Equipment Dashboard</h2>
        <div className="row">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as any)}>
            <option value="">All statuses</option><option value="OK">OK</option><option value="MAINTENANCE">MAINTENANCE</option><option value="FAULT">FAULT</option><option value="EMERGENCY">EMERGENCY</option><option value="OFFLINE">OFFLINE</option>
          </select>
          <button className="btn" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</button>
        </div>
      </div>
      <div className="filters">
        <select className='input' value={division} onChange={e=>{setDivision(e.target.value); setDistrict(''); setUpazila(''); setHospital('');}}><option value=''>Division</option>{divisions.map(d=><option key={d} value={d}>{d}</option>)}</select>
        <select className='input' value={district} onChange={e=>{setDistrict(e.target.value); setUpazila(''); setHospital('');}} disabled={!division}><option value=''>District</option>{districts.map(d=><option key={d} value={d}>{d}</option>)}</select>
        <select className='input' value={upazila} onChange={e=>{setUpazila(e.target.value); setHospital('');}} disabled={!district}><option value=''>Upazila</option>{upazilas.map(u=><option key={u} value={u}>{u}</option>)}</select>
        <select className='input' value={hospital} onChange={e=>setHospital(e.target.value)} disabled={!upazila}><option value=''>Hospital</option>{hospitals.map(h=><option key={h} value={h}>{h}</option>)}</select>
        <select className='input' value={equipment} onChange={e=>setEquipment(e.target.value)}><option value=''>Equipment</option>{equipments.map(eq=><option key={eq} value={eq}>{eq}</option>)}</select>
      </div>
      <div className="kpi-grid" style={{marginTop:12}}>
        <Link href={'/devices?status=OK'} className="card" style={{display:'block'}}><div>OK</div><div className="kpi" style={{color:'#22c55e'}}>{stats.counts.OK}</div></Link>
        <Link href={'/devices?status=MAINTENANCE'} className="card" style={{display:'block'}}><div>MAINTENANCE</div><div className="kpi" style={{color:'#d97706'}}>{stats.counts.MAINTENANCE}</div></Link>
        <Link href={'/devices?status=FAULT'} className="card" style={{display:'block'}}><div>FAULT</div><div className="kpi" style={{color:'#ef4444'}}>{stats.counts.FAULT}</div></Link>
        <Link href={'/devices?status=EMERGENCY'} className="card" style={{display:'block'}}><div>EMERGENCY</div><div className="kpi" style={{color:'#be123c'}}>{stats.counts.EMERGENCY}</div></Link>
        <Link href={'/devices?status=OFFLINE'} className="card" style={{display:'block'}}><div>OFFLINE</div><div className="kpi" style={{color:'#94a3b8'}}>{stats.counts.OFFLINE}</div></Link>
        <Link href={'/devices'} className="card" style={{display:'block'}}><div>TOTAL</div><div className="kpi">{stats.total}</div></Link>
      </div>
    </section>
    <section className="card" style={{gridColumn:'span 12'}}>
      <h3>Devices</h3>
      <div className="cards">
        {items.map(({device,telemetry})=>(<DeviceCard key={device.id} device={device} data={telemetry}/>))}
      </div>
    </section>
  </div>);
}

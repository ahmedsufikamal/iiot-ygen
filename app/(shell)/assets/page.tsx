'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Device } from '@/lib/types';
const HOSPITALS = [
  { id:'H1', name:'Sylhet Medical College Hospital' },
  { id:'H2', name:'Chittagong General Hospital' },
  { id:'H3', name:'Dhaka Central Hospital' },
  { id:'H4', name:'Rajshahi Medical College Hospital' },
  { id:'H5', name:'Khulna Medical College Hospital' },
];
export default function AssetsPage(){
  const [rows,setRows]=useState<Device[]>([]);
  const [loading,setLoading]=useState(true);
  const [open,setOpen]=useState(false);
  const [name,setName]=useState(''); const [type,setType]=useState('Ventilator'); const [model,setModel]=useState('Model-X'); const [hospitalId,setHospitalId]=useState('H1');
  async function load(){ setLoading(true); const r=await fetch('/api/assets',{cache:'no-store'}); const j=await r.json(); setRows(j.devices||[]); setLoading(false); }
  useEffect(()=>{ load(); },[]);
  async function addDevice(){ const r=await fetch('/api/assets',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name||type,equipmentType:type,hospitalId,model})}); if(r.ok){ setOpen(false); setName(''); load(); } }
  async function removeDevice(id:string){ if(!confirm('Delete this device?')) return; const r=await fetch('/api/assets?id='+encodeURIComponent(id),{method:'DELETE'}); if(r.ok) load(); }
  return (<div className="card">
    <div className="row" style={{justifyContent:'space-between'}}>
      <h2 style={{marginTop:0}}>Assets</h2>
      <div className="row"><a className="btn" href="/settings">Settings</a><button className="btn btn-primary" onClick={()=>setOpen(true)}>Add Asset</button></div>
    </div>
    {loading ? 'Loading…' : (
      <table className="table">
        <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Hospital</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map(d=>(
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.equipmentType}</td>
              <td>{d.hospitalName}</td>
              <td>{d.status}</td>
              <td className="row">
                <Link className="btn" href={`/equipment/${encodeURIComponent(d.id)}`}>Open</Link>
                <button className="btn" onClick={()=>removeDevice(d.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    {open && (<div className="modal-backdrop" onClick={()=>setOpen(false)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Add Asset</h3>
        <label>Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Optional; defaults to Type"/>
        <label>Type</label>
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          {['Ventilator','Oxygen Plant','Infusion Pump','ECG','X-Ray','CT','MRI'].map(t=>(<option key={t} value={t}>{t}</option>))}
        </select>
        <label>Model</label>
        <input className="input" value={model} onChange={e=>setModel(e.target.value)}/>
        <label>Hospital</label>
        <select className="input" value={hospitalId} onChange={e=>setHospitalId(e.target.value)}>
          {HOSPITALS.map(h=>(<option key={h.id} value={h.id}>{h.name}</option>))}
        </select>
        <div className="row" style={{justifyContent:'flex-end', marginTop:12}}>
          <button className="btn" onClick={()=>setOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={addDevice}>Add</button>
        </div>
      </div>
    </div>)}
  </div>);
}

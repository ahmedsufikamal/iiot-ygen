'use client';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
export default function SettingsPage(){
  const [logoUrl,setLogoUrl]=useState(''); const [avatarUrl,setAvatarUrl]=useState('');
  const [msg,setMsg]=useState<string|null>(null);
  useEffect(()=>{ fetch('/api/branding').then(r=>r.json()).then(j=> setLogoUrl(j.branding?.logoUrl||'')); fetch('/api/profile').then(r=>r.json()).then(j=> setAvatarUrl(j.profile?.avatarUrl||'')); },[]);
  async function saveBrand(){ setMsg(null); const r=await fetch('/api/branding',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({logoUrl})}); if(!r.ok){ setMsg('You must be admin to change tenant branding.'); return; } setMsg('Branding saved'); }
  async function saveProfile(){ setMsg(null); const r=await fetch('/api/profile',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({avatarUrl})}); if(!r.ok){ setMsg('Failed to save profile'); return; } setMsg('Profile saved'); }
  return (<div className="card">
    <h2 style={{marginTop:0}}>Settings</h2>
    {msg && <div style={{opacity:.8, marginBottom:8}}>{msg}</div>}
    <h3>Theme</h3>
    <ThemeToggle/>
    <div className="sep"></div>
    <h3>Tenant Branding</h3>
    <label>Logo URL</label>
    <input className="input" placeholder="https://..." value={logoUrl} onChange={e=>setLogoUrl(e.target.value)}/>
    <div className="row" style={{justifyContent:'flex-end'}}><button className="btn btn-primary" onClick={saveBrand}>Save Branding</button></div>
    <div className="sep"></div>
    <h3>My Profile</h3>
    <label>Avatar URL</label>
    <input className="input" placeholder="https://..." value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)}/>
    <div className="row" style={{justifyContent:'flex-end'}}><button className="btn btn-primary" onClick={saveProfile}>Save Profile</button></div>
  </div>);
}

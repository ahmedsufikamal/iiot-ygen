'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TENANT_LIST } from '@/lib/tenants';
export default function LoginPage(){
  const [email,setEmail]=useState(''); const [pwd,setPwd]=useState('');
  const [tenant,setTenant]=useState<string>('sylhet-medical'); const [admin,setAdmin]=useState(false);
  const [busy,setBusy]=useState(false); const [err,setErr]=useState<string|null>(null);
  const router=useRouter(); const sp=useSearchParams(); const next=sp.get('next')||'/dashboard';
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); setBusy(true); setErr(null);
    try{ const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pwd,tenant,role: admin?'admin':'user'})}); if(!r.ok) throw new Error('Login failed'); router.push(next); }
    catch(e:any){ setErr(e?.message||'Login error'); } finally{ setBusy(false);} }
  return (<div className="auth-card card">
    <h2 style={{marginTop:0}}>Sign in</h2><p className="muted">Choose tenant and optionally sign in as admin.</p>
    {err && <div style={{ color:'#ef4444', marginBottom:8 }}>{err}</div>}
    <form onSubmit={onSubmit} className="row" style={{flexDirection:'column',alignItems:'stretch'}}>
      <label>Tenant</label>
      <select className="input" value={tenant} onChange={e=>setTenant(e.target.value)}>
        {TENANT_LIST.map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
      </select>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={admin} onChange={e=>setAdmin(e.target.checked)} /> I am Admin</label>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy?'Signing in…':'Continue'}</button>
      <div style={{opacity:.7, fontSize:12}}>Tenant-branded login pages:</div>
      <div className="row">{TENANT_LIST.map(t=>(<a key={t.id} href={`/t/${t.id}/login`} className="btn">{t.name}</a>))}</div>
    </form>
  </div>);
}

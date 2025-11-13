'use client';
import { useState, useMemo } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { getTenant } from '@/lib/tenants';
export default function TenantLoginPage(){
  const { tenant } = useParams<{tenant:string}>();
  const info = useMemo(()=> getTenant(tenant), [tenant]);
  const [email,setEmail]=useState(''); const [pwd,setPwd]=useState(''); const [admin,setAdmin]=useState(false);
  const [busy,setBusy]=useState(false); const [err,setErr]=useState<string|null>(null);
  const router=useRouter(); const sp=useSearchParams(); const next=sp.get('next')||'/dashboard';
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); setBusy(true); setErr(null);
    try{ const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pwd,tenant,role: admin?'admin':'user'})}); if(!r.ok) throw new Error('Login failed'); router.push(next); }
    catch(e:any){ setErr(e?.message||'Login error'); } finally{ setBusy(false);} }
  if (!info) return <div className="auth-card card"><h2>Unknown tenant</h2><p>Please check the URL.</p></div>;
  return (<div className="auth-card card">
    <div className="tenant-header"><div className="tenant-name" style={{color:info.color}}>{info.name}</div><div style={{opacity:.7}}>Tenant login</div></div>
    {err && <div style={{ color:'#ef4444', marginBottom:8 }}>{err}</div>}
    <form onSubmit={onSubmit} className="row" style={{flexDirection:'column',alignItems:'stretch'}}>
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <label style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={admin} onChange={e=>setAdmin(e.target.checked)} /> I am Admin</label>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy?'Signing in…':'Continue'}</button>
      <a href="/login" className="btn" style={{marginTop:8}}>Back to global login</a>
    </form>
  </div>);
}

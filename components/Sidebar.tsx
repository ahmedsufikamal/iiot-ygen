'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavIcon from '@/components/NavIcon';
import LogoutButton from '@/components/LogoutButton';
import { useEffect, useState } from 'react';

function BrandHeader(){
  const [logo,setLogo]=useState<string|null>(null);
  const [avatar,setAvatar]=useState<string|null>(null);
  useEffect(()=>{ fetch('/api/branding').then(r=>r.json()).then(j=>setLogo(j.branding?.logoUrl||null)); fetch('/api/profile').then(r=>r.json()).then(j=>setAvatar(j.profile?.avatarUrl||null)); },[]);
  return (
    <div className="brand" style={{display:'flex',alignItems:'center',gap:10}}>
      {logo ? <img src={logo} alt="tenant logo" style={{width:28,height:28,borderRadius:6,objectFit:'cover'}}/> : <div style={{width:28,height:28,borderRadius:6,background:'#2a3a4f'}}/>}
      <div style={{fontWeight:800,letterSpacing:.6}}>YGEN IIoT Telematics</div>
      <div style={{marginLeft:'auto'}}>{avatar ? <img src={avatar} alt="me" style={{width:28,height:28,borderRadius:'50%',objectFit:'cover'}}/> : <div style={{width:28,height:28,borderRadius:'50%',background:'#2a3a4f'}}/>}</div>
    </div>
  );
}

const items = [
  { label:'Dashboard', href:'/dashboard', icon:'dashboard' as const },
  { label:'Assets', href:'/assets', icon:'assets' as const },
  { label:'Connections', href:'/connections', icon:'connections' as const },
  { label:'Explore', href:'/explore', icon:'explore' as const },
  { label:'Administration', href:'/administration', icon:'admin' as const },
  { label:'Tenants', href:'/tenants', icon:'tenants' as const },
  { label:'Alerting', href:'/alerting', icon:'alerting' as const },
  { label:'Reports', href:'/reports', icon:'reports' as const },
  { label:'Settings', href:'/settings', icon:'settings' as const },
];
export default function Sidebar(){
  const pathname = usePathname();
  return (
    <div className="sidebar" style={{display:'flex',flexDirection:'column',minHeight:'100%'}}>
      <BrandHeader/>
      <div className="sep"></div>
      <nav className="navlist">
        {items.map(it=>{
          const active = pathname === it.href || pathname.startsWith(it.href + '/');
          return (
            <Link key={it.href} href={it.href} className={`navitem ${active?'active':''}`}>
              <span className="icon"><NavIcon name={it.icon}/></span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div style={{flex:1}}/>
      <div className="logout"><LogoutButton/></div>
    </div>
  );
}

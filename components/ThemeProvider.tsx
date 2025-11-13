'use client';
import { useEffect } from 'react';
export default function ThemeProvider(){
  useEffect(()=>{
    const cookie = document.cookie.split('; ').find(x=>x.startsWith('theme='))?.split('=')[1];
    const t = (cookie==='light'||cookie==='dark')?cookie:'dark';
    document.documentElement.setAttribute('data-theme', t);
    document.body.classList.add(t==='dark'?'dark-gradient':'light-gradient');
  },[]);
  return null;
}

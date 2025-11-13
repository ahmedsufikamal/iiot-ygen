'use client';
import React from 'react';
type IconName='dashboard'|'assets'|'connections'|'explore'|'admin'|'tenants'|'alerting'|'reports'|'settings';
export default function NavIcon({name}:{name:IconName}){
  const p={width:18,height:18,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'} as any;
  switch(name){
    case 'dashboard': return (<svg {...p}><path d='M3 13h8V3H3v10zM13 21h8V11h-8v10zM3 21h8v-6H3v6zM13 3v6h8V3h-8z'/></svg>);
    case 'assets': return (<svg {...p}><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 8h10M7 12h6M7 16h3'/></svg>);
    case 'connections': return (<svg {...p}><circle cx='6' cy='12' r='3'/><circle cx='18' cy='6' r='3'/><circle cx='18' cy='18' r='3'/><path d='M8.5 10.5l7-3M8.5 13.5l7 3'/></svg>);
    case 'explore': return (<svg {...p}><circle cx='12' cy='12' r='10'/><path d='M14.5 9.5L10 14l-2 5 5-2 4.5-4.5z'/></svg>);
    case 'admin': return (<svg {...p}><path d='M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z'/><path d='M9 12h6'/></svg>);
    case 'tenants': return (<svg {...p}><path d='M3 21V7l9-4 9 4v14'/><path d='M9 21V9h6v12'/></svg>);
    case 'alerting': return (<svg {...p}><path d='M12 9v4'/><path d='M12 17h.01'/><path d='M2 19h20L12 3 2 19z'/></svg>);
    case 'reports': return (<svg {...p}><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M8 12h8M8 8h8M8 16h6'/></svg>);
    case 'settings': return (<svg {...p}><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.4 19.4l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09c.66 0 1.26.39 1.51 1z'/></svg>);
    default: return null;
  }
}

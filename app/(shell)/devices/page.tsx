'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Device } from '@/lib/types';

export default function DevicesPage(){
  const sp = useSearchParams();
  const status = sp.get('status') || '';
  const [rows, setRows] = useState<{device:Device}[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    fetch(`/api/devices?${params.toString()}`, { cache:'no-store' })
      .then(r=>r.json())
      .then(j=> setRows(j.devices || []))
      .finally(()=> setLoading(false));
  }, [status]);
  return (
    <div className='card'>
      <h2 style={{marginTop:0}}>Devices {status ? `— ${status}` : ''}</h2>
      {loading ? 'Loading…' : (
        <table className='table'>
          <thead><tr><th>ID</th><th>Name</th><th>Hospital</th><th>Division</th><th>District</th><th>Upazila</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(({device}:any)=>(
              <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>{device.hospitalName}</td>
                <td>{device.division}</td>
                <td>{device.district}</td>
                <td>{device.upazila}</td>
                <td>{device.status}</td>
                <td><Link className='btn' href={`/equipment/${encodeURIComponent(device.id)}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

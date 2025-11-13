'use client';
import React from 'react';
export function TaskModal({ deviceId, onCreated }:{ deviceId:string; onCreated:()=>void }){
  const [open,setOpen]=React.useState(false);
  const [notes,setNotes]=React.useState('');
  const [busy,setBusy]=React.useState(false);
  async function submit(){
    setBusy(true);
    try{
      await fetch('/api/work-orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId,notes})});
      setOpen(false); setNotes(''); onCreated();
    } finally { setBusy(false); }
  }
  return (<>
    <button className="btn btn-primary" onClick={()=>setOpen(true)}>ADD TASK</button>
    {open && (<div className="modal-backdrop" onClick={()=>!busy&&setOpen(false)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginTop:0}}>Assign maintenance task</h3>
        <textarea className="input" rows={4} placeholder="Notes, checklist" value={notes} onChange={e=>setNotes(e.target.value)}/>
        <div className="row" style={{justifyContent:'flex-end'}}>
          <button className="btn" onClick={()=>setOpen(false)} disabled={busy}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy?'Saving…':'Create'}</button>
        </div>
      </div>
    </div>)}
  </>);
}

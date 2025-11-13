import { EventEmitter } from 'events';
import { Device, EquipmentStatus, TelemetryPoint, WorkOrder, MetricsSnapshot } from './types';

function clamp(n:number,min:number,max:number){ return Math.max(min, Math.min(max,n)); }
function jitter(base:number, spread:number){ return base + (Math.random()*2-1)*spread; }
function makeMetrics(seed=0): MetricsSnapshot {
  const v1 = jitter(220 + seed*0.5, 5), v2 = jitter(221 + seed*0.5, 5), v3 = jitter(219 + seed*0.5, 5);
  const i1 = jitter(3.2 + seed*0.05, 0.4), i2 = jitter(3.4 + seed*0.05, 0.4), i3 = jitter(3.1 + seed*0.05, 0.4);
  const vAvg = (v1+v2+v3)/3, iAvg = (i1+i2+i3)/3;
  const pf = clamp(jitter(0.92, 0.05), 0.7, 1);
  return { v1, v2, v3, vAvg, i1, i2, i3, iAvg, pf };
}
const HOSPITAL_META: Record<string,{ hospitalName:string; division:string; district:string; upazila:string; }> = {
  H1:{ hospitalName:'Sylhet Medical College Hospital', division:'Sylhet', district:'Sylhet', upazila:'Sylhet Sadar' },
  H2:{ hospitalName:'Chittagong General Hospital', division:'Chattogram', district:'Chattogram', upazila:'Kotwali' },
  H3:{ hospitalName:'Dhaka Central Hospital', division:'Dhaka', district:'Dhaka', upazila:'Dhanmondi' },
  H4:{ hospitalName:'Rajshahi Medical College Hospital', division:'Rajshahi', district:'Rajshahi', upazila:'Boalia' },
  H5:{ hospitalName:'Khulna Medical College Hospital', division:'Khulna', district:'Khulna', upazila:'Khalishpur' },
};

class Store {
  devices:Record<string,Device>={}; telemetry:Record<string,TelemetryPoint[]>={}; workOrders:Record<string,WorkOrder>={}; emitter=new EventEmitter();
  constructor(){ this.seed(); this.emitter.setMaxListeners(1000); }
  private seed(){
    const hospIds=['H1','H2','H3','H4','H5']; const names=['Ventilator','Oxygen Plant','Infusion Pump','ECG'];
    for(const h of hospIds){
      for(let i=0;i<4;i++){
        const id=`D-${h}-${i+1}`; const statusList:EquipmentStatus[]=['OK','OK','OK','MAINTENANCE','OFFLINE','FAULT']; const status=statusList[Math.floor(Math.random()*statusList.length)];
        const now=Date.now(); const metrics=makeMetrics(i);
        this.devices[id]={ id, hospitalId:h, name:names[i%4], model:'Model-X', status, lastTs:new Date(now).toISOString(), lastValue:metrics.vAvg, metrics, lastMaintenanceAt:this.randPast(60), equipmentType:names[i%4], division:HOSPITAL_META[h].division, district:HOSPITAL_META[h].district, upazila:HOSPITAL_META[h].upazila, hospitalName:HOSPITAL_META[h].hospitalName };
        this.telemetry[id]=[];
        for(let p=0;p<50;p++){ const m=makeMetrics(p*0.03 + i*0.1); this.telemetry[id].push({ ts: now-(50-p)*60000, v: m.vAvg, metrics: m }); }
      }
    }
  }
  private randPast(days=45){ const d=new Date(Date.now()-Math.floor(Math.random()*days*86400000)); return d.toISOString(); }
  listDevices(filter?: {status?:EquipmentStatus; hospitalId?:string}){ let ds=Object.values(this.devices); if(filter?.hospitalId) ds=ds.filter(d=>d.hospitalId===filter.hospitalId); if(filter?.status) ds=ds.filter(d=>d.status===filter.status); return ds; }
  getDevice(id:string){ return this.devices[id]; }
  getTelemetry(id:string){ return this.telemetry[id]??[]; }
  setStatus(deviceId:string,status:EquipmentStatus){ const d=this.devices[deviceId]; if(!d) return; d.status=status; d.lastTs=new Date().toISOString(); this.emit('device_update',{deviceId,device:d}); }
  pushTelemetry(deviceId:string,value?:number){ const arr=this.telemetry[deviceId]??(this.telemetry[deviceId]=[]); const m=makeMetrics(Math.random()); const v=typeof value==='number'?value:m.vAvg; const p:TelemetryPoint={ ts:Date.now(), v, metrics:m }; arr.push(p); if(arr.length>300) arr.shift(); const d=this.devices[deviceId]; if(d){ d.lastValue=v; d.lastTs=new Date(p.ts).toISOString(); d.metrics=m; } this.emit('telemetry',{deviceId,point:p}); }
  createWorkOrder(deviceId:string,notes?:string){ const id='WO-'+Math.random().toString(36).slice(2,8); const wo:WorkOrder={ id, deviceId, status:'OPEN', notes, createdAt:new Date().toISOString() }; this.workOrders[id]=wo; this.emit('work_order',{workOrder:wo}); return wo; }
  addDevice({ name, equipmentType, hospitalId, model='Model-X' }:{ name:string; equipmentType:string; hospitalId:string; model?:string; }){
    const id = `D-${hospitalId}-${Math.random().toString(36).slice(2,6)}`;
    const now=Date.now(); const m = makeMetrics(Math.random());
    const loc = (HOSPITAL_META as any)[hospitalId] || { division:'Unknown', district:'Unknown', upazila:'Unknown', hospitalName:hospitalId };
    this.devices[id] = { id, hospitalId, name, model, equipmentType, status:'OK', lastTs:new Date(now).toISOString(), lastValue:m.vAvg, metrics:m, lastMaintenanceAt:this.randPast(30), division:loc.division, district:loc.district, upazila:loc.upazila, hospitalName:loc.hospitalName };
    this.telemetry[id] = [];
    for(let p=0;p<30;p++){ const mm=makeMetrics(Math.random()); this.telemetry[id].push({ ts: now-(30-p)*60000, v:mm.vAvg, metrics:mm }); }
    this.emit('device_update',{deviceId:id, device:this.devices[id]});
    return this.devices[id];
  }
  removeDevice(id:string){ if(this.devices[id]){ delete this.devices[id]; delete this.telemetry[id]; this.emit('device_update',{deviceId:id, device:null}); return true; } return false; }
  emit(type:string,p:any){ this.emitter.emit(type,p); this.emitter.emit('all',{type,...p}); }
  subscribe(ev:'all'|'device_update'|'telemetry'|'work_order',cb:(d:any)=>void){ this.emitter.on(ev,cb); return ()=>this.emitter.off(ev,cb); }
}
const g=global as any; export const store:Store=g.__IIOT_STORE__||(g.__IIOT_STORE__=new Store());

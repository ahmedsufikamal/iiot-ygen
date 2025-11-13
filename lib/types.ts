export type EquipmentStatus = 'OK'|'MAINTENANCE'|'FAULT'|'EMERGENCY'|'OFFLINE';
export interface MetricsSnapshot { v1:number; v2:number; v3:number; vAvg:number; i1:number; i2:number; i3:number; iAvg:number; pf:number; }
export interface Device {
  id:string; hospitalId:string; name:string; model?:string; status:EquipmentStatus; lastTs:string; lastValue?:number; metrics?:MetricsSnapshot; lastMaintenanceAt?:string;
  division?:string; district?:string; upazila?:string; hospitalName?:string; equipmentType?:string;
}
export interface TelemetryPoint { ts:number; v:number; metrics:MetricsSnapshot; }
export interface WorkOrder { id:string; deviceId:string; status:'OPEN'|'IN_PROGRESS'|'DONE'; assignee?:string; notes?:string; createdAt:string; }

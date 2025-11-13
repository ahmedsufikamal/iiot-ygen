import { store } from '@/lib/store'; import { EquipmentStatus } from '@/lib/types'; import { getTelemetryPoints } from '@/lib/telemetry-source';
export const runtime='nodejs'; export const dynamic='force-dynamic';
export async function GET(req:Request){
  const url=new URL(req.url);
  const hospitalId=url.searchParams.get('hospitalId')||undefined;
  const status=url.searchParams.get('status') as EquipmentStatus | null;
  const deviceId=url.searchParams.get('deviceId')||undefined;
  const division=url.searchParams.get('division')||undefined;
  const district=url.searchParams.get('district')||undefined;
  const upazila=url.searchParams.get('upazila')||undefined;
  const hospital=url.searchParams.get('hospital')||undefined;
  const equipment=url.searchParams.get('equipment')||undefined;

  let devices;
  if(deviceId){ const d=store.getDevice(deviceId); devices=d?[d]:[]; }
  else { devices=store.listDevices({hospitalId,status:status??undefined}); }
  let list = devices;
  list = list.filter((d:any)=> !division || d.division===division);
  list = list.filter((d:any)=> !district || d.district===district);
  list = list.filter((d:any)=> !upazila || d.upazila===upazila);
  list = list.filter((d:any)=> !hospital || d.hospitalName===hospital);
  list = list.filter((d:any)=> !equipment || d.equipmentType===equipment);
  const payload=await Promise.all(list.map(async (d:any)=>({ device:d, telemetry: await getTelemetryPoints(d.id, 50) })));
  return Response.json({ devices: payload });
}

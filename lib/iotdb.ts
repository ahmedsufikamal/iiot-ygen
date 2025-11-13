import { IOTDB_ENABLE, IOTDB_HOST, IOTDB_PORT, IOTDB_USER, IOTDB_PASS } from '@/lib/config';
import type { TelemetryPoint, MetricsSnapshot } from '@/lib/types';

/**
 * This module provides a *thin optional* IoTDB integration.
 * If env IOTDB_ENABLE=1 and the Node client is installed, we'll use it.
 * Otherwise, the exported functions no-op and the app falls back to in-memory store.
 *
 * Node client to install: @apache/iotdb-session-nodejs
 *   npm i @apache/iotdb-session-nodejs
 */
type Session = any;
let session: Session | null = null;
let initTried = false;

async function ensureSession(): Promise<Session | null> {
  if (!IOTDB_ENABLE) return null;
  if (session) return session;
  if (initTried) return null;
  initTried = true;
  try {
    const lib = await import('@apache/iotdb-session-nodejs');
    const { Session: IoTSession } = lib as any;
    const s = new IoTSession(IOTDB_HOST, IOTDB_PORT, IOTDB_USER, IOTDB_PASS, { fetchSize: 1024 });
    await s.open(false);
    session = s;
    return session;
  } catch (e) {
    console.warn('[IoTDB] Optional client not installed or failed to open session. Fallback to memory.', e);
    return null;
  }
}

export async function iotdbHealth(): Promise<{ ok: boolean; message: string }>{ 
  const s = await ensureSession();
  if (!s) return { ok:false, message: 'IoTDB disabled or client not installed' };
  try { await s.testInsertRecord('root.demo.test', Date.now(), ['x'], ['1']); return { ok:true, message:'connected' }; }
  catch (e:any){ return { ok:false, message: String(e?.message||e) }; }
}

/** Write a telemetry snapshot for a device into IoTDB (if enabled) */
export async function iotdbWrite(deviceId:string, m: MetricsSnapshot){
  const s = await ensureSession(); if (!s) return false;
  const ts = Date.now();
  const measurement = `root.ygen.devices.${deviceId.replace(/[^A-Za-z0-9_]/g,'_')}`;
  const measureNames = ['v1','v2','v3','vAvg','i1','i2','i3','iAvg','pf'];
  const values = [m.v1,m.v2,m.v3,m.vAvg,m.i1,m.i2,m.i3,m.iAvg,m.pf];
  try{
    await s.insertRecord(measurement, ts, measureNames, values);
    return true;
  }catch(e){
    console.warn('[IoTDB] insert failed', e);
    return false;
  }
}

/** Read last N points for device from IoTDB (if enabled) */
export async function iotdbQuery(deviceId:string, limit=50): Promise<TelemetryPoint[]>{
  const s = await ensureSession(); if (!s) return [];
  const mpath = `root.ygen.devices.${deviceId.replace(/[^A-Za-z0-9_]/g,'_')}`;
  const sql = `select vAvg,v1,v2,v3,iAvg,i1,i2,i3,pf from ${mpath} order by time desc limit ${limit}`;
  try{
    const ds = await s.executeQueryStatement(sql);
    const rows: TelemetryPoint[] = [];
    while (ds.hasNext()) {
      const r = ds.next();
      const ts = Number(r.getTimestamp());
      const vAvg = Number(r.getFields().get(0).getDoubleV());
      const v1 = Number(r.getFields().get(1).getDoubleV());
      const v2 = Number(r.getFields().get(2).getDoubleV());
      const v3 = Number(r.getFields().get(3).getDoubleV());
      const iAvg = Number(r.getFields().get(4).getDoubleV());
      const i1 = Number(r.getFields().get(5).getDoubleV());
      const i2 = Number(r.getFields().get(6).getDoubleV());
      const i3 = Number(r.getFields().get(7).getDoubleV());
      const pf = Number(r.getFields().get(8).getDoubleV());
      rows.push({ ts, v: vAvg, metrics: { vAvg,v1,v2,v3,iAvg,i1,i2,i3,pf } as any });
    }
    await ds.close();
    return rows.reverse(); // return ascending time
  } catch (e) {
    console.warn('[IoTDB] query failed', e);
    return [];
  }
}

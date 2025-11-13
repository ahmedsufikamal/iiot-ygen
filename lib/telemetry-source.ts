import { iotdbQuery, iotdbWrite } from '@/lib/iotdb';
import { store } from '@/lib/store';
import type { TelemetryPoint, MetricsSnapshot } from '@/lib/types';
import { IOTDB_ENABLE } from '@/lib/config';

export async function getTelemetryPoints(deviceId:string, limit=50): Promise<TelemetryPoint[]>{
  if (IOTDB_ENABLE) {
    const pts = await iotdbQuery(deviceId, limit);
    if (pts.length) return pts;
  }
  // fallback: in-memory
  const arr = store.getTelemetry(deviceId).slice(-limit);
  return arr;
}

export async function persistTelemetry(deviceId:string, m: MetricsSnapshot){
  if (!IOTDB_ENABLE) return;
  await iotdbWrite(deviceId, m);
}

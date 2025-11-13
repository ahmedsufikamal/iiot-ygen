export const IOTDB_ENABLE = process.env.IOTDB_ENABLE === '1';
export const IOTDB_HOST = process.env.IOTDB_HOST || '127.0.0.1';
export const IOTDB_PORT = Number(process.env.IOTDB_PORT || 6667);
export const IOTDB_USER = process.env.IOTDB_USER || 'root';
export const IOTDB_PASS = process.env.IOTDB_PASS || 'root';

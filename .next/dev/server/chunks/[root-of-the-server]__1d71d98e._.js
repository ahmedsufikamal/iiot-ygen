module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/events [external] (events, cjs)");
;
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}
function jitter(base, spread) {
    return base + (Math.random() * 2 - 1) * spread;
}
function makeMetrics(seed = 0) {
    const v1 = jitter(220 + seed * 0.5, 5), v2 = jitter(221 + seed * 0.5, 5), v3 = jitter(219 + seed * 0.5, 5);
    const i1 = jitter(3.2 + seed * 0.05, 0.4), i2 = jitter(3.4 + seed * 0.05, 0.4), i3 = jitter(3.1 + seed * 0.05, 0.4);
    const vAvg = (v1 + v2 + v3) / 3, iAvg = (i1 + i2 + i3) / 3;
    const pf = clamp(jitter(0.92, 0.05), 0.7, 1);
    return {
        v1,
        v2,
        v3,
        vAvg,
        i1,
        i2,
        i3,
        iAvg,
        pf
    };
}
const HOSPITAL_META = {
    H1: {
        hospitalName: 'Sylhet Medical College Hospital',
        division: 'Sylhet',
        district: 'Sylhet',
        upazila: 'Sylhet Sadar'
    },
    H2: {
        hospitalName: 'Chittagong General Hospital',
        division: 'Chattogram',
        district: 'Chattogram',
        upazila: 'Kotwali'
    },
    H3: {
        hospitalName: 'Dhaka Central Hospital',
        division: 'Dhaka',
        district: 'Dhaka',
        upazila: 'Dhanmondi'
    },
    H4: {
        hospitalName: 'Rajshahi Medical College Hospital',
        division: 'Rajshahi',
        district: 'Rajshahi',
        upazila: 'Boalia'
    },
    H5: {
        hospitalName: 'Khulna Medical College Hospital',
        division: 'Khulna',
        district: 'Khulna',
        upazila: 'Khalishpur'
    }
};
class Store {
    devices = {};
    telemetry = {};
    workOrders = {};
    emitter = new __TURBOPACK__imported__module__$5b$externals$5d2f$events__$5b$external$5d$__$28$events$2c$__cjs$29$__["EventEmitter"]();
    constructor(){
        this.seed();
        this.emitter.setMaxListeners(1000);
    }
    seed() {
        const hospIds = [
            'H1',
            'H2',
            'H3',
            'H4',
            'H5'
        ];
        const names = [
            'Ventilator',
            'Oxygen Plant',
            'Infusion Pump',
            'ECG'
        ];
        for (const h of hospIds){
            for(let i = 0; i < 4; i++){
                const id = `D-${h}-${i + 1}`;
                const statusList = [
                    'OK',
                    'OK',
                    'OK',
                    'MAINTENANCE',
                    'OFFLINE',
                    'FAULT'
                ];
                const status = statusList[Math.floor(Math.random() * statusList.length)];
                const now = Date.now();
                const metrics = makeMetrics(i);
                this.devices[id] = {
                    id,
                    hospitalId: h,
                    name: names[i % 4],
                    model: 'Model-X',
                    status,
                    lastTs: new Date(now).toISOString(),
                    lastValue: metrics.vAvg,
                    metrics,
                    lastMaintenanceAt: this.randPast(60),
                    equipmentType: names[i % 4],
                    division: HOSPITAL_META[h].division,
                    district: HOSPITAL_META[h].district,
                    upazila: HOSPITAL_META[h].upazila,
                    hospitalName: HOSPITAL_META[h].hospitalName
                };
                this.telemetry[id] = [];
                for(let p = 0; p < 50; p++){
                    const m = makeMetrics(p * 0.03 + i * 0.1);
                    this.telemetry[id].push({
                        ts: now - (50 - p) * 60000,
                        v: m.vAvg,
                        metrics: m
                    });
                }
            }
        }
    }
    randPast(days = 45) {
        const d = new Date(Date.now() - Math.floor(Math.random() * days * 86400000));
        return d.toISOString();
    }
    listDevices(filter) {
        let ds = Object.values(this.devices);
        if (filter?.hospitalId) ds = ds.filter((d)=>d.hospitalId === filter.hospitalId);
        if (filter?.status) ds = ds.filter((d)=>d.status === filter.status);
        return ds;
    }
    getDevice(id) {
        return this.devices[id];
    }
    getTelemetry(id) {
        return this.telemetry[id] ?? [];
    }
    setStatus(deviceId, status) {
        const d = this.devices[deviceId];
        if (!d) return;
        d.status = status;
        d.lastTs = new Date().toISOString();
        this.emit('device_update', {
            deviceId,
            device: d
        });
    }
    pushTelemetry(deviceId, value) {
        const arr = this.telemetry[deviceId] ?? (this.telemetry[deviceId] = []);
        const m = makeMetrics(Math.random());
        const v = typeof value === 'number' ? value : m.vAvg;
        const p = {
            ts: Date.now(),
            v,
            metrics: m
        };
        arr.push(p);
        if (arr.length > 300) arr.shift();
        const d = this.devices[deviceId];
        if (d) {
            d.lastValue = v;
            d.lastTs = new Date(p.ts).toISOString();
            d.metrics = m;
        }
        this.emit('telemetry', {
            deviceId,
            point: p
        });
    }
    createWorkOrder(deviceId, notes) {
        const id = 'WO-' + Math.random().toString(36).slice(2, 8);
        const wo = {
            id,
            deviceId,
            status: 'OPEN',
            notes,
            createdAt: new Date().toISOString()
        };
        this.workOrders[id] = wo;
        this.emit('work_order', {
            workOrder: wo
        });
        return wo;
    }
    addDevice({ name, equipmentType, hospitalId, model = 'Model-X' }) {
        const id = `D-${hospitalId}-${Math.random().toString(36).slice(2, 6)}`;
        const now = Date.now();
        const m = makeMetrics(Math.random());
        const loc = HOSPITAL_META[hospitalId] || {
            division: 'Unknown',
            district: 'Unknown',
            upazila: 'Unknown',
            hospitalName: hospitalId
        };
        this.devices[id] = {
            id,
            hospitalId,
            name,
            model,
            equipmentType,
            status: 'OK',
            lastTs: new Date(now).toISOString(),
            lastValue: m.vAvg,
            metrics: m,
            lastMaintenanceAt: this.randPast(30),
            division: loc.division,
            district: loc.district,
            upazila: loc.upazila,
            hospitalName: loc.hospitalName
        };
        this.telemetry[id] = [];
        for(let p = 0; p < 30; p++){
            const mm = makeMetrics(Math.random());
            this.telemetry[id].push({
                ts: now - (30 - p) * 60000,
                v: mm.vAvg,
                metrics: mm
            });
        }
        this.emit('device_update', {
            deviceId: id,
            device: this.devices[id]
        });
        return this.devices[id];
    }
    removeDevice(id) {
        if (this.devices[id]) {
            delete this.devices[id];
            delete this.telemetry[id];
            this.emit('device_update', {
                deviceId: id,
                device: null
            });
            return true;
        }
        return false;
    }
    emit(type, p) {
        this.emitter.emit(type, p);
        this.emitter.emit('all', {
            type,
            ...p
        });
    }
    subscribe(ev, cb) {
        this.emitter.on(ev, cb);
        return ()=>this.emitter.off(ev, cb);
    }
}
const g = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const store = g.__IIOT_STORE__ || (g.__IIOT_STORE__ = new Store());
}),
"[project]/lib/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IOTDB_ENABLE",
    ()=>IOTDB_ENABLE,
    "IOTDB_HOST",
    ()=>IOTDB_HOST,
    "IOTDB_PASS",
    ()=>IOTDB_PASS,
    "IOTDB_PORT",
    ()=>IOTDB_PORT,
    "IOTDB_USER",
    ()=>IOTDB_USER
]);
const IOTDB_ENABLE = process.env.IOTDB_ENABLE === '1';
const IOTDB_HOST = process.env.IOTDB_HOST || '127.0.0.1';
const IOTDB_PORT = Number(process.env.IOTDB_PORT || 6667);
const IOTDB_USER = process.env.IOTDB_USER || 'root';
const IOTDB_PASS = process.env.IOTDB_PASS || 'root';
}),
"[project]/lib/iotdb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "iotdbHealth",
    ()=>iotdbHealth,
    "iotdbQuery",
    ()=>iotdbQuery,
    "iotdbWrite",
    ()=>iotdbWrite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-route] (ecmascript)");
;
let session = null;
let initTried = false;
async function ensureSession() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_ENABLE"]) return null;
    if (session) return session;
    if (initTried) return null;
    initTried = true;
    try {
        const lib = await (()=>{
            const e = new Error("Cannot find module '@apache/iotdb-session-nodejs'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })();
        const { Session: IoTSession } = lib;
        const s = new IoTSession(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_HOST"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_PORT"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_USER"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_PASS"], {
            fetchSize: 1024
        });
        await s.open(false);
        session = s;
        return session;
    } catch (e) {
        console.warn('[IoTDB] Optional client not installed or failed to open session. Fallback to memory.', e);
        return null;
    }
}
async function iotdbHealth() {
    const s = await ensureSession();
    if (!s) return {
        ok: false,
        message: 'IoTDB disabled or client not installed'
    };
    try {
        await s.testInsertRecord('root.demo.test', Date.now(), [
            'x'
        ], [
            '1'
        ]);
        return {
            ok: true,
            message: 'connected'
        };
    } catch (e) {
        return {
            ok: false,
            message: String(e?.message || e)
        };
    }
}
async function iotdbWrite(deviceId, m) {
    const s = await ensureSession();
    if (!s) return false;
    const ts = Date.now();
    const measurement = `root.ygen.devices.${deviceId.replace(/[^A-Za-z0-9_]/g, '_')}`;
    const measureNames = [
        'v1',
        'v2',
        'v3',
        'vAvg',
        'i1',
        'i2',
        'i3',
        'iAvg',
        'pf'
    ];
    const values = [
        m.v1,
        m.v2,
        m.v3,
        m.vAvg,
        m.i1,
        m.i2,
        m.i3,
        m.iAvg,
        m.pf
    ];
    try {
        await s.insertRecord(measurement, ts, measureNames, values);
        return true;
    } catch (e) {
        console.warn('[IoTDB] insert failed', e);
        return false;
    }
}
async function iotdbQuery(deviceId, limit = 50) {
    const s = await ensureSession();
    if (!s) return [];
    const mpath = `root.ygen.devices.${deviceId.replace(/[^A-Za-z0-9_]/g, '_')}`;
    const sql = `select vAvg,v1,v2,v3,iAvg,i1,i2,i3,pf from ${mpath} order by time desc limit ${limit}`;
    try {
        const ds = await s.executeQueryStatement(sql);
        const rows = [];
        while(ds.hasNext()){
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
            rows.push({
                ts,
                v: vAvg,
                metrics: {
                    vAvg,
                    v1,
                    v2,
                    v3,
                    iAvg,
                    i1,
                    i2,
                    i3,
                    pf
                }
            });
        }
        await ds.close();
        return rows.reverse(); // return ascending time
    } catch (e) {
        console.warn('[IoTDB] query failed', e);
        return [];
    }
}
}),
"[project]/lib/telemetry-source.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTelemetryPoints",
    ()=>getTelemetryPoints,
    "persistTelemetry",
    ()=>persistTelemetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$iotdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/iotdb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-route] (ecmascript)");
;
;
;
async function getTelemetryPoints(deviceId, limit = 50) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_ENABLE"]) {
        const pts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$iotdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["iotdbQuery"])(deviceId, limit);
        if (pts.length) return pts;
    }
    // fallback: in-memory
    const arr = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].getTelemetry(deviceId).slice(-limit);
    return arr;
}
async function persistTelemetry(deviceId, m) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IOTDB_ENABLE"]) return;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$iotdb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["iotdbWrite"])(deviceId, m);
}
}),
"[project]/app/api/simulate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$telemetry$2d$source$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/telemetry-source.ts [app-route] (ecmascript)");
;
;
const runtime = 'nodejs';
const dynamic = 'force-dynamic';
async function POST(req) {
    const body = await req.json().catch(()=>({}));
    const { deviceId, status, value } = body;
    if (!deviceId) return Response.json({
        error: 'deviceId required'
    }, {
        status: 400
    });
    if (status) __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].setStatus(deviceId, status);
    if (typeof value === 'number') __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].pushTelemetry(deviceId, value);
    else __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].pushTelemetry(deviceId);
    const last = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].getTelemetry(deviceId).slice(-1)[0];
    if (last?.metrics) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$telemetry$2d$source$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["persistTelemetry"])(deviceId, last.metrics);
    return Response.json({
        ok: true,
        device: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].getDevice(deviceId),
        last
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d71d98e._.js.map
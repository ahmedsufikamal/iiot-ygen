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
    const v1 = jitter(220 + seed * 0.5, 5);
    const v2 = jitter(221 + seed * 0.5, 5);
    const v3 = jitter(219 + seed * 0.5, 5);
    const i1 = jitter(3.2 + seed * 0.05, 0.4);
    const i2 = jitter(3.4 + seed * 0.05, 0.4);
    const i3 = jitter(3.1 + seed * 0.05, 0.4);
    const vAvg = (v1 + v2 + v3) / 3;
    const iAvg = (i1 + i2 + i3) / 3;
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
function randPast(days = 45) {
    const d = new Date(Date.now() - Math.floor(Math.random() * days * 86400000));
    return d.toISOString();
}
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
                    lastMaintenanceAt: randPast(60)
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
    listDevices(f) {
        let ds = Object.values(this.devices);
        if (f?.hospitalId) ds = ds.filter((d)=>d.hospitalId === f.hospitalId);
        if (f?.status) ds = ds.filter((d)=>d.status === f.status);
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
    return Response.json({
        ok: true,
        device: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].getDevice(deviceId),
        last: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["store"].getTelemetry(deviceId).slice(-1)[0]
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__601af746._.js.map
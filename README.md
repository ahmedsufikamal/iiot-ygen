# YGEN IIoT Telematics — Demo

- Branding updated to **YGEN IIoT Telematics** with tenant logo & per-user avatar (editable in Settings; admin required for tenant logo).
- **Assets** page: list/status + add/remove assets.
- **Light/Dark** theme with toggle; fully responsive for mobile/tablet/desktop.
- Dashboard has 3-per-row KPI, filters (Division→District→Upazila→Hospital→Equipment), live SSE updates, device cards with V/I metrics and PF bar; chart below PF with grid background and ~2px line.


## Optional: Apache IoTDB integration

This project can store/query telemetry in **Apache IoTDB**. By default it uses in‑memory storage; enable IoTDB like this:

1) Install IoTDB (macOS):

- **Docker (easiest):**
  ```bash
  docker run -d --name iotdb -p 6667:6667 -p 18080:18080 apache/iotdb:latest
  ```

- **Manual (tarball):**
  ```bash
  # Download binary from https://iotdb.apache.org/ and extract
  ./sbin/start-server.sh
  ```

2) Install the Node client (optional dependency):

```bash
npm i @apache/iotdb-session-nodejs
```

3) Configure env (copy and edit):
```bash
cp .env.example .env.local
# set IOTDB_ENABLE=1 and credentials if different
```

4) Start the app:
```bash
npm run dev
# Check health:
curl http://localhost:3000/api/iotdb/health
```

When enabled, telemetry queries in `/api/devices` read from IoTDB and the simulate endpoint persists the latest sample to IoTDB.

# 🧪 BROADCAST TESTING GUIDE

## Step-by-Step Testing

### Step 1: Start Backend Server

**Terminal:**

```bash
cd backend
npm start
```

**Expected Output:**

```
╔════════════════════════════════════════════════════╗
║     JHC BROADCAST SERVER STARTED SUCCESSFULLY      ║
║                                                    ║
║  🌐 Server running at: http://localhost:3000     ║
║  📡 WebSocket server active                        ║
║  ✨ Ready to broadcast audio to all clients        ║
╚════════════════════════════════════════════════════╝
```

### Step 2: Quick Connection Test (NO Recording Needed)

Open in browser:

```
http://localhost/aa_jhc/frontend/connection-test.html
```

**What You'll See:**

```
✅ Connected! Socket ID: abc123xyz
✅ Test broadcast sent
(Beep sound plays)
```

✅ **If you see ✅ Connected**, broadcasting is working!
❌ **If you see ❌ Connection failed**, check server is running

### Step 3: Test with Recording (Full Test)

#### Setup:

```
Tab 1: http://localhost/aa_jhc/frontend/code-warning.html
Tab 2: http://localhost/aa_jhc/frontend/code-warning.html
```

Both tabs should show:

```
🔌 Terhubung ke server broadcast
```

#### Broadcast Announcement:

**Tab 1 (Broadcaster):**

1. Click "Rekam" (green button)
2. Speak something: "Halo, ini test broadcast"
3. Click "Stop" (orange button)
4. Wait for green result box to appear
5. Click "Dengar" to verify audio locally
6. Click "Kirim" (purple button)

**Tab 2 (Receiver):**

- 🔊 Audio should play automatically!
- No action needed
- Same announcement heard

#### Expected Result:

```
Tab 1: "✅ Pengumuman dikirim ke semua display!"
Tab 2: 🔊 Audio plays automatically
```

### Step 4: Test Code Broadcast

**Tab 1:**

1. Click "CODE BLUE" button
2. Select location: "CATHLAB"
3. Click "CATHLAB" button

**Tab 2:**

- 🚨 CODE BLUE alert plays (2x) automatically

#### Other Codes:

```
Tab 1: Click "CODE GREEN" → Click "Play (Loop)"
Tab 2: 🎵 Audio plays automatically
```

### Step 5: Network Device Test

**Device 1 (Server):**

- Keep backend running

**Device 2 (Network):**

```
Access: http://[server-ip]/aa_jhc/frontend/code-warning.html
Example: http://192.168.1.100/aa_jhc/frontend/code-warning.html
```

- Should show: "🔌 Terhubung ke server broadcast"
- Record & send from Device 1
- Device 2 should hear audio automatically

---

## Debugging Guide

### Debug Console (Ctrl+Shift+D)

Press `Ctrl+Shift+D` in any browser tab running code-warning.html

**Shows:**

- ✅ Connection status
- 📢 Received broadcasts
- ❌ Errors and warnings
- 📤 Events sent to server

### What to Look For

#### ✅ All Good:

```
📡 Frontend URL: http://localhost/aa_jhc/frontend/code-warning.html
📡 Attempting to connect to: http://localhost:3000
✅ Connected! Socket ID: abc123xyz
📤 Announcement broadcast sent to server
📢 Menerima broadcast announcement
```

#### ❌ Connection Failed:

```
❌ Connection error: Error: connect_error
Server URL: http://localhost:3000
Error details: [error message]
```

**Fix:** Verify backend is running

#### ❌ Audio Not Playing:

```
📢 Menerima broadcast announcement
ERROR: Error playing announcement
```

**Fix:** Check browser volume, check audio permissions

### Terminal Logs (Backend)

```
✅ Client connected: abc123xyz
📊 Total connected clients: 2
🔊 Broadcasting announcement from abc123xyz
   Audio URL length: 123456 chars
   Duration: 4.5s
📢 Announcement broadcast to all 2 clients
```

---

## Troubleshooting

### ❌ "Terputus dari server" (Disconnected)

**Cause:** Backend server not running or network issue

**Fix:**

1. Check terminal: `npm start` is running
2. Server output should show: "Server running at http://localhost:3000"
3. If not running, start it: `npm start` in backend folder
4. Refresh browser tab

### ❌ "Connection refused"

**Cause:** Server not accessible from device

**Fix:**

1. Verify server running: `npm start`
2. Check firewall allows port 3000
3. If on network, use actual IP not localhost
4. Example: `http://192.168.1.100:3000` (not localhost:3000)

### ❌ Audio not heard on other device

**Cause:** Could be several things

**Debug:**

1. Press Ctrl+Shift+D on both devices
2. Check: "✅ Connected to broadcast server" on both
3. If no connection, fix connection first
4. If connected but no audio, check browser volume
5. Check if audio event received: "📢 Menerima broadcast"

### ❌ "Socket.io library not loaded"

**Cause:** CDN not accessible

**Fix:**

1. Check internet connection
2. Verify code-warning.html has: `<script src="https://cdn.socket.io/4.7.2/socket.io.js"></script>`
3. Check browser console (F12) for 404 errors
4. Try refreshing page

---

## Performance Checklist

- [ ] Server running (terminal shows startup message)
- [ ] Can connect to connection-test.html
- [ ] Debug console shows "✅ Connected"
- [ ] Can record audio locally
- [ ] Recording result box appears with metadata
- [ ] Can hear local playback (Dengar button)
- [ ] Can broadcast to other tab
- [ ] Other tab receives audio automatically
- [ ] No errors in debug console
- [ ] Works on network devices

---

## Test Scenarios

### Scenario 1: Same Machine, 2 Tabs

```
Status: ✅ EASY
Steps: Open code-warning.html 2x in same browser
Test: Record → Kirim → hear in other tab
Expected: Instant success
```

### Scenario 2: Same Machine, 2 Browsers

```
Status: ✅ EASY
Steps: Open code-warning.html in Chrome & Firefox
Test: Record in Chrome → Kirim → hear in Firefox
Expected: Works fine
```

### Scenario 3: Local Network (2 Devices)

```
Status: ⚠️ REQUIRES SETUP
Steps:
  - Device 1: http://[server-ip]/aa_jhc/frontend/code-warning.html
  - Device 2: http://[server-ip]/aa_jhc/frontend/code-warning.html
Test: Record on Device 1 → Kirim → hear on Device 2
Expected: Works if on same network
```

### Scenario 4: Internet (Remote Devices)

```
Status: ⏳ REQUIRES DEPLOYMENT
Steps: Deploy backend to server with public IP
Fix: Update broadcast.js with server URL
Expected: Works from anywhere
```

---

## Success Indicators

### ✅ Broadcasting Works:

1. Connect to server successfully (debug console shows ✅)
2. Broadcast data sent (debug shows 📤 sent)
3. All clients receive (debug shows 📢 received)
4. Audio plays (🔊 heard on all devices)

### ⚠️ Check These If Not Working:

1. Is server running? (terminal shows "Server running")
2. Is port 3000 accessible? (debug shows connection)
3. Is audio large enough to transmit? (>1KB recommended)
4. Is browser volume on? (system volume on device)
5. Are devices on same network? (if testing locally)

---

## Quick Reference

| Test              | Command                   | Expected               | Status |
| ----------------- | ------------------------- | ---------------------- | ------ |
| Start Server      | `npm start`               | Server running message | ✅     |
| Test Connection   | Open connection-test.html | ✅ Connected           | ✅     |
| Local Broadcast   | Record → Kirim in 2 tabs  | Both hear audio        | ✅     |
| Network Broadcast | Same on 2 network devices | Both hear audio        | ✅     |
| Code Broadcast    | Click CODE BLUE           | All devices alert      | ✅     |
| Debug Console     | Press Ctrl+Shift+D        | See all logs           | ✅     |

---

**All tests passing? Broadcasting is working! 🎉**

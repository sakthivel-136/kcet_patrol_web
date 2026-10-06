# Flutter App Implementation Guide: Dynamic Rounds & Historical Integrity

This prompt is designed for your Flutter developer to implement the new dynamic rounds system securely, optimize database calls, and protect historical reports.

---

## 📋 The Goal
1. **Dynamic Rounds**: The app must no longer use hardcoded rounds (e.g., Round 1 is 00:45). It must fetch the rounds from the `patrol_rounds` Supabase table.
2. **Local Caching (One-Time Fetch)**: The app should fetch the necessary tables (Rounds, QRs, Shifts) **ONLY ONCE** when the guard logs in or opens the app for the day. Save this data locally (e.g., using `shared_preferences`, `sqflite`, or Hive) to prevent spamming the database with requests every few seconds.
3. **Historical Safeguard**: When the guard scans a QR code, the app MUST attach the exact `round_number` and `round_time` that is currently active to the API payload. This ensures that if the admin changes round timings tomorrow, today's scans are permanently locked to today's schedule and the reports won't break.

## 🛠️ Implementation Steps for Flutter

### 1. Fetch & Cache Data on Login
When the security guard logs in, make a single API call to fetch:
*   `/rounds` (The dynamic timings)
*   `/qrs` (The active QR codes)
*   `/shifts` (The shift allocations)

**Save these locally**. Do not use `Timer.periodic` or stream listeners to continuously fetch these tables in the background. If the guard wants fresh data, provide a manual "Pull to Refresh" or a "Sync" button.

### 2. Determine the Active Round Locally
Use the locally cached `/rounds` data to determine if the guard is currently within a valid scanning window.

```dart
// Example logic
PatrolRound? getActiveRound(List<PatrolRound> cachedRounds) {
  final now = DateTime.now();
  final currentMinutes = now.hour * 60 + now.minute;

  for (var round in cachedRounds) {
    // Parse round.start_time (e.g., "00:45:00") and end_time
    final startParts = round.start_time.split(':');
    final endParts = round.end_time.split(':');
    
    final startMins = int.parse(startParts[0]) * 60 + int.parse(startParts[1]);
    final endMins = int.parse(endParts[0]) * 60 + int.parse(endParts[1]);

    // Check if current time falls within the window
    if (currentMinutes >= startMins && currentMinutes <= endMins) {
      return round;
    }
  }
  return null; // No active round right now
}
```

### 3. Enforce Scanning Rules
When the guard attempts to scan a QR code:
1. Call `getActiveRound()`.
2. If it returns `null`, show an error: `"Scanning is not permitted right now. No active round window."` and block the scan.

### 4. Send Round Info in the POST Request (Crucial for History)
When the scan is successful, send the `round_number` and `round_time` directly in the POST body to `/scans`.

**Updated Payload Example:**
```json
{
  "guard_name": "John Doe",
  "qr_id": "QR-123",
  "qr_name": "Main Gate",
  "lat": 11.0168,
  "log": 76.9558,
  "status": "SUCCESS",
  "campus_code": "KCET01",
  "round_number": 1,
  "round_time": "00:45-01:45"
}
```

---
*By following this exact logic, the mobile app becomes the source of truth for "when" a scan happened, completely insulating your past web reports from any future admin changes to the schedules!*

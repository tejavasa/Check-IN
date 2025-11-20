# Center Configuration Guide

This guide explains how to configure your check-in portal for different center types.

## Important Rule: QR OR RFID (Not Both)

**Each center MUST choose either QR Code OR RFID as their primary check-in method. You cannot use both simultaneously.**

## Available Configurations

### Example 1: QR Code Only Center
**Best for:** Centers with tablets/phones, no RFID hardware

```typescript
{
  primaryCheckInMethod: 'qr',
  allowManualEntry: false,
  requireLevelSelection: true
}
```

**Features:**
- ✅ QR code scanning only
- ❌ No RFID option
- ❌ No manual entry
- ✅ Students select beginner/explore level

---

### Example 2: QR Code + Manual Entry
**Best for:** Centers with tablets/phones, need backup option

```typescript
{
  primaryCheckInMethod: 'qr',
  allowManualEntry: true,
  requireLevelSelection: true
}
```

**Features:**
- ✅ QR code scanning (primary)
- ❌ No RFID option
- ✅ Manual ID entry (backup)
- ✅ Students select beginner/explore level

---

### Example 3: RFID Only Center
**Best for:** Centers with RFID card readers, no cameras

```typescript
{
  primaryCheckInMethod: 'rfid',
  allowManualEntry: false,
  requireLevelSelection: true
}
```

**Features:**
- ❌ No QR code option
- ✅ RFID card scanning only
- ❌ No manual entry
- ✅ Students select beginner/explore level

---

### Example 4: RFID + Manual Entry
**Best for:** Centers with RFID readers, need backup option, faster flow

```typescript
{
  primaryCheckInMethod: 'rfid',
  allowManualEntry: true,
  requireLevelSelection: false
}
```

**Features:**
- ❌ No QR code option
- ✅ RFID card scanning (primary)
- ✅ Manual ID entry (backup)
- ❌ Skip level selection (faster check-in)

---

## How to Change Configuration

### For Demo/Testing:

1. Open `src/app/services/attendance.service.ts`
2. Find the "ACTIVE CONFIGURATION" section (around line 67)
3. Comment out the current configuration
4. Uncomment one of the example configurations above
5. Save and restart the app

### For Production:

The configuration will come from your API endpoint:
```typescript
GET /api/centers/{centerId}/configuration
```

This allows each center to have its own configuration stored in your database.

---

## Configuration Options Explained

| Option | Type | Description |
|--------|------|-------------|
| `centerId` | string | Unique identifier for the center |
| `centerName` | string | Display name of the center |
| `primaryCheckInMethod` | `'qr'` or `'rfid'` | **Must choose ONE** - cannot be both |
| `allowManualEntry` | boolean | Enable manual student ID entry as backup |
| `requireLevelSelection` | boolean | Show beginner/explore selection screen |

---

## Testing Different Configurations

To test switching between QR and RFID:

1. **Test QR Mode:**
   - Set `primaryCheckInMethod: 'qr'`
   - Restart app
   - Check-in method screen should show QR button only

2. **Test RFID Mode:**
   - Set `primaryCheckInMethod: 'rfid'`
   - Restart app
   - Check-in method screen should show RFID button only

3. **Verify Mutual Exclusivity:**
   - You should NEVER see both QR and RFID buttons together
   - This is enforced by the configuration logic

---

## Quick Reference

| Center Type | Primary Method | Manual Entry | Level Selection |
|-------------|----------------|--------------|-----------------|
| QR Only | `'qr'` | `false` | `true` |
| QR + Manual | `'qr'` | `true` | `true` |
| RFID Only | `'rfid'` | `false` | `true` |
| RFID + Manual | `'rfid'` | `true` | `false` |
| Fast RFID | `'rfid'` | `true` | `false` |
| Fast QR | `'qr'` | `true` | `false` |

---

## Need Help?

- To use QR codes: Set `primaryCheckInMethod: 'qr'`
- To use RFID cards: Set `primaryCheckInMethod: 'rfid'`
- To allow backup manual entry: Set `allowManualEntry: true`
- To skip level selection: Set `requireLevelSelection: false`

**Remember:** QR and RFID are mutually exclusive - choose one!

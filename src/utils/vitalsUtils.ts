import type { Patient } from '@/types/patient';

export function checkPatientStatus(patient: Patient): 'critical' | 'watch' | 'normal' {
  const age = patient.age;
  const vitals = patient.vitals;
  if (!vitals) return 'normal';

  const hr = vitals.heartRate.slice(-1)[0] ?? 0;
  const temp = vitals.temperature.slice(-1)[0] ?? 36.5;
  const bp = vitals.bloodPressure.slice(-1)[0] ?? { systolic: 120, diastolic: 80 };

  let hrRange = { min: 60, max: 80 };
  let bpRange = { systolic: [120, 140], diastolic: [60, 80] };

  if (age < 18) hrRange = { min: 80, max: 120 };
  else if (age >= 65) {
    hrRange = { min: 70, max: 90 };
    bpRange = { systolic: [160, 170], diastolic: [80, 100] };
  }

  if (temp < 29 || temp > 42.6) return 'critical';
  if (hr < hrRange.min || hr > hrRange.max) return 'critical';
  if (bp.systolic < bpRange.systolic[0] * 0.9 || bp.systolic > bpRange.systolic[1] * 1.1) return 'critical';
  if (bp.diastolic < bpRange.diastolic[0] * 0.9 || bp.diastolic > bpRange.diastolic[1] * 1.1) return 'critical';

  if (
    hr < hrRange.min || hr > hrRange.max ||
    bp.systolic < bpRange.systolic[0] || bp.systolic > bpRange.systolic[1] ||
    bp.diastolic < bpRange.diastolic[0] || bp.diastolic > bpRange.diastolic[1]
  ) return 'watch';

  return 'normal';
}

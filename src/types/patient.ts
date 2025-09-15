// src/types/patient.ts

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface Vitals {
  heartRate: number[];
  temperature: number[];
  bloodPressure: BloodPressure[];
  oxygenSaturation: number[];
}

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  medicalRecordNumber: string;
  vitals: {
    heartRate: number[];
    temperature: number[];
    bloodPressure: { systolic: number; diastolic: number }[];
    oxygenSaturation: number[];
  };
};

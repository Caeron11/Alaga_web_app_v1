'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import {
  Activity, AlertOctagon, AlertTriangle, Ambulance, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Building2, Calendar, CalendarDays, CheckCircle2, Clock, Filter, Fuel, HeartPulse, Info, Languages, LayoutDashboard, MapPin, Megaphone, MessageSquare, MinusCircle, Moon, Navigation, Package, Palette, PhoneCall, Pill, PlusCircle, Power, Radio, RotateCcw, Search, Send, Settings, ShieldAlert, ShieldCheck, Smartphone, Stethoscope, Sun, Type, User, UserPlus, UserX, Users, X, XCircle
} from 'lucide-react';

// ==========================================
// MODULE: app/types/index.ts
// ==========================================
export type UserRole = 'citizen' | 'admin';

export type ThemeMode = 'light' | 'dark';

export type LocaleCode = 'en' | 'tl';

export type FontScaleLevel = 'sm' | 'base' | 'lg' | 'xl';

export type MedicineStatus = 'In Stock' | 'Low Stock' | 'Near-Expiry' | 'Out of Stock';

export type MedicineCategory =
  | 'Antihypertensive'
  | 'Antidiabetic'
  | 'Antibiotic'
  | 'Analgesic / Antipyretic'
  | 'Respiratory'
  | 'Vitamins & Prenatal'
  | 'First Aid / ORS';

export interface MedicineBatch {
  id: string;
  genericName: string;
  brandName: string;
  dosage: string;
  category: MedicineCategory;
  batchNo: string;
  expirationDate: string; // YYYY-MM-DD
  stock: number;
  minimumStock: number;
  maxCapacity: number;
  unit: string;
  status: MedicineStatus;
  shelfLocation: string;
  lastUpdated: string;
}

export interface NearbyBarangayStock {
  barangayId: string;
  barangayName: string;
  city: string;
  distanceKm: number;
  contactPerson: string;
  contactPhone: string;
  availableMedicines: {
    genericName: string;
    dosage: string;
    availableQty: number;
    batchNo: string;
    expirationDate: string;
  }[];
}

export interface CrossBarangayRequisition {
  id: string;
  targetBarangayId: string;
  targetBarangayName: string;
  medicineName: string;
  dosage: string;
  requestedQty: number;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  requestedBy: string;
  requestedAt: string;
  status: 'Pending Approval' | 'Approved - In Transit' | 'Fulfilled';
  notes: string;
}

export type DoctorSpecialty =
  | 'General Medicine'
  | 'Pediatrics'
  | 'OB-GYN & Maternal Care'
  | 'Internal Medicine'
  | 'Community Dentistry'
  | 'Immunization & Midwifery';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type ShiftStatus = 'Active' | 'Scheduled' | 'On Leave' | 'Completed';

export interface PhysicianShift {
  id: string;
  doctorId: string;
  doctorName: string;
  licenseNo: string;
  specialty: DoctorSpecialty;
  day: DayOfWeek;
  dateISO: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:00 AM - 12:00 PM"
  room: string;
  status: ShiftStatus;
  bookedSlots: number;
  maxSlots: number;
  leaveReason?: string;
}

export type UnitStatus = 'Standby' | 'En Route' | 'On Scene' | 'Returning' | 'Off Duty';

export type TriagePriority = 'Level 1 - Critical (Red)' | 'Level 2 - Emergent (Orange)' | 'Level 3 - Urgent (Yellow)';

export interface AmbulanceUnit {
  id: string;
  callsign: string;
  plateNumber: string;
  driverName: string;
  medicLead: string;
  contactRadio: string;
  status: UnitStatus;
  currentLocation: string;
  destination: string;
  coordinates: {
    x: number; // SVG map % coordinate (0-100)
    y: number; // SVG map % coordinate (0-100)
    lat: number;
    lng: number;
  };
  etaMinutes: number | null;
  activeIncident?: {
    incidentId: string;
    callerName: string;
    callerPhone: string;
    patientSummary: string;
    triagePriority: TriagePriority;
    pickupAddress: string;
    receivingHospital: string;
    dispatchedAt: string;
    routeWaypoints: string[];
  };
  fuelPercent: number;
  oxygenPsi: number;
}

export interface BarangayAnnouncement {
  id: string;
  titleEn: string;
  titleTl: string;
  category: 'Vaccination' | 'Medical Mission' | 'Emergency Advisory' | 'Maternal Care';
  dateLabel: string;
  timeLabel: string;
  venue: string;
  summaryEn: string;
  summaryTl: string;
  detailsEn: string;
  detailsTl: string;
  requirements: string[];
  featured: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  barangayAssignment: string;
  employeeId: string;
  position: string;
  mobile: string;
  email: string;
  prcLicense: string;
  lastLogin: string;
}

export interface SmsNotificationPreferences {
  criticalLowStockAlert: boolean;
  nearExpiryDigest: boolean;
  ambulanceDispatchSms: boolean;
  crossBarangayRequisitionSms: boolean;
  doctorLeaveBroadcast: boolean;
  citizenSmsHotlineGateway: boolean;
}

export interface SmsLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  category: 'Dispatch' | 'Inventory' | 'Schedule' | 'Public Advisory';
  message: string;
  deliveryStatus: 'Delivered' | 'Sent' | 'Queued';
}

// ==========================================
// MODULE: app/data/mockData.ts
// ==========================================
export const INITIAL_MEDICINE_BATCHES: MedicineBatch[] = [
  {
    id: 'med-001',
    genericName: 'Losartan Potassium',
    brandName: 'Cozaar / Doh-Generic',
    dosage: '50mg Tablet',
    category: 'Antihypertensive',
    batchNo: 'B101-LOS-2604',
    expirationDate: '2027-08-15',
    stock: 420,
    minimumStock: 150,
    maxCapacity: 600,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack A-1 (Cardio)',
    lastUpdated: '2026-11-07 08:30 AM',
  },
  {
    id: 'med-002',
    genericName: 'Amlodipine Besylate',
    brandName: 'Norvasc / RiteMED',
    dosage: '5mg Tablet',
    category: 'Antihypertensive',
    batchNo: 'B101-AML-2602',
    expirationDate: '2027-05-20',
    stock: 38,
    minimumStock: 120,
    maxCapacity: 500,
    unit: 'tablets',
    status: 'Low Stock',
    shelfLocation: 'Rack A-2 (Cardio)',
    lastUpdated: '2026-11-07 09:12 AM',
  },
  {
    id: 'med-003',
    genericName: 'Metformin Hydrochloride',
    brandName: 'Glucophage / Pharex',
    dosage: '500mg Film-Coated Tablet',
    category: 'Antidiabetic',
    batchNo: 'B101-MET-2601',
    expirationDate: '2027-11-30',
    stock: 540,
    minimumStock: 200,
    maxCapacity: 800,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack B-1 (Metabolic)',
    lastUpdated: '2026-11-06 04:45 PM',
  },
  {
    id: 'med-004',
    genericName: 'Amoxicillin Trihydrate',
    brandName: 'Himox / Generika',
    dosage: '500mg Capsule',
    category: 'Antibiotic',
    batchNo: 'B101-AMX-2511',
    expirationDate: '2026-11-28',
    stock: 95,
    minimumStock: 100,
    maxCapacity: 400,
    unit: 'capsules',
    status: 'Near-Expiry',
    shelfLocation: 'Rack C-1 (Anti-Infective)',
    lastUpdated: '2026-11-07 07:50 AM',
  },
  {
    id: 'med-005',
    genericName: 'Salbutamol Sulfate',
    brandName: 'Ventolin Nebule',
    dosage: '2.5mg/2.5mL Resp. Solution',
    category: 'Respiratory',
    batchNo: 'B101-SAL-2603',
    expirationDate: '2027-04-10',
    stock: 0,
    minimumStock: 60,
    maxCapacity: 250,
    unit: 'nebules',
    status: 'Out of Stock',
    shelfLocation: 'Rack D-2 (Pulmo Cold-Chain)',
    lastUpdated: '2026-11-07 10:05 AM',
  },
  {
    id: 'med-006',
    genericName: 'Paracetamol',
    brandName: 'Biogesic / DOH-Pack',
    dosage: '500mg Tablet',
    category: 'Analgesic / Antipyretic',
    batchNo: 'B101-PAR-2606',
    expirationDate: '2028-01-15',
    stock: 780,
    minimumStock: 250,
    maxCapacity: 1000,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack E-1 (General Acute)',
    lastUpdated: '2026-11-07 08:00 AM',
  },
  {
    id: 'med-007',
    genericName: 'Paracetamol Pediatric Drops',
    brandName: 'Tempra / Calpol Drops',
    dosage: '100mg/mL (15mL Bottle)',
    category: 'Analgesic / Antipyretic',
    batchNo: 'B101-PPD-2604',
    expirationDate: '2027-06-18',
    stock: 14,
    minimumStock: 40,
    maxCapacity: 150,
    unit: 'bottles',
    status: 'Low Stock',
    shelfLocation: 'Rack E-3 (Pedia)',
    lastUpdated: '2026-11-07 09:40 AM',
  },
  {
    id: 'med-008',
    genericName: 'Ferrous Sulfate + Folic Acid',
    brandName: 'DOH Maternal Iron-Folate',
    dosage: '60mg/400mcg Film Tablet',
    category: 'Vitamins & Prenatal',
    batchNo: 'B101-FEF-2605',
    expirationDate: '2027-09-22',
    stock: 610,
    minimumStock: 180,
    maxCapacity: 800,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack F-1 (Maternal Care)',
    lastUpdated: '2026-11-05 03:20 PM',
  },
  {
    id: 'med-009',
    genericName: 'Oral Rehydration Salts (ORS 75)',
    brandName: 'Hydrite / WHO-ORS',
    dosage: '20.5g Sachet (1L Mix)',
    category: 'First Aid / ORS',
    batchNo: 'B101-ORS-2607',
    expirationDate: '2027-12-01',
    stock: 290,
    minimumStock: 100,
    maxCapacity: 500,
    unit: 'sachets',
    status: 'In Stock',
    shelfLocation: 'Rack G-1 (Emergency Hydration)',
    lastUpdated: '2026-11-06 11:15 AM',
  },
  {
    id: 'med-010',
    genericName: 'Gliclazide',
    brandName: 'Diamicron MR / RiteMED',
    dosage: '30mg Modified Release Tab',
    category: 'Antidiabetic',
    batchNo: 'B101-GLI-2602',
    expirationDate: '2027-07-19',
    stock: 225,
    minimumStock: 100,
    maxCapacity: 400,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack B-2 (Metabolic)',
    lastUpdated: '2026-11-05 01:10 PM',
  },
  {
    id: 'med-011',
    genericName: 'Ascorbic Acid + Zinc',
    brandName: 'Immunpro / Poten-Cee + Zn',
    dosage: '500mg/10mg Capsule',
    category: 'Vitamins & Prenatal',
    batchNo: 'B101-ASC-2608',
    expirationDate: '2028-03-10',
    stock: 490,
    minimumStock: 150,
    maxCapacity: 700,
    unit: 'capsules',
    status: 'In Stock',
    shelfLocation: 'Rack F-2 (Immunity)',
    lastUpdated: '2026-11-07 08:15 AM',
  },
  {
    id: 'med-012',
    genericName: 'Cetirizine Dihydrochloride',
    brandName: 'Virlix / Allerkid',
    dosage: '10mg Tablet',
    category: 'Respiratory',
    batchNo: 'B101-CET-2604',
    expirationDate: '2027-10-05',
    stock: 320,
    minimumStock: 100,
    maxCapacity: 500,
    unit: 'tablets',
    status: 'In Stock',
    shelfLocation: 'Rack D-1 (Pulmo/Allergy)',
    lastUpdated: '2026-11-06 02:30 PM',
  },
];

export const NEARBY_BARANGAY_STOCKS: NearbyBarangayStock[] = [
  {
    barangayId: 'brgy-baclaran',
    barangayName: 'Barangay Baclaran Health Center',
    city: 'Parañaque City (District 1)',
    distanceKm: 1.4,
    contactPerson: 'Nurse Marites Villanueva, RN',
    contactPhone: '0917-552-8810',
    availableMedicines: [
      {
        genericName: 'Salbutamol Sulfate',
        dosage: '2.5mg/2.5mL Resp. Solution',
        availableQty: 180,
        batchNo: 'BAC-SAL-2609',
        expirationDate: '2027-09-30',
      },
      {
        genericName: 'Amlodipine Besylate',
        dosage: '5mg Tablet',
        availableQty: 640,
        batchNo: 'BAC-AML-2608',
        expirationDate: '2028-01-12',
      },
      {
        genericName: 'Paracetamol Pediatric Drops',
        dosage: '100mg/mL (15mL Bottle)',
        availableQty: 85,
        batchNo: 'BAC-PPD-2607',
        expirationDate: '2027-10-14',
      },
    ],
  },
  {
    barangayId: 'brgy-tambo',
    barangayName: 'Barangay Tambo Lying-In & RHU',
    city: 'Parañaque City (District 1)',
    distanceKm: 2.1,
    contactPerson: 'Dr. Noel Catapang, MD',
    contactPhone: '0918-334-1920',
    availableMedicines: [
      {
        genericName: 'Salbutamol Sulfate',
        dosage: '2.5mg/2.5mL Resp. Solution',
        availableQty: 140,
        batchNo: 'TAM-SAL-2606',
        expirationDate: '2027-08-22',
      },
      {
        genericName: 'Amoxicillin Trihydrate',
        dosage: '500mg Capsule',
        availableQty: 520,
        batchNo: 'TAM-AMX-2610',
        expirationDate: '2028-04-05',
      },
    ],
  },
  {
    barangayId: 'brgy-san-dionisio',
    barangayName: 'Barangay San Dionisio Central Super RHU',
    city: 'Parañaque City (District 1)',
    distanceKm: 3.3,
    contactPerson: 'Pharmacist Carla Dizon, RPh',
    contactPhone: '0917-890-4412',
    availableMedicines: [
      {
        genericName: 'Amlodipine Besylate',
        dosage: '5mg Tablet',
        availableQty: 920,
        batchNo: 'SDI-AML-2610',
        expirationDate: '2028-05-19',
      },
      {
        genericName: 'Salbutamol Sulfate',
        dosage: '2.5mg/2.5mL Resp. Solution',
        availableQty: 310,
        batchNo: 'SDI-SAL-2608',
        expirationDate: '2027-11-11',
      },
      {
        genericName: 'Paracetamol Pediatric Drops',
        dosage: '100mg/mL (15mL Bottle)',
        availableQty: 120,
        batchNo: 'SDI-PPD-2609',
        expirationDate: '2028-02-28',
      },
    ],
  },
  {
    barangayId: 'brgy-don-galo',
    barangayName: 'Barangay Don Galo Health Station',
    city: 'Parañaque City (District 1)',
    distanceKm: 1.8,
    contactPerson: 'Midwife Lorna Panganiban, RM',
    contactPhone: '0920-611-7392',
    availableMedicines: [
      {
        genericName: 'Amoxicillin Trihydrate',
        dosage: '500mg Capsule',
        availableQty: 275,
        batchNo: 'DGA-AMX-2607',
        expirationDate: '2027-12-19',
      },
      {
        genericName: 'Losartan Potassium',
        dosage: '50mg Tablet',
        availableQty: 450,
        batchNo: 'DGA-LOS-2608',
        expirationDate: '2028-01-30',
      },
    ],
  },
];

export const INITIAL_REQUISITIONS: CrossBarangayRequisition[] = [
  {
    id: 'REQ-2026-089',
    targetBarangayId: 'brgy-baclaran',
    targetBarangayName: 'Barangay Baclaran Health Center',
    medicineName: 'Salbutamol Sulfate',
    dosage: '2.5mg/2.5mL Resp. Solution',
    requestedQty: 80,
    urgency: 'Emergency',
    requestedBy: 'BHW Coordinator Elena Santos',
    requestedAt: '2026-11-07 09:30 AM',
    status: 'Approved - In Transit',
    notes: 'Urgent buffer replenishment for acute pediatric asthma cases in Purok 3 & 4.',
  },
];

export const INITIAL_PHYSICIAN_SHIFTS: PhysicianShift[] = [
  {
    id: 'shift-mon-1',
    doctorId: 'doc-01',
    doctorName: 'Dr. Camille Soriano, MD',
    licenseNo: 'PRC #0134892',
    specialty: 'General Medicine',
    day: 'Mon',
    dateISO: '2026-11-02',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Consultation Room 1',
    status: 'Completed',
    bookedSlots: 24,
    maxSlots: 25,
  },
  {
    id: 'shift-mon-2',
    doctorId: 'doc-02',
    doctorName: 'Dr. Rafael Mendoza, MD, DPPS',
    licenseNo: 'PRC #0119823',
    specialty: 'Pediatrics',
    day: 'Mon',
    dateISO: '2026-11-02',
    timeSlot: '01:00 PM - 05:00 PM',
    room: 'Pedia & Immunization Wing',
    status: 'Completed',
    bookedSlots: 19,
    maxSlots: 20,
  },
  {
    id: 'shift-tue-1',
    doctorId: 'doc-03',
    doctorName: 'Dr. Patricia Evangelista, MD, FPOGS',
    licenseNo: 'PRC #0127410',
    specialty: 'OB-GYN & Maternal Care',
    day: 'Tue',
    dateISO: '2026-11-03',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Maternal & Lying-In Suite',
    status: 'Completed',
    bookedSlots: 18,
    maxSlots: 18,
  },
  {
    id: 'shift-wed-1',
    doctorId: 'doc-04',
    doctorName: 'Dr. Lorenzo Bautista, MD, FPCP',
    licenseNo: 'PRC #0108341',
    specialty: 'Internal Medicine',
    day: 'Wed',
    dateISO: '2026-11-04',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Consultation Room 1',
    status: 'Completed',
    bookedSlots: 22,
    maxSlots: 25,
  },
  {
    id: 'shift-wed-2',
    doctorId: 'doc-05',
    doctorName: 'Dr. Hannah Reyes, DMD',
    licenseNo: 'PRC #0058921',
    specialty: 'Community Dentistry',
    day: 'Wed',
    dateISO: '2026-11-04',
    timeSlot: '01:00 PM - 04:00 PM',
    room: 'Dental Clinic Bay',
    status: 'Completed',
    bookedSlots: 14,
    maxSlots: 15,
  },
  {
    id: 'shift-thu-1',
    doctorId: 'doc-01',
    doctorName: 'Dr. Camille Soriano, MD',
    licenseNo: 'PRC #0134892',
    specialty: 'General Medicine',
    day: 'Thu',
    dateISO: '2026-11-05',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Consultation Room 1',
    status: 'Completed',
    bookedSlots: 25,
    maxSlots: 25,
  },
  {
    id: 'shift-fri-1',
    doctorId: 'doc-02',
    doctorName: 'Dr. Rafael Mendoza, MD, DPPS',
    licenseNo: 'PRC #0119823',
    specialty: 'Pediatrics',
    day: 'Fri',
    dateISO: '2026-11-06',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Pedia & Immunization Wing',
    status: 'On Leave',
    bookedSlots: 0,
    maxSlots: 20,
    leaveReason: 'Attending Philippine Pediatric Society Annual Convention (PICC)',
  },
  {
    id: 'shift-sat-1',
    doctorId: 'doc-01',
    doctorName: 'Dr. Camille Soriano, MD',
    licenseNo: 'PRC #0134892',
    specialty: 'General Medicine',
    day: 'Sat',
    dateISO: '2026-11-07',
    timeSlot: '08:00 AM - 01:00 PM',
    room: 'Consultation Room 1',
    status: 'Active',
    bookedSlots: 16,
    maxSlots: 25,
  },
  {
    id: 'shift-sat-2',
    doctorId: 'doc-03',
    doctorName: 'Dr. Patricia Evangelista, MD, FPOGS',
    licenseNo: 'PRC #0127410',
    specialty: 'OB-GYN & Maternal Care',
    day: 'Sat',
    dateISO: '2026-11-07',
    timeSlot: '09:00 AM - 02:00 PM',
    room: 'Maternal & Lying-In Suite',
    status: 'Active',
    bookedSlots: 11,
    maxSlots: 18,
  },
  {
    id: 'shift-sat-3',
    doctorId: 'doc-06',
    doctorName: 'Glenda Macaraeg, RM, BHW-Lead',
    licenseNo: 'PRC #0089412',
    specialty: 'Immunization & Midwifery',
    day: 'Sat',
    dateISO: '2026-11-07',
    timeSlot: '08:00 AM - 04:00 PM',
    room: 'Vaccination & Bakuna Hub',
    status: 'Active',
    bookedSlots: 32,
    maxSlots: 45,
  },
  {
    id: 'shift-sun-1',
    doctorId: 'doc-04',
    doctorName: 'Dr. Lorenzo Bautista, MD, FPCP',
    licenseNo: 'PRC #0108341',
    specialty: 'Internal Medicine',
    day: 'Sun',
    dateISO: '2026-11-08',
    timeSlot: '08:00 AM - 12:00 PM',
    room: 'Emergency Triage & Teleconsult',
    status: 'Scheduled',
    bookedSlots: 9,
    maxSlots: 20,
  },
];

export const INITIAL_AMBULANCE_UNITS: AmbulanceUnit[] = [
  {
    id: 'unit-a01',
    callsign: 'Unit A#01 (ALS Rescue)',
    plateNumber: 'SAA-4812',
    driverName: 'EMT-B Rodrigo "Mang Rod" Dalisay',
    medicLead: 'Nurse Kevin Pangilinan, RN, EMT-P',
    contactRadio: 'VHF Ch. 4 • 0917-801-1101',
    status: 'Standby',
    currentLocation: 'Barangay 101 Health Center Bay (Quirino Ave.)',
    destination: 'Awaiting Dispatch',
    coordinates: {
      x: 34,
      y: 52,
      lat: 14.5284,
      lng: 120.9942,
    },
    etaMinutes: null,
    fuelPercent: 94,
    oxygenPsi: 2100,
  },
  {
    id: 'unit-a02',
    callsign: 'Unit A#02 (BLS Rapid)',
    plateNumber: 'SAB-9204',
    driverName: 'EMT-B Arnel Tolentino',
    medicLead: 'EMT-I Jessa Mae Gomez',
    contactRadio: 'VHF Ch. 4 • 0917-801-1102',
    status: 'En Route',
    currentLocation: 'Dr. A. Santos Ave. (Sucat Road) near Kabihasnan',
    destination: 'Ospital ng Parañaque (OSPAR 1) — Quirino Ave.',
    coordinates: {
      x: 64,
      y: 36,
      lat: 14.4998,
      lng: 120.9918,
    },
    etaMinutes: 6,
    activeIncident: {
      incidentId: 'INC-2026-1107-04',
      callerName: 'Roberto Magtanggol (Son)',
      callerPhone: '0919-442-8109',
      patientSummary: '68/M Hypertensive Crisis & Chest Heaviness (BP 190/110 mmHg)',
      triagePriority: 'Level 1 - Critical (Red)',
      pickupAddress: 'Blk 4 Lot 12, Sampaguita St., Purok 5, Brgy. 101',
      receivingHospital: 'Ospital ng Parañaque (OSPAR District 1)',
      dispatchedAt: '09:38 AM',
      routeWaypoints: [
        'Brgy. 101 Station',
        'Purok 5 Sampaguita St. (Patient Loaded)',
        'Kabihasnan Flyover',
        'Quirino Ave. Northbound',
        'Ospital ng Parañaque ER Bay',
      ],
    },
    fuelPercent: 78,
    oxygenPsi: 1850,
  },
  {
    id: 'unit-a03',
    callsign: 'Unit A#03 (Maternal & Pedia Transport)',
    plateNumber: 'SAC-3109',
    driverName: 'EMT-B Danilo "Danny" Corpuz',
    medicLead: 'Midwife Teresa Alonzo, RM',
    contactRadio: 'VHF Ch. 6 • 0917-801-1103',
    status: 'Off Duty',
    currentLocation: 'Motorpool Maintenance Bay (UV Disinfection & O2 Refill)',
    destination: 'Scheduled Preventive Maintenance until 01:00 PM',
    coordinates: {
      x: 22,
      y: 74,
      lat: 14.5210,
      lng: 120.9901,
    },
    etaMinutes: null,
    fuelPercent: 100,
    oxygenPsi: 2200,
  },
];

export const BARANGAY_ANNOUNCEMENTS: BarangayAnnouncement[] = [
  {
    id: 'ann-01',
    titleEn: 'Oplan Kalusugan: Free Pediatric Immunization & Flu Vaccine Drive',
    titleTl: 'Oplan Kalusugan: Libreng Bakuna para sa Sanggol at Senior Citizens',
    category: 'Vaccination',
    dateLabel: 'Saturday, Nov 7 – Sunday, Nov 8, 2026',
    timeLabel: '08:00 AM – 04:00 PM',
    venue: 'Barangay 101 Covered Court & Bakuna Hub (Beside Health Center)',
    summaryEn:
      'Free Pentavalent, MMR, Oral Polio vaccines for infants (0-24 mos) and Quadrivalent Influenza shots for Senior Citizens.',
    summaryTl:
      'Libreng Pentavalent, MMR, at Polio vaccine para sa mga sanggol (0-24 buwan) at bakuna laban sa Trangkaso/Pneumonia para sa mga Senior Citizens.',
    detailsEn:
      'In partnership with the Department of Health (DOH) Metro Manila Center for Health Development and the Parañaque City Health Office, Barangay 101 is conducting a weekend catch-up immunization drive. Walk-ins are welcome; priority lanes are open for PWDs, pregnant mothers, and senior citizens.',
    detailsTl:
      'Katuwang ang Department of Health (DOH-NCR) at Parañaque City Health Office, inaanyayahan ang lahat ng mga magulang at Lolo/Lola sa ating weekend Bakuna Drive. Magdala lamang po ng Baby Book (ECCD Card) o Senior Citizen ID upang mabilis ang ating pagproseso sa Triage Desk.',
    requirements: [
      'Baby Immunization Book / ECCD Card (para sa mga bata)',
      'Barangay 101 Residency ID o Senior Citizen White/Yellow Card',
      'Kumain muna bago pumunta sa Bakuna Hub at magdala ng sariling tubig',
    ],
    featured: true,
  },
  {
    id: 'ann-02',
    titleEn: 'Hypertension & Diabetes Maintenance Club: Free FBS & Lipid Screening',
    titleTl: 'Bantay Presyon at Asukal: Libreng Fasting Blood Sugar at Gamot',
    category: 'Medical Mission',
    dateLabel: 'Wednesday, Nov 11, 2026',
    timeLabel: '06:30 AM – 11:00 AM (8-10 Hours Fasting)',
    venue: 'Barangay 101 Health Center — Main Triage Lobby',
    summaryEn:
      'Free Fasting Blood Sugar (FBS), Cholesterol strip check, and 30-day Losartan/Metformin refill after physician assessment.',
    summaryTl:
      'Libreng kuhanan ng Fasting Blood Sugar (FBS), Cholesterol test, at 30-araw na rasyon ng Losartan o Metformin matapos ang konsultasyon.',
    detailsEn:
      'Registered members of the Barangay 101 Chronic Care Registry can avail of free point-of-care blood chemistry screening and immediate prescription renewal with Dr. Lorenzo Bautista.',
    detailsTl:
      'Para sa mga miyembro ng Barangay 101 Hypertension & Diabetes Club, mangyaring mag-fasting (tubig lamang ang maaaring inumin) simula alas-10 ng gabi bago ang araw ng kuhanan ng dugo.',
    requirements: [
      '8 hanggang 10 oras na fasting (tubig lamang)',
      'Lumang reseta o Barangay Health Booklet',
      'Listahan ng kasalukuyang iniinom na maintenance na gamot',
    ],
    featured: false,
  },
  {
    id: 'ann-03',
    titleEn: 'Buntis Congress: Prenatal Ultrasound & Maternal Nutrition Kit Distribution',
    titleTl: 'Alagang Ina at Sanggol: Libreng Prenatal Check-up at Maternal Kit',
    category: 'Maternal Care',
    dateLabel: 'Saturday, Nov 14, 2026',
    timeLabel: '09:00 AM – 02:00 PM',
    venue: 'Barangay 101 Maternal & Lying-In Suite (2nd Floor)',
    summaryEn:
      'Free OB-GYN consultation, fetal Doppler assessment, Tetanus Toxoid immunization, and Iron + Folic Acid supplements.',
    summaryTl:
      'Libreng OB-GYN check-up kay Dra. Patricia Evangelista, pakikinig sa tibok ng puso ni baby (Fetal Doppler), at libreng Ferrous Sulfate + Folic Acid.',
    detailsEn:
      'Expectant mothers in their 1st to 3rd trimester will receive safe motherhood counseling, PhilHealth Konsulta maternity onboarding, and a complete newborn readiness kit.',
    detailsTl:
      'Bukás para sa lahat ng buntis sa Purok 1 hanggang Purok 7. Magkakaroon din ng libreng lecture ukol sa tamang pasuso (breastfeeding) at paghahanda sa ligtas na panganganak.',
    requirements: [
      'Pink Maternal Health Record Book (Mother & Child Book)',
      'PhilHealth ID o MDR (kung meron)',
    ],
    featured: false,
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-bhw-101',
  fullName: 'Ma. Elena G. Santos, RN',
  roleTitle: 'Barangay Health Nurse & Operations Coordinator',
  barangayAssignment: 'Barangay 101 Health Center — District 1, Parañaque City',
  employeeId: 'LGU-PRQ-2021-0482',
  position: 'Public Health Nurse II (SG-16)',
  mobile: '+63 917 842 9910',
  email: 'elena.santos@brgy101-paranaque.gov.ph',
  prcLicense: 'PRC RN #0841920 (Valid until 09/2028)',
  lastLogin: 'Nov 7, 2026 • 08:02 AM PHT (Verified Workstation)',
};

export const INITIAL_SMS_PREFERENCES: SmsNotificationPreferences = {
  criticalLowStockAlert: true,
  nearExpiryDigest: true,
  ambulanceDispatchSms: true,
  crossBarangayRequisitionSms: true,
  doctorLeaveBroadcast: true,
  citizenSmsHotlineGateway: true,
};

export const INITIAL_SMS_LOGS: SmsLogEntry[] = [
  {
    id: 'sms-901',
    timestamp: '09:38 AM',
    recipient: '+63 919 442 8109 (Caller: R. Magtanggol)',
    category: 'Dispatch',
    message:
      '[ALAGA-101] Ambulance Unit A#02 (Plate SAB-9204) is EN ROUTE to Purok 5 Sampaguita St. Medic Lead: J. Gomez. ETA: 6 mins.',
    deliveryStatus: 'Delivered',
  },
  {
    id: 'sms-902',
    timestamp: '09:30 AM',
    recipient: '+63 917 552 8810 (Brgy. Baclaran RHU)',
    category: 'Inventory',
    message:
      '[ALAGA-REQ] Emergency stock transfer request #REQ-2026-089 from Brgy. 101: Salbutamol 2.5mg Nebules (80 units). Approved for courier.',
    deliveryStatus: 'Delivered',
  },
  {
    id: 'sms-903',
    timestamp: '08:15 AM',
    recipient: 'BHW Pharmacist & CHO Supply Officer',
    category: 'Inventory',
    message:
      '[ALAGA-ALERT] Critical Stock Threshold: Salbutamol Nebule (0/60 Out of Stock), Amlodipine 5mg (38/120 Low Stock). Action required.',
    deliveryStatus: 'Delivered',
  },
];

// ==========================================
// MODULE: app/context/SettingsContext.tsx
// ==========================================
export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  citizenPortal: string;
  adminConsole: string;
  publicMedicineLookup: string;
  physicianSchedule: string;
  liveAmbulanceTracker: string;
  barangayAnnouncements: string;
  availableToday: string;
  lowStock: string;
  nearExpiry: string;
  outOfStock: string;
  inStock: string;
  nearbyBarangays: string;
  fileRequisition: string;
  dispatchConsole: string;
  inventoryLedger: string;
  shiftRoster: string;
  systemSettings: string;
  overviewDashboard: string;
  emergencyHotline: string;
  searchMedicinesPlaceholder: string;
  addShift: string;
  markLeave: string;
  restockBatch: string;
  dispenseMedicine: string;
  dispatchSelectedUnit: string;
}

const DICTIONARY: Record<LocaleCode, TranslationDictionary> = {
  en: {
    appName: 'ALAGA v2.0',
    appTagline: 'Barangay 101 Centralized Health Monitoring & Dispatch Platform',
    citizenPortal: 'Resident Portal',
    adminConsole: 'Health Worker Admin',
    publicMedicineLookup: 'Public Medicine Stock Lookup',
    physicianSchedule: 'Physician & Midwife Duty Schedule',
    liveAmbulanceTracker: 'Live Ambulance Status Tracker',
    barangayAnnouncements: 'Barangay Health Advisories & Programs',
    availableToday: 'On-Duty Today at Barangay 101',
    lowStock: 'Low Stock',
    nearExpiry: 'Near-Expiry',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    nearbyBarangays: 'Nearby Barangay Buffer Stock',
    fileRequisition: 'File Request from Selected Barangay',
    dispatchConsole: 'Ambulance Dispatch',
    inventoryLedger: 'Medicine Inventory',
    shiftRoster: 'Physician Schedule',
    systemSettings: 'Account & Settings',
    overviewDashboard: 'Command Overview',
    emergencyHotline: 'Brgy. 101 Rescue Hotline: (02) 8821-0101 / 0917-801-1101',
    searchMedicinesPlaceholder: 'Search generic name, brand, batch no., or category...',
    addShift: 'Add Physician Shift',
    markLeave: 'Mark Doctor Leave',
    restockBatch: 'Restock / Add Batch',
    dispenseMedicine: 'Dispense to Resident',
    dispatchSelectedUnit: 'Dispatch Selected Unit',
  },
  tl: {
    appName: 'ALAGA v2.0',
    appTagline: 'Sentralisadong Sistema ng Gamot, Doktor, at Ambulansya — Brgy. 101',
    citizenPortal: 'Portal ng Residente',
    adminConsole: 'Admin (Health Worker)',
    publicMedicineLookup: 'Talaan ng Libreng Gamot sa Health Center',
    physicianSchedule: 'Iskedyul ng Doktor, Dentista at Midwife',
    liveAmbulanceTracker: 'Live Tracker ng Barangay Rescue Ambulance',
    barangayAnnouncements: 'Mga Anunsyo at Oplan Kalusugan sa Barangay',
    availableToday: 'Naka-Duty Ngayong Araw sa Brgy. 101',
    lowStock: 'Mababang Stak',
    nearExpiry: 'Malapit Ma-Expire',
    outOfStock: 'Ubos na ang Stak',
    inStock: 'May Stak',
    nearbyBarangays: 'Stak sa Karatig-Barangay (Parañaque)',
    fileRequisition: 'Humiling ng Gamot sa Napiling Barangay',
    dispatchConsole: 'Ambulance Dispatch',
    inventoryLedger: 'Imbentaryo ng Gamot',
    shiftRoster: 'Iskedyul ng Doktor',
    systemSettings: 'Account at Settings',
    overviewDashboard: 'Pangkalahatang Dashboard',
    emergencyHotline: 'Brgy. 101 Emergency Hotline: (02) 8821-0101 / 0917-801-1101',
    searchMedicinesPlaceholder: 'Maghanap ng generic na pangalan, brand, o batch...',
    addShift: 'Magdagdag ng Duty Shift',
    markLeave: 'Markahan ng Leave',
    restockBatch: 'Magdagdag ng Stak',
    dispenseMedicine: 'Magbigay ng Gamot',
    dispatchSelectedUnit: 'I-Dispatch ang Ambulansya',
  },
};

export const FONT_SCALE_PX_MAP: Record<FontScaleLevel, string> = {
  sm: '14px',   // 87.5% compact
  base: '16px', // 100% standard WCAG baseline
  lg: '18px',   // 112.5% senior-citizen comfortable
  xl: '20px',   // 125% high-visibility accessibility mode
};

interface SettingsContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  fontScale: FontScaleLevel;
  setFontScale: (scale: FontScaleLevel) => void;
  t: TranslationDictionary;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [locale, setLocaleState] = useState<LocaleCode>('en');
  const [fontScale, setFontScaleState] = useState<FontScaleLevel>('base');

  // Synchronize root <html> attributes for global rem scaling and dark/light glass tokens
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlEl = document.documentElement;
      htmlEl.setAttribute('data-font-scale', fontScale);
      htmlEl.style.fontSize = FONT_SCALE_PX_MAP[fontScale];

      if (theme === 'dark') {
        htmlEl.classList.add('dark');
      } else {
        htmlEl.classList.remove('dark');
      }
    }
  }, [fontScale, theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('alaga_theme', newTheme);
    } catch {
      // Ignore sandbox storage error
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('alaga_locale', newLocale);
    } catch {
      // Ignore sandbox storage error
    }
  };

  const setFontScale = (newScale: FontScaleLevel) => {
    setFontScaleState(newScale);
    try {
      localStorage.setItem('alaga_font_scale', newScale);
    } catch {
      // Ignore sandbox storage error
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        locale,
        setLocale,
        fontScale,
        setFontScale,
        t: DICTIONARY[locale],
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}

// ==========================================
// MODULE: app/context/AppContext.tsx
// ==========================================
export interface DispatchPayload {
  unitId: string;
  callerName: string;
  callerPhone: string;
  patientSummary: string;
  triagePriority: TriagePriority;
  pickupAddress: string;
  receivingHospital: string;
  estimatedMinutes: number;
}

export interface RequisitionPayload {
  targetBarangayId: string;
  medicineName: string;
  dosage: string;
  requestedQty: number;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  notes: string;
}

interface AppContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  medicines: MedicineBatch[];
  nearbyBarangays: NearbyBarangayStock[];
  requisitions: CrossBarangayRequisition[];
  shifts: PhysicianShift[];
  ambulanceUnits: AmbulanceUnit[];
  announcements: BarangayAnnouncement[];
  userProfile: UserProfile;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  smsPreferences: SmsNotificationPreferences;
  toggleSmsPreference: (key: keyof SmsNotificationPreferences) => void;
  smsLogs: SmsLogEntry[];
  sendTestSmsNotification: (recipient: string, message: string, category: SmsLogEntry['category']) => void;
  restockMedicine: (batchId: string, additionalQty: number, newBatchNo?: string, newExpiry?: string) => void;
  dispenseMedicine: (batchId: string, dispenseQty: number, patientName: string) => void;
  fileCrossBarangayRequisition: (payload: RequisitionPayload) => void;
  addPhysicianShift: (newShift: Omit<PhysicianShift, 'id'>) => void;
  markPhysicianLeave: (shiftId: string, reason: string) => void;
  restorePhysicianShift: (shiftId: string) => void;
  dispatchAmbulanceUnit: (payload: DispatchPayload) => void;
  completeAmbulanceMission: (unitId: string) => void;
  toggleUnitOffDuty: (unitId: string) => void;
  toastMessage: string | null;
  triggerToast: (msg: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function computeMedicineStatus(stock: number, minStock: number, expirationDate: string): MedicineStatus {
  if (stock <= 0) return 'Out of Stock';
  // Check if expiring within 45 days of reference date 2026-11-07
  const refDate = new Date('2026-11-07T00:00:00');
  const expDate = new Date(`${expirationDate}T00:00:00`);
  const diffDays = Math.ceil((expDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 45) return 'Near-Expiry';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('citizen');
  const [medicines, setMedicines] = useState<MedicineBatch[]>(INITIAL_MEDICINE_BATCHES);
  const [nearbyBarangays, setNearbyBarangays] = useState<NearbyBarangayStock[]>(NEARBY_BARANGAY_STOCKS);
  const [requisitions, setRequisitions] = useState<CrossBarangayRequisition[]>(INITIAL_REQUISITIONS);
  const [shifts, setShifts] = useState<PhysicianShift[]>(INITIAL_PHYSICIAN_SHIFTS);
  const [ambulanceUnits, setAmbulanceUnits] = useState<AmbulanceUnit[]>(INITIAL_AMBULANCE_UNITS);
  const [announcements] = useState<BarangayAnnouncement[]>(BARANGAY_ANNOUNCEMENTS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [smsPreferences, setSmsPreferences] = useState<SmsNotificationPreferences>(INITIAL_SMS_PREFERENCES);
  const [smsLogs, setSmsLogs] = useState<SmsLogEntry[]>(INITIAL_SMS_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4200);
  };

  const sendTestSmsNotification = (
    recipient: string,
    message: string,
    category: SmsLogEntry['category']
  ) => {
    const newEntry: SmsLogEntry = {
      id: `sms-${Date.now()}`,
      timestamp: 'Just now',
      recipient,
      category,
      message,
      deliveryStatus: 'Delivered',
    };
    setSmsLogs((prev) => [newEntry, ...prev]);
    triggerToast(`SMS gateway dispatched to ${recipient}`);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
    triggerToast('Account profile updated and synced with Barangay 101 Registry.');
  };

  const toggleSmsPreference = (key: keyof SmsNotificationPreferences) => {
    setSmsPreferences((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
    triggerToast('SMS alert threshold preference updated.');
  };

  const restockMedicine = (
    batchId: string,
    additionalQty: number,
    newBatchNo?: string,
    newExpiry?: string
  ) => {
    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id !== batchId) return item;
        const updatedStock = item.stock + additionalQty;
        const updatedExpiry = newExpiry && newExpiry.trim() !== '' ? newExpiry : item.expirationDate;
        const updatedBatch = newBatchNo && newBatchNo.trim() !== '' ? newBatchNo : item.batchNo;
        const nextStatus = computeMedicineStatus(updatedStock, item.minimumStock, updatedExpiry);
        return {
          ...item,
          stock: updatedStock,
          batchNo: updatedBatch,
          expirationDate: updatedExpiry,
          status: nextStatus,
          lastUpdated: 'Just now',
        };
      })
    );
    triggerToast(`Restocked +${additionalQty} units to inventory ledger.`);
  };

  const dispenseMedicine = (batchId: string, dispenseQty: number, patientName: string) => {
    setMedicines((prev) =>
      prev.map((item) => {
        if (item.id !== batchId) return item;
        const updatedStock = Math.max(0, item.stock - dispenseQty);
        const nextStatus = computeMedicineStatus(updatedStock, item.minimumStock, item.expirationDate);
        return {
          ...item,
          stock: updatedStock,
          status: nextStatus,
          lastUpdated: 'Just now',
        };
      })
    );
    triggerToast(`Dispensed ${dispenseQty} units to resident ${patientName}.`);
  };

  const fileCrossBarangayRequisition = (payload: RequisitionPayload) => {
    const targetBrgy = nearbyBarangays.find((b) => b.barangayId === payload.targetBarangayId);
    if (!targetBrgy) return;

    const newReq: CrossBarangayRequisition = {
      id: `REQ-2026-${Math.floor(100 + Math.random() * 899)}`,
      targetBarangayId: targetBrgy.barangayId,
      targetBarangayName: targetBrgy.barangayName,
      medicineName: payload.medicineName,
      dosage: payload.dosage,
      requestedQty: payload.requestedQty,
      urgency: payload.urgency,
      requestedBy: userProfile.fullName,
      requestedAt: 'Just now',
      status: 'Pending Approval',
      notes: payload.notes,
    };

    setRequisitions((prev) => [newReq, ...prev]);

    // Deduct reserved buffer from nearby barangay preview
    setNearbyBarangays((prev) =>
      prev.map((b) => {
        if (b.barangayId !== payload.targetBarangayId) return b;
        return {
          ...b,
          availableMedicines: b.availableMedicines.map((m) =>
            m.genericName === payload.medicineName
              ? { ...m, availableQty: Math.max(0, m.availableQty - payload.requestedQty) }
              : m
          ),
        };
      })
    );

    if (smsPreferences.crossBarangayRequisitionSms) {
      sendTestSmsNotification(
        `${targetBrgy.contactPhone} (${targetBrgy.barangayName})`,
        `[ALAGA-REQ] ${payload.urgency.toUpperCase()} Stock Request ${newReq.id}: ${payload.medicineName} (${payload.requestedQty} units) for Brgy. 101.`,
        'Inventory'
      );
    } else {
      triggerToast(`Cross-barangay requisition ${newReq.id} filed with ${targetBrgy.barangayName}.`);
    }
  };

  const addPhysicianShift = (newShift: Omit<PhysicianShift, 'id'>) => {
    const created: PhysicianShift = {
      ...newShift,
      id: `shift-${Date.now()}`,
    };
    setShifts((prev) => [...prev, created]);
    triggerToast(`Added shift for ${newShift.doctorName} on ${newShift.day}.`);
  };

  const markPhysicianLeave = (shiftId: string, reason: string) => {
    let affectedDoctor = '';
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        affectedDoctor = s.doctorName;
        return {
          ...s,
          status: 'On Leave',
          leaveReason: reason,
        };
      })
    );
    if (smsPreferences.doctorLeaveBroadcast && affectedDoctor) {
      sendTestSmsNotification(
        'Brgy. 101 Queued Patients Registry',
        `[ALAGA-ADVISORY] ${affectedDoctor} is marked On Leave (${reason}). Reliever physician / teleconsult slot assigned.`,
        'Schedule'
      );
    } else {
      triggerToast(`Marked ${affectedDoctor || 'physician'} as On Leave.`);
    }
  };

  const restorePhysicianShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, status: s.day === 'Sat' ? 'Active' : 'Scheduled', leaveReason: undefined }
          : s
      )
    );
    triggerToast('Physician shift restored to active duty roster.');
  };

  const dispatchAmbulanceUnit = (payload: DispatchPayload) => {
    let dispatchedCallsign = '';
    setAmbulanceUnits((prev) =>
      prev.map((u) => {
        if (u.id !== payload.unitId) return u;
        dispatchedCallsign = u.callsign;
        return {
          ...u,
          status: 'En Route',
          currentLocation: `Departing Brgy. 101 Station → ${payload.pickupAddress}`,
          destination: payload.receivingHospital,
          etaMinutes: payload.estimatedMinutes,
          coordinates: {
            ...u.coordinates,
            x: 48,
            y: 44,
          },
          activeIncident: {
            incidentId: `INC-2026-1107-${Math.floor(10 + Math.random() * 89)}`,
            callerName: payload.callerName,
            callerPhone: payload.callerPhone,
            patientSummary: payload.patientSummary,
            triagePriority: payload.triagePriority,
            pickupAddress: payload.pickupAddress,
            receivingHospital: payload.receivingHospital,
            dispatchedAt: 'Just now',
            routeWaypoints: [
              'Barangay 101 Rescue Station',
              payload.pickupAddress,
              'Quirino Ave. Emergency Corridor',
              payload.receivingHospital,
            ],
          },
        };
      })
    );

    if (smsPreferences.ambulanceDispatchSms) {
      sendTestSmsNotification(
        `${payload.callerPhone} (Caller: ${payload.callerName})`,
        `[ALAGA-RESCUE] ${dispatchedCallsign} dispatched to ${payload.pickupAddress}. Priority: ${payload.triagePriority}. ETA: ${payload.estimatedMinutes} mins.`,
        'Dispatch'
      );
    } else {
      triggerToast(`${dispatchedCallsign} dispatched to ${payload.pickupAddress}.`);
    }
  };

  const completeAmbulanceMission = (unitId: string) => {
    setAmbulanceUnits((prev) =>
      prev.map((u) =>
        u.id === unitId
          ? {
              ...u,
              status: 'Standby',
              currentLocation: 'Barangay 101 Health Center Bay (Quirino Ave.)',
              destination: 'Awaiting Dispatch',
              etaMinutes: null,
              coordinates: { ...u.coordinates, x: 34, y: 52 },
              activeIncident: undefined,
            }
          : u
      )
    );
    triggerToast('Unit returned to Barangay 101 station and marked Standby.');
  };

  const toggleUnitOffDuty = (unitId: string) => {
    setAmbulanceUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextStatus = u.status === 'Off Duty' ? 'Standby' : 'Off Duty';
        return {
          ...u,
          status: nextStatus,
          etaMinutes: null,
          activeIncident: undefined,
          currentLocation:
            nextStatus === 'Standby'
              ? 'Barangay 101 Health Center Bay (Quirino Ave.)'
              : 'Motorpool Maintenance & UV Disinfection Bay',
          destination:
            nextStatus === 'Standby' ? 'Awaiting Dispatch' : 'Preventive Maintenance / Crew Rest',
        };
      })
    );
    triggerToast('Updated ambulance unit duty status.');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        medicines,
        nearbyBarangays,
        requisitions,
        shifts,
        ambulanceUnits,
        announcements,
        userProfile,
        updateUserProfile,
        smsPreferences,
        toggleSmsPreference,
        smsLogs,
        sendTestSmsNotification,
        restockMedicine,
        dispenseMedicine,
        fileCrossBarangayRequisition,
        addPhysicianShift,
        markPhysicianLeave,
        restorePhysicianShift,
        dispatchAmbulanceUnit,
        completeAmbulanceMission,
        toggleUnitOffDuty,
        toastMessage,
        triggerToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}

// ==========================================
// MODULE: app/components/ui/GlassCard.tsx
// ==========================================
interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'interactive' | 'subtle';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  active?: boolean;
}

export function GlassCard({
  children,
  variant = 'default',
  className = '',
  onClick,
  ariaLabel,
  active = false,
}: GlassCardProps) {
  const baseStyles =
    'rounded-2xl transition-all duration-200 backdrop-blur-xl ';

  const variantMap: Record<NonNullable<GlassCardProps['variant']>, string> = {
    default:
      'bg-white/75 dark:bg-[#161922]/80 border border-white/60 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-slate-900 dark:text-slate-100',
    elevated:
      'bg-white/85 dark:bg-[#1A1E29]/90 border border-indigo-200/70 dark:border-indigo-500/25 shadow-md dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-slate-900 dark:text-slate-100',
    interactive:
      'bg-white/70 hover:bg-white/90 dark:bg-[#161922]/75 dark:hover:bg-[#1A1E29]/95 border border-white/60 dark:border-white/15 shadow-sm hover:shadow-md cursor-pointer text-slate-900 dark:text-slate-100',
    subtle:
      'bg-white/50 dark:bg-[#12151C]/70 border border-white/40 dark:border-white/10 text-slate-800 dark:text-slate-200',
  };

  const activeRing = active
    ? 'ring-2 ring-indigo-600 dark:ring-cyan-400 border-indigo-500 dark:border-cyan-400'
    : '';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${baseStyles} ${variantMap[variant]} ${activeRing} text-left w-full min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${baseStyles} ${variantMap[variant]} ${activeRing} ${className}`}>
      {children}
    </div>
  );
}

// ==========================================
// MODULE: app/components/ui/GlassButton.tsx
// ==========================================
interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'glass' | 'emerald' | 'amber' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function GlassButton({
  children,
  variant = 'glass',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}: GlassButtonProps) {
  // Strictly enforce minimum 44x44px touch target across all button sizes
  const sizeStyles: Record<NonNullable<GlassButtonProps['size']>, string> = {
    sm: 'min-h-[44px] min-w-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl',
    md: 'min-h-[44px] min-w-[44px] px-4 py-2.5 text-sm font-semibold rounded-2xl',
    lg: 'min-h-[48px] min-w-[48px] px-6 py-3 text-base font-bold rounded-2xl',
  };

  const variantStyles: Record<NonNullable<GlassButtonProps['variant']>, string> = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white border border-indigo-500/40 shadow-sm',
    glass:
      'bg-white/65 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-slate-300/80 dark:border-white/20 text-slate-900 dark:text-slate-100 shadow-sm',
    emerald:
      'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white border border-emerald-400/30 shadow-sm',
    amber:
      'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white border border-amber-400/30 shadow-sm',
    danger:
      'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 text-white border border-rose-400/30 shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-transparent',
  };

  return (
    <button
      type={rest.type || 'button'}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// ==========================================
// MODULE: app/components/ui/Badge.tsx
// ==========================================
export type BadgeTone =
  | 'emerald'
  | 'amber'
  | 'orange'
  | 'rose'
  | 'indigo'
  | 'cyan'
  | 'slate';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  pulse?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = 'slate',
  pulse = false,
  className = '',
}: BadgeProps) {
  // High-contrast WCAG 2.2 AA badge pairings for both light and dark modes
  const toneStyles: Record<BadgeTone, string> = {
    emerald:
      'bg-emerald-100/95 text-emerald-900 border-emerald-400/80 dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-500/50',
    amber:
      'bg-amber-100/95 text-amber-950 border-amber-400/80 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-500/50',
    orange:
      'bg-orange-100/95 text-orange-950 border-orange-400/80 dark:bg-orange-950/90 dark:text-orange-200 dark:border-orange-500/50',
    rose:
      'bg-rose-100/95 text-rose-950 border-rose-400/80 dark:bg-rose-950/90 dark:text-rose-200 dark:border-rose-500/50',
    indigo:
      'bg-indigo-100/95 text-indigo-950 border-indigo-400/80 dark:bg-indigo-950/90 dark:text-indigo-200 dark:border-indigo-500/50',
    cyan:
      'bg-cyan-100/95 text-cyan-950 border-cyan-400/80 dark:bg-cyan-950/90 dark:text-cyan-200 dark:border-cyan-500/50',
    slate:
      'bg-slate-200/90 text-slate-900 border-slate-400/70 dark:bg-slate-800/90 dark:text-slate-200 dark:border-slate-600/60',
  };

  const dotColors: Record<BadgeTone, string> = {
    emerald: 'bg-emerald-600 dark:bg-emerald-400',
    amber: 'bg-amber-600 dark:bg-amber-400',
    orange: 'bg-orange-600 dark:bg-orange-400',
    rose: 'bg-rose-600 dark:bg-rose-400',
    indigo: 'bg-indigo-600 dark:bg-indigo-400',
    cyan: 'bg-cyan-600 dark:bg-cyan-400',
    slate: 'bg-slate-600 dark:bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${toneStyles[tone]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[tone]}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[tone]}`} />
        </span>
      )}
      {children}
    </span>
  );
}

// ==========================================
// MODULE: app/components/ui/Input.tsx
// ==========================================
interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
}

export function GlassInput({
  label,
  helperText,
  leftIcon,
  className = '',
  id,
  ...rest
}: GlassInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600 dark:text-slate-300">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`w-full min-h-[44px] rounded-xl bg-white/85 dark:bg-[#12151C]/90 border border-slate-300 dark:border-white/20 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-cyan-400 transition-all ${
            leftIcon ? 'pl-10' : ''
          } ${className}`}
          {...rest}
        />
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{helperText}</p>
      )}
    </div>
  );
}

interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function GlassSelect({ label, id, children, className = '', ...rest }: GlassSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full min-h-[44px] rounded-xl bg-white/85 dark:bg-[#12151C]/90 border border-slate-300 dark:border-white/20 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-cyan-400 transition-all ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}

interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function GlassTextarea({ label, id, className = '', ...rest }: GlassTextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full rounded-xl bg-white/85 dark:bg-[#12151C]/90 border border-slate-300 dark:border-white/20 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-cyan-400 transition-all ${className}`}
        {...rest}
      />
    </div>
  );
}

// ==========================================
// MODULE: app/components/ui/Modal.tsx
// ==========================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClass?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-xl',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`relative w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#161922]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl p-6 text-slate-900 dark:text-slate-100`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4 mb-5">
          <div>
            <h2 id="modal-title" className="text-lg font-extrabold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl bg-slate-200/70 hover:bg-slate-300/80 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: app/components/navigation/GlassNavbar.tsx
// ==========================================
export type ActiveRoute =
  | 'citizen-home'
  | 'citizen-ambulance'
  | 'admin-overview'
  | 'admin-dispatch'
  | 'admin-inventory'
  | 'admin-schedule'
  | 'admin-settings';

interface GlassNavbarProps {
  activeRoute: ActiveRoute;
  onNavigate: (route: ActiveRoute) => void;
}

const FONT_SCALE_ORDER: FontScaleLevel[] = ['sm', 'base', 'lg', 'xl'];

export function GlassNavbar({ activeRoute, onNavigate }: GlassNavbarProps) {
  const { theme, toggleTheme, locale, setLocale, fontScale, setFontScale, t } = useSettings();
  const { role, setRole, ambulanceUnits } = useApp();

  const activeEnRouteCount = ambulanceUnits.filter((u) => u.status === 'En Route').length;

  const cycleFontScale = () => {
    const idx = FONT_SCALE_ORDER.indexOf(fontScale);
    const next = FONT_SCALE_ORDER[(idx + 1) % FONT_SCALE_ORDER.length];
    setFontScale(next);
  };

  const handleRoleSwitch = (targetRole: 'citizen' | 'admin') => {
    setRole(targetRole);
    if (targetRole === 'citizen') {
      onNavigate('citizen-home');
    } else {
      onNavigate('admin-overview');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/75 dark:bg-[#12151C]/85 border-b border-white/60 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(role === 'citizen' ? 'citizen-home' : 'admin-overview')}
            className="min-h-[44px] flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  ALAGA
                </span>
                <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950/90 dark:text-indigo-200 border border-indigo-400/50">
                  Brgy. 101 • v2.0
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                {t.appTagline}
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Links based on Active Role */}
        <nav aria-label="Main navigation" className="flex items-center gap-1.5 overflow-x-auto py-1">
          {role === 'citizen' ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('citizen-home')}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all ${
                  activeRoute === 'citizen-home'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Megaphone className="w-4 h-4 shrink-0" />
                <span>{locale === 'en' ? 'Public Health Hub' : 'Sentro ng Kalusugan'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('citizen-ambulance')}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all ${
                  activeRoute === 'citizen-ambulance'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Ambulance className="w-4 h-4 shrink-0" />
                <span>{locale === 'en' ? 'Live Ambulance Status' : 'Live Ambulansya'}</span>
                {activeEnRouteCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-slate-950">
                    {activeEnRouteCount} Active
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigate('admin-overview')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  activeRoute === 'admin-overview'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>{locale === 'en' ? 'Overview' : 'Overview'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-dispatch')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  activeRoute === 'admin-dispatch'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Ambulance className="w-4 h-4 shrink-0" />
                <span>{t.dispatchConsole}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-inventory')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  activeRoute === 'admin-inventory'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                <span>{t.inventoryLedger}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-schedule')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  activeRoute === 'admin-schedule'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{t.shiftRoster}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-settings')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                  activeRoute === 'admin-settings'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 dark:bg-white/5 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/60 dark:border-white/10'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>{t.systemSettings}</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Controls: Role Switcher + Accessibility Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Role Switcher Pill */}
          <div
            role="group"
            aria-label="User role switcher"
            className="inline-flex rounded-2xl p-1 bg-slate-200/80 dark:bg-[#1A1E29] border border-slate-300/80 dark:border-white/15"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('citizen')}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all ${
                role === 'citizen'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-950 dark:text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.citizenPortal}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all ${
                role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.adminConsole}</span>
            </button>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'en' ? 'tl' : 'en')}
            aria-label="Toggle Filipino or English language"
            title="Switch Language (English / Tagalog)"
            className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 text-xs font-extrabold text-slate-900 dark:text-slate-100 inline-flex items-center justify-center gap-1"
          >
            <Languages className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>{locale.toUpperCase()}</span>
          </button>

          {/* Dynamic Font Scale Cycle Button */}
          <button
            type="button"
            onClick={cycleFontScale}
            aria-label={`Cycle font scale, current ${fontScale}`}
            title="Cycle Root HTML Font Size (WCAG Scaling)"
            className="min-h-[44px] min-w-[44px] px-2.5 rounded-xl bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 text-xs font-extrabold text-slate-900 dark:text-slate-100 inline-flex items-center justify-center gap-1"
          >
            <Type className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span className="uppercase">{fontScale}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark or light glass theme"
            title="Switch Light / Dark Glass Theme"
            className="min-h-[44px] min-w-[44px] rounded-xl bg-white/70 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 text-slate-900 dark:text-slate-100 inline-flex items-center justify-center"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// MODULE: app/citizen/page.tsx
// ==========================================
interface CitizenPortalProps {
  onOpenAmbulanceTracker?: () => void;
}

const DAYS_ORDER: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMedicineBadgeTone(status: MedicineStatus): BadgeTone {
  switch (status) {
    case 'In Stock':
      return 'emerald';
    case 'Low Stock':
      return 'amber';
    case 'Near-Expiry':
      return 'orange';
    case 'Out of Stock':
      return 'rose';
  }
}

function CitizenPortalPage({ onOpenAmbulanceTracker }: CitizenPortalProps) {
  const { locale, t } = useSettings();
  const { medicines, nearbyBarangays, shifts, announcements, ambulanceUnits } = useApp();

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<BarangayAnnouncement | null>(
    null
  );
  const [medSearch, setMedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<DayOfWeek | 'ALL'>('ALL');

  const categories: ('ALL' | MedicineCategory)[] = [
    'ALL',
    'Antihypertensive',
    'Antidiabetic',
    'Antibiotic',
    'Analgesic / Antipyretic',
    'Respiratory',
    'Vitamins & Prenatal',
    'First Aid / ORS',
  ];

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const q = medSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [medicines, selectedCategory, medSearch]);

  const availableTodayShifts = useMemo(
    () => shifts.filter((s) => s.day === 'Sat' && s.status === 'Active'),
    [shifts]
  );

  const filteredShifts = useMemo(
    () => (selectedDayFilter === 'ALL' ? shifts : shifts.filter((s) => s.day === selectedDayFilter)),
    [shifts, selectedDayFilter]
  );

  const standbyUnits = ambulanceUnits.filter((u) => u.status === 'Standby').length;
  const enRouteUnits = ambulanceUnits.filter((u) => u.status === 'En Route').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Emergency & Live Status Banner */}
      <GlassCard
        variant="elevated"
        className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900/90 via-violet-900/90 to-slate-900/95 text-white border-indigo-400/30"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-cyan-200 text-xs font-extrabold uppercase tracking-wider">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.emergencyHotline}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {locale === 'en'
                ? 'Barangay 101 Citizen Health & Medicine Portal'
                : 'Portal ng Kalusugan at Libreng Gamot — Barangay 101'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-3xl">
              {locale === 'en'
                ? 'Check real-time medicine stock before visiting the Health Center, view on-duty physicians today, or track our Barangay Rescue Ambulance.'
                : 'Tingnan muna kung may stak ng gamot bago pumunta sa Health Center, alamin kung sinong doktor ang naka-duty, o subaybayan ang Barangay Ambulance.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs">
              <div className="font-bold text-indigo-200">
                {locale === 'en' ? 'Rescue Fleet Status' : 'Estado ng Ambulansya'}
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {standbyUnits} Standby • {enRouteUnits} En Route
              </div>
            </div>
            {onOpenAmbulanceTracker && (
              <GlassButton
                variant="emerald"
                onClick={onOpenAmbulanceTracker}
                icon={<Ambulance className="w-4 h-4" />}
              >
                {locale === 'en' ? 'Open Live Ambulance Map' : 'Buksan ang Live Ambulance Map'}
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Section 1: Barangay Health Announcements (Oplan Kalusugan) */}
      <section aria-labelledby="announcements-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/15 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="announcements-heading"
                className="text-lg font-extrabold text-slate-900 dark:text-white"
              >
                {t.barangayAnnouncements}
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {locale === 'en'
                  ? 'Click any program card to view requirements and schedule details'
                  : 'I-click ang anunsyo upang makita ang kumpletong detalye at kailangan dalhin'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {announcements.map((ann) => (
            <GlassCard
              key={ann.id}
              variant={ann.featured ? 'elevated' : 'interactive'}
              onClick={() => setSelectedAnnouncement(ann)}
              className="p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={ann.featured ? 'indigo' : 'cyan'} pulse={ann.featured}>
                    {ann.category}
                  </Badge>
                  <span className="text-xs font-bold text-indigo-700 dark:text-cyan-300 inline-flex items-center gap-1">
                    {locale === 'en' ? 'Read Advisory' : 'Basahin'}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {locale === 'en' ? ann.titleEn : ann.titleTl}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {locale === 'en' ? ann.summaryEn : ann.summaryTl}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-1 text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                  <span>{ann.dateLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />
                  <span className="truncate">{ann.venue}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Section 2: Public Medicine Stock Lookup + Nearby Barangay Referral */}
      <section aria-labelledby="medicine-lookup-heading" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="medicine-lookup-heading"
                className="text-lg font-extrabold text-slate-900 dark:text-white"
              >
                {t.publicMedicineLookup}
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {locale === 'en'
                  ? 'Real-time Barangay 101 pharmacy counter availability with nearby Parañaque RHU alternatives for low/out-of-stock items'
                  : 'Real-time na bilang ng libreng gamot sa Brgy. 101 at suhestiyon sa karatig-barangay kung ubos na ang stak'}
              </p>
            </div>
          </div>

          <div className="w-full md:w-80">
            <GlassInput
              id="citizen-med-search"
              placeholder={t.searchMedicinesPlaceholder}
              value={medSearch}
              onChange={(e) => setMedSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white/70 hover:bg-white dark:bg-[#161922]/80 dark:hover:bg-[#1A1E29] text-slate-800 dark:text-slate-200 border border-slate-300/70 dark:border-white/10'
              }`}
            >
              {cat === 'ALL' ? (locale === 'en' ? 'All Categories' : 'Lahat ng Gamot') : cat}
            </button>
          ))}
        </div>

        {/* Medicine Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((med) => {
            const isDepletedOrLow = med.status === 'Out of Stock' || med.status === 'Low Stock';
            const alternateCenters = isDepletedOrLow
              ? nearbyBarangays.filter((b) =>
                  b.availableMedicines.some(
                    (am) => am.genericName === med.genericName && am.availableQty > 0
                  )
                )
              : [];

            return (
              <GlassCard key={med.id} className="p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-cyan-300">
                      {med.category}
                    </span>
                    <Badge
                      tone={getMedicineBadgeTone(med.status)}
                      pulse={med.status === 'Out of Stock'}
                    >
                      {med.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {med.genericName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {med.brandName} • {med.dosage}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {locale === 'en' ? 'Available Counter Stock:' : 'Bilang ng Stak:'}
                    </span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {med.stock} {med.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        med.status === 'Out of Stock'
                          ? 'bg-rose-600 w-0'
                          : med.status === 'Low Stock'
                          ? 'bg-amber-500'
                          : med.status === 'Near-Expiry'
                          ? 'bg-orange-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((med.stock / med.maxCapacity) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Nearby Barangay Alternative Suggestion when Low or Out of Stock */}
                {alternateCenters.length > 0 ? (
                  <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-500/30 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950 dark:text-amber-200">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {locale === 'en'
                          ? 'Available at Nearby Barangay RHU:'
                          : 'May Stak sa Karatig-Barangay:'}
                      </span>
                    </div>
                    {alternateCenters.map((center) => {
                      const match = center.availableMedicines.find(
                        (m) => m.genericName === med.genericName
                      );
                      return (
                        <div
                          key={center.barangayId}
                          className="text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2"
                        >
                          <span className="font-semibold truncate">
                            {center.barangayName} ({center.distanceKm} km)
                          </span>
                          <span className="font-black text-emerald-800 dark:text-emerald-300 shrink-0">
                            {match?.availableQty} avail
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300">
                    <span>Batch: {med.batchNo}</span>
                    <span>Exp: {med.expirationDate}</span>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* Section 3: Physician Duty Schedule (Available Today + Weekly Matrix) */}
      <section aria-labelledby="schedule-heading" className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-600/15 dark:bg-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2
              id="schedule-heading"
              className="text-lg font-extrabold text-slate-900 dark:text-white"
            >
              {t.physicianSchedule}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {locale === 'en'
                ? 'Live consultation queue and weekly duty roster for Barangay 101 Health Center'
                : 'Sino ang naka-duty ngayong araw at lingguhang iskedyul ng konsultasyon'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Available Today Sidebar Panel */}
          <div className="lg:col-span-4 space-y-3">
            <GlassCard variant="elevated" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {t.availableToday}
                </h3>
                <Badge tone="emerald" pulse>
                  Sat • Nov 7
                </Badge>
              </div>

              {availableTodayShifts.length === 0 ? (
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  No active shifts right now.
                </p>
              ) : (
                <div className="space-y-3">
                  {availableTodayShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#12151C]/90 border border-indigo-200/80 dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {shift.doctorName}
                          </div>
                          <div className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                            {shift.specialty}
                          </div>
                        </div>
                        <Badge tone="emerald">{shift.status}</Badge>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                          <span>{shift.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                          <span>{shift.room}</span>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300">
                          {locale === 'en' ? 'Walk-in Queue Capacity:' : 'Bilang ng Pasyente:'}
                        </span>
                        <span className="text-emerald-800 dark:text-emerald-300">
                          {shift.bookedSlots} / {shift.maxSlots} slots
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Weekly Schedule Grid */}
          <div className="lg:col-span-8 space-y-3">
            <GlassCard className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {locale === 'en'
                    ? 'Weekly Consultation Roster (Nov 2 – Nov 8, 2026)'
                    : 'Lingguhang Talaan ng Duty (Nob 2 – Nob 8, 2026)'}
                </h3>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedDayFilter('ALL')}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                      selectedDayFilter === 'ALL'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    All Days
                  </button>
                  {DAYS_ORDER.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDayFilter(d)}
                      className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                        selectedDayFilter === d
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-2xl bg-white/75 dark:bg-[#12151C]/80 border border-slate-200/90 dark:border-white/10 flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-[11px] font-extrabold mb-1">
                          {shift.day} • {shift.dateISO}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {shift.doctorName}
                        </h4>
                        <p className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                          {shift.specialty}
                        </p>
                      </div>
                      <Badge
                        tone={
                          shift.status === 'Active'
                            ? 'emerald'
                            : shift.status === 'On Leave'
                            ? 'rose'
                            : shift.status === 'Scheduled'
                            ? 'indigo'
                            : 'slate'
                        }
                      >
                        {shift.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>Time:</strong> {shift.timeSlot}
                      </div>
                      <div>
                        <strong>Room:</strong> {shift.room}
                      </div>
                      {shift.leaveReason && (
                        <div className="p-2 rounded-lg bg-rose-100/80 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold">
                          Note: {shift.leaveReason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Barangay Announcement Modal with Bilingual Tagalog/English Copy */}
      <Modal
        isOpen={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        title={
          selectedAnnouncement
            ? locale === 'en'
              ? selectedAnnouncement.titleEn
              : selectedAnnouncement.titleTl
            : ''
        }
        subtitle={
          selectedAnnouncement
            ? `${selectedAnnouncement.dateLabel} • ${selectedAnnouncement.timeLabel}`
            : ''
        }
      >
        {selectedAnnouncement && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge tone="indigo">{selectedAnnouncement.category}</Badge>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedAnnouncement.venue}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                {locale === 'en' ? 'Program Details (English & Filipino)' : 'Detalye ng Programa'}
              </div>
              <p className="text-slate-900 dark:text-slate-100 leading-relaxed">
                {selectedAnnouncement.detailsTl}
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1 border-t border-indigo-200/60 dark:border-white/10">
                {selectedAnnouncement.detailsEn}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {locale === 'en'
                  ? 'What to Bring (Mga Kailangan Dalhin):'
                  : 'Mga Kailangang Dalhin sa Araw ng Programa:'}
              </h4>
              <ul className="space-y-1.5">
                {selectedAnnouncement.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 flex justify-end">
              <GlassButton variant="primary" onClick={() => setSelectedAnnouncement(null)}>
                {locale === 'en' ? 'Got It, Close Advisory' : 'Naintindihan, Isara'}
              </GlassButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ==========================================
// MODULE: app/citizen/ambulance/page.tsx
// ==========================================
interface PublicAmbulancePageProps {
  onBack?: () => void;
}

function getUnitTone(status: UnitStatus): BadgeTone {
  switch (status) {
    case 'Standby':
      return 'emerald';
    case 'En Route':
    case 'On Scene':
      return 'amber';
    case 'Returning':
      return 'cyan';
    case 'Off Duty':
      return 'slate';
  }
}

function PublicAmbulanceTrackerPage({ onBack }: PublicAmbulancePageProps) {
  const { locale, t } = useSettings();
  const { ambulanceUnits, sendTestSmsNotification } = useApp();
  const [selectedUnitId, setSelectedUnitId] = useState<string>(ambulanceUnits[0]?.id || 'unit-a01');
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [callerLocation, setCallerLocation] = useState('');
  const [emergencySubmitted, setEmergencySubmitted] = useState(false);

  const selectedUnit =
    ambulanceUnits.find((u) => u.id === selectedUnitId) || ambulanceUnits[0];

  const handleCitizenCallbackRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName.trim() || !callerPhone.trim() || !callerLocation.trim()) return;
    sendTestSmsNotification(
      `Brgy. 101 Triage Desk (${callerPhone})`,
      `[CITIZEN SOS CALLBACK] Resident ${callerName} at ${callerLocation} requested immediate dispatcher callback.`,
      'Dispatch'
    );
    setEmergencySubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <GlassButton
              variant="glass"
              size="sm"
              onClick={onBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              {locale === 'en' ? 'Back to Portal' : 'Bumalik'}
            </GlassButton>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.liveAmbulanceTracker}
            </h1>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {locale === 'en'
                ? 'Public GPS Telemetry & Dispatch Transparency for Barangay 101 Residents (Patient privacy protected)'
                : 'Live GPS lokasyon at estado ng mga Barangay 101 Rescue Ambulance'}
            </p>
          </div>
        </div>
        <Badge tone="rose" pulse>
          {t.emergencyHotline}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Public Telemetry Map */}
        <div className="lg:col-span-7">
          <GlassCard variant="elevated" className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Parañaque District 1 — Barangay 101 Live Corridor Map
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                GPS Refresh: Live (3s)
              </span>
            </div>

            {/* Dynamic SVG Telemetry Map Container */}
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#12151C] border border-white/15">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full opacity-90"
              >
                {/* Subtle Grid Lines */}
                <defs>
                  <pattern id="publicGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.12)"
                      strokeWidth="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#publicGrid)" />

                {/* Coastal / Waterway & Major Parañaque Arterial Roads */}
                <path
                  d="M 0 15 Q 25 35, 18 100 L 0 100 Z"
                  fill="rgba(6, 182, 212, 0.14)"
                />
                {/* Quirino Ave Arterial */}
                <path
                  d="M 28 5 L 36 95"
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth="2.2"
                  fill="none"
                />
                {/* Dr. A. Santos Ave (Sucat Rd) */}
                <path
                  d="M 32 60 Q 60 45, 95 25"
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth="2.4"
                  fill="none"
                />
                {/* Active Dispatch Route Line for En Route Unit */}
                {ambulanceUnits
                  .filter((u) => u.status === 'En Route')
                  .map((u) => (
                    <path
                      key={`route-${u.id}`}
                      d={`M 34 52 L ${u.coordinates.x} ${u.coordinates.y} L 78 24`}
                      stroke="#F59E0B"
                      strokeWidth="1.2"
                      strokeDasharray="2 1.5"
                      fill="none"
                    />
                  ))}
              </svg>

              {/* Fixed Landmark Labels */}
              <div
                style={{ left: '34%', top: '52%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="px-2 py-0.5 rounded bg-indigo-950/90 border border-indigo-400/50 text-[10px] font-bold text-indigo-200 whitespace-nowrap">
                  Brgy. 101 Health Center HQ
                </div>
              </div>

              <div
                style={{ left: '78%', top: '24%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="px-2 py-0.5 rounded bg-rose-950/90 border border-rose-400/50 text-[10px] font-bold text-rose-200 whitespace-nowrap">
                  Ospital ng Parañaque (OSPAR 1)
                </div>
              </div>

              {/* Interactive Ambulance Unit Pins */}
              {ambulanceUnits.map((unit) => {
                const isSelected = unit.id === selectedUnit.id;
                const pinColor =
                  unit.status === 'Standby'
                    ? 'bg-emerald-500 border-emerald-200 text-slate-950'
                    : unit.status === 'En Route'
                    ? 'bg-amber-500 border-amber-200 text-slate-950'
                    : 'bg-slate-600 border-slate-300 text-white';

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnitId(unit.id)}
                    style={{
                      left: `${unit.coordinates.x}%`,
                      top: `${unit.coordinates.y}%`,
                    }}
                    aria-label={`Select ${unit.callsign}`}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-2.5 py-1 rounded-2xl border-2 shadow-lg flex items-center gap-1.5 text-xs font-extrabold transition-transform ${pinColor} ${
                      isSelected ? 'scale-110 ring-4 ring-white/40 z-20' : 'opacity-90 z-10'
                    }`}
                  >
                    <Ambulance className="w-4 h-4 shrink-0" />
                    <span>{unit.callsign.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Unit Public Summary */}
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#12151C]/90 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {selectedUnit.callsign}
                  </span>
                  <Badge
                    tone={getUnitTone(selectedUnit.status)}
                    pulse={selectedUnit.status === 'En Route'}
                  >
                    {selectedUnit.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Location:</strong> {selectedUnit.currentLocation}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Destination:</strong> {selectedUnit.destination}
                </p>
              </div>
              {selectedUnit.etaMinutes !== null && (
                <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center">
                  <div className="text-[11px] font-bold uppercase text-amber-900 dark:text-amber-200">
                    Estimated Arrival
                  </div>
                  <div className="text-lg font-black text-amber-950 dark:text-amber-100">
                    {selectedUnit.etaMinutes} mins
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Fleet Cards + Citizen Emergency Callback Form */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {locale === 'en' ? 'Barangay 101 Ambulance Fleet' : 'Mga Ambulansya ng Barangay 101'}
            </h2>
            <div className="space-y-2.5">
              {ambulanceUnits.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => setSelectedUnitId(unit.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    unit.id === selectedUnit.id
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500'
                      : 'bg-white/70 dark:bg-[#12151C]/70 border-slate-200/80 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {unit.callsign}
                    </span>
                    <Badge tone={getUnitTone(unit.status)} pulse={unit.status === 'En Route'}>
                      {unit.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                    Plate: <strong>{unit.plateNumber}</strong> • Medic: {unit.medicLead}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-indigo-700 dark:text-cyan-300">
                    {unit.currentLocation}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Citizen Emergency Dispatch Request Callback */}
          <GlassCard variant="elevated" className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h2 className="text-base font-extrabold">
                {locale === 'en'
                  ? 'Request Emergency Triage Callback'
                  : 'Humiling ng Agarang Tawag mula sa Rescue Desk'}
              </h2>
            </div>

            {emergencySubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-400 text-xs space-y-2">
                <div className="font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {locale === 'en'
                      ? 'SOS Alert Transmitted to Brgy. 101 Radio Console!'
                      : 'Naipadala na ang SOS Alert sa Brgy. 101 Radio Console!'}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200">
                  Dispatcher Nurse Elena Santos has received your coordinates ({callerLocation}) and
                  is calling <strong>{callerPhone}</strong> now.
                </p>
                <GlassButton
                  size="sm"
                  variant="glass"
                  onClick={() => {
                    setEmergencySubmitted(false);
                    setCallerName('');
                    setCallerPhone('');
                    setCallerLocation('');
                  }}
                >
                  Send Another Update
                </GlassButton>
              </div>
            ) : (
              <form onSubmit={handleCitizenCallbackRequest} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder={
                    locale === 'en' ? 'Your Full Name (Pangalan)' : 'Iyong Buong Pangalan'
                  }
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-white/90 dark:bg-[#12151C] border border-slate-300 dark:border-white/20 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="tel"
                  required
                  placeholder={
                    locale === 'en'
                      ? 'Mobile Number (e.g., 0917-xxx-xxxx)'
                      : 'Numero ng Cellphone (0917-xxx-xxxx)'
                  }
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-white/90 dark:bg-[#12151C] border border-slate-300 dark:border-white/20 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder={
                    locale === 'en'
                      ? 'Exact House No., Street & Purok in Brgy. 101'
                      : 'Eksaktong Bahay, Kalye at Purok sa Brgy. 101'
                  }
                  value={callerLocation}
                  onChange={(e) => setCallerLocation(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-white/90 dark:bg-[#12151C] border border-slate-300 dark:border-white/20 px-3.5 py-2 text-sm text-slate-900 dark:text-white"
                />
                <GlassButton
                  type="submit"
                  variant="danger"
                  fullWidth
                  icon={<PhoneCall className="w-4 h-4" />}
                >
                  {locale === 'en'
                    ? 'Alert Barangay 101 Rescue Dispatcher'
                    : 'I-alerto ang Barangay 101 Rescue'}
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/layout.tsx
// ==========================================
function AdminLayout({ children }: { children: ReactNode }) {
  const { userProfile } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-indigo-950/90 dark:bg-[#161922] text-indigo-100 border border-indigo-400/30 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-bold">
            Active Command Session: {userProfile.fullName} ({userProfile.position})
          </span>
        </div>
        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>{userProfile.barangayAssignment}</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/page.tsx
// ==========================================
interface AdminOverviewProps {
  onNavigate?: (route: ActiveRoute) => void;
}

function AdminOverviewPage({ onNavigate }: AdminOverviewProps) {
  const { medicines, ambulanceUnits, shifts, requisitions, smsLogs } = useApp();

  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock').length;
  const nearExpiryCount = medicines.filter((m) => m.status === 'Near-Expiry').length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock').length;
  const activeShiftsToday = shifts.filter((s) => s.day === 'Sat' && s.status === 'Active');
  const enRouteUnits = ambulanceUnits.filter((u) => u.status === 'En Route');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Barangay 101 Operations Command Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Unified monitoring across Medicine Inventory, Ambulance Dispatch, and Physician Duty Roster
          </p>
        </div>
        <Badge tone="emerald" pulse>
          DOH-NCR Sync Active • Nov 7, 2026
        </Badge>
      </div>

      {/* Top 4 Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard
          variant="interactive"
          onClick={() => onNavigate && onNavigate('admin-inventory')}
          className="p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Inventory Alerts
            </span>
            <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {lowStockCount + nearExpiryCount + outOfStockCount} Action Items
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            {lowStockCount} Low • {nearExpiryCount} Near-Expiry • {outOfStockCount} Out of Stock
          </p>
        </GlassCard>

        <GlassCard
          variant="interactive"
          onClick={() => onNavigate && onNavigate('admin-dispatch')}
          className="p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 dark:text-cyan-300">
              Ambulance Fleet
            </span>
            <Ambulance className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {enRouteUnits.length} En Route / {ambulanceUnits.length} Units
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Unit A#01 Standby • Unit A#02 En Route (ETA 6m)
          </p>
        </GlassCard>

        <GlassCard
          variant="interactive"
          onClick={() => onNavigate && onNavigate('admin-schedule')}
          className="p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Physicians On Duty
            </span>
            <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeShiftsToday.length} Active Clinicians
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Gen Med, OB-GYN & Immunization Hub Open
          </p>
        </GlassCard>

        <GlassCard
          variant="interactive"
          onClick={() => onNavigate && onNavigate('admin-inventory')}
          className="p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-violet-800 dark:text-violet-300">
              Cross-Barangay Transfers
            </span>
            <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {requisitions.length} Active Requests
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Parañaque District 1 RHU Buffer Sharing
          </p>
        </GlassCard>
      </div>

      {/* Quick Action Modules & Recent SMS Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Priority Health Center Action Queue
              </h2>
              <Badge tone="indigo">Live Console</Badge>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="rose" pulse>
                      Out of Stock [1/20]
                    </Badge>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Salbutamol Sulfate 2.5mg/2.5mL Nebule
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    0 nebules on Rack D-2. 180 units available at Barangay Baclaran Health Center (1.4 km).
                  </p>
                </div>
                {onNavigate && (
                  <GlassButton
                    size="sm"
                    variant="danger"
                    onClick={() => onNavigate('admin-inventory')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Requisition Stock
                  </GlassButton>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="amber" pulse>
                      Active Dispatch
                    </Badge>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Unit A#02 En Route to Ospital ng Parañaque
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    Level 1 Critical — 68/M Hypertensive Crisis. ETA: 6 mins via Quirino Ave.
                  </p>
                </div>
                {onNavigate && (
                  <GlassButton
                    size="sm"
                    variant="amber"
                    onClick={() => onNavigate('admin-dispatch')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Map Console
                  </GlassButton>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent SMS Gateway Feed */}
        <div className="lg:col-span-5">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Recent Automated SMS Dispatches
                </h2>
              </div>
              <Badge tone="emerald">Gateway Online</Badge>
            </div>

            <div className="space-y-2.5">
              {smsLogs.slice(0, 3).map((sms) => (
                <div
                  key={sms.id}
                  className="p-3 rounded-xl bg-white/80 dark:bg-[#12151C]/90 border border-slate-200/80 dark:border-white/10 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-cyan-300">
                    <span>{sms.recipient}</span>
                    <span>{sms.timestamp}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{sms.message}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/dispatch/page.tsx
// ==========================================
function getUnitStatusTone(status: UnitStatus): BadgeTone {
  switch (status) {
    case 'Standby':
      return 'emerald';
    case 'En Route':
    case 'On Scene':
      return 'amber';
    case 'Returning':
      return 'cyan';
    case 'Off Duty':
      return 'slate';
  }
}

function AdminDispatchConsolePage() {
  const {
    ambulanceUnits,
    dispatchAmbulanceUnit,
    completeAmbulanceMission,
    toggleUnitOffDuty,
  } = useApp();

  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    ambulanceUnits[1]?.id || ambulanceUnits[0]?.id || 'unit-a01'
  );
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Dispatch Form State
  const [callerName, setCallerName] = useState('Maricel Soriano-Cruz');
  const [callerPhone, setCallerPhone] = useState('0917-624-3319');
  const [pickupAddress, setPickupAddress] = useState(
    'Blk 9 Lot 4, Mabini St., Purok 3, Barangay 101'
  );
  const [receivingHospital, setReceivingHospital] = useState(
    'Ospital ng Parañaque (OSPAR District 1)'
  );
  const [triagePriority, setTriagePriority] = useState<TriagePriority>(
    'Level 1 - Critical (Red)'
  );
  const [patientSummary, setPatientSummary] = useState(
    '54/F Acute Respiratory Distress & Severe Bronchospasm (SpO2 88%)'
  );
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(7);

  const selectedUnit =
    ambulanceUnits.find((u) => u.id === selectedUnitId) || ambulanceUnits[0];

  const handleOpenDispatchModal = (unitId: string) => {
    setSelectedUnitId(unitId);
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchAmbulanceUnit({
      unitId: selectedUnit.id,
      callerName,
      callerPhone,
      pickupAddress,
      receivingHospital,
      triagePriority,
      patientSummary,
      estimatedMinutes: Number(estimatedMinutes) || 8,
    });
    setIsDispatchModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Interactive Ambulance Dispatch & Telemetry Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Real-time GPS unit assignment, caller triage priority, ETA tracking, and VHF/SMS dispatch
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton
            variant="primary"
            onClick={() => {
              const standby = ambulanceUnits.find((u) => u.status === 'Standby');
              handleOpenDispatchModal(standby ? standby.id : selectedUnit.id);
            }}
            icon={<Send className="w-4 h-4" />}
          >
            Dispatch Selected Unit
          </GlassButton>
        </div>
      </div>

      {/* Main Split Console: Left Interactive Map (7 cols), Right Unit Roster & Active Incident (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Map Container & Active Telemetry Panel */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard variant="elevated" className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Barangay 101 — Parañaque Emergency Corridor Telemetry
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Standby
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> En Route
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Off Duty
                </span>
              </div>
            </div>

            {/* Interactive SVG Map Viewport */}
            <div className="relative w-full h-80 sm:h-[380px] rounded-2xl overflow-hidden bg-[#0F131D] border border-white/15 shadow-inner">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <defs>
                  <pattern id="adminMapGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path
                      d="M 8 0 L 0 0 0 8"
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.1)"
                      strokeWidth="0.25"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#adminMapGrid)" />

                {/* Manila Bay / Parañaque River Estuary */}
                <path
                  d="M 0 10 Q 22 40, 16 100 L 0 100 Z"
                  fill="rgba(6, 182, 212, 0.16)"
                />
                <path
                  d="M 16 55 Q 48 52, 100 68"
                  stroke="rgba(6, 182, 212, 0.25)"
                  strokeWidth="3.5"
                  fill="none"
                />

                {/* Major Roads: Quirino Ave, Roxas Blvd, Dr. A. Santos Ave */}
                <path
                  d="M 18 0 L 24 100"
                  stroke="rgba(148, 163, 184, 0.28)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  d="M 30 0 L 38 100"
                  stroke="rgba(255, 255, 255, 0.24)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M 34 52 Q 56 40, 82 22"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="2.2"
                  fill="none"
                />

                {/* Active Route Vector for En Route Units */}
                {ambulanceUnits
                  .filter((u) => u.status === 'En Route')
                  .map((u) => (
                    <g key={`vec-${u.id}`}>
                      <path
                        d={`M 34 52 L ${u.coordinates.x} ${u.coordinates.y} L 82 22`}
                        stroke="#F59E0B"
                        strokeWidth="1.4"
                        strokeDasharray="2.2 1.2"
                        fill="none"
                      />
                      <circle cx="82" cy="22" r="2.2" fill="#F43F5E" />
                    </g>
                  ))}
              </svg>

              {/* Map Landmarks */}
              <div
                style={{ left: '34%', top: '52%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="px-2 py-0.5 rounded bg-indigo-950/90 border border-indigo-400/60 text-[10px] font-extrabold text-indigo-200 shadow">
                  HQ: Brgy. 101 Health Station
                </div>
              </div>

              <div
                style={{ left: '82%', top: '22%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="px-2 py-0.5 rounded bg-rose-950/90 border border-rose-400/60 text-[10px] font-extrabold text-rose-200 shadow">
                  ER: Ospital ng Parañaque (OSPAR 1)
                </div>
              </div>

              {/* Unit Markers */}
              {ambulanceUnits.map((unit) => {
                const isSelected = unit.id === selectedUnit.id;
                const badgeStyle =
                  unit.status === 'Standby'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-200'
                    : unit.status === 'En Route'
                    ? 'bg-amber-500 text-slate-950 border-amber-100'
                    : 'bg-slate-600 text-white border-slate-400';

                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnitId(unit.id)}
                    style={{
                      left: `${unit.coordinates.x}%`,
                      top: `${unit.coordinates.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 min-h-[44px] px-3 py-1.5 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 shadow-xl transition-all ${badgeStyle} ${
                      isSelected ? 'scale-110 ring-4 ring-cyan-400/50 z-20' : 'opacity-90 z-10'
                    }`}
                  >
                    <Ambulance className="w-4 h-4 shrink-0" />
                    <span>{unit.callsign.split(' ')[1]}</span>
                    {unit.etaMinutes !== null && (
                      <span className="ml-1 px-1.5 py-0.2 rounded bg-black/25 text-[10px]">
                        {unit.etaMinutes}m
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Telemetry Coordinates Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-[11px] text-slate-200">
                <div>
                  <strong>Selected:</strong> {selectedUnit.callsign} ({selectedUnit.plateNumber})
                </div>
                <div>
                  <strong>GPS:</strong> {selectedUnit.coordinates.lat.toFixed(4)}° N,{' '}
                  {selectedUnit.coordinates.lng.toFixed(4)}° E
                </div>
                <div>
                  <strong>Fuel:</strong> {selectedUnit.fuelPercent}% • <strong>O2 Tank:</strong>{' '}
                  {selectedUnit.oxygenPsi} PSI
                </div>
              </div>
            </div>

            {/* Active Incident Telemetry Detail Box */}
            {selectedUnit.activeIncident ? (
              <div className="p-4 rounded-2xl bg-amber-50/95 dark:bg-amber-950/40 border border-amber-400/80 dark:border-amber-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge tone="rose" pulse>
                      {selectedUnit.activeIncident.triagePriority}
                    </Badge>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-amber-100">
                      Incident #{selectedUnit.activeIncident.incidentId} • Dispatched{' '}
                      {selectedUnit.activeIncident.dispatchedAt}
                    </span>
                  </div>
                  <span className="text-sm font-black text-amber-950 dark:text-amber-200">
                    ETA: {selectedUnit.etaMinutes} mins
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Caller:</strong> {selectedUnit.activeIncident.callerName}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Caller Contact:</strong> {selectedUnit.activeIncident.callerPhone}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Pickup Point:</strong> {selectedUnit.activeIncident.pickupAddress}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Chief Complaint:</strong> {selectedUnit.activeIncident.patientSummary}
                    </div>
                    <div className="text-slate-700 dark:text-slate-300">
                      <strong>Receiving Facility:</strong>{' '}
                      {selectedUnit.activeIncident.receivingHospital}
                    </div>
                  </div>
                </div>

                {/* Route Waypoints */}
                <div className="pt-2 border-t border-amber-300/60 dark:border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-amber-950 dark:text-amber-200">
                    {selectedUnit.activeIncident.routeWaypoints.map((wp, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1">
                        <span>{wp}</span>
                        {idx < selectedUnit.activeIncident!.routeWaypoints.length - 1 && (
                          <span>→</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <GlassButton
                    size="sm"
                    variant="emerald"
                    onClick={() => completeAmbulanceMission(selectedUnit.id)}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Mark Handover Complete & Return to Standby
                  </GlassButton>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#12151C]/90 border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    {selectedUnit.callsign} — {selectedUnit.status}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {selectedUnit.currentLocation} • Crew: {selectedUnit.driverName} &{' '}
                    {selectedUnit.medicLead}
                  </div>
                </div>
                {selectedUnit.status === 'Standby' && (
                  <GlassButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenDispatchModal(selectedUnit.id)}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Assign Emergency Run
                  </GlassButton>
                )}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: Dynamic Dispatch Unit Roster */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Dispatch Fleet Units (3 Active)
              </h2>
              <span className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                VHF Ch. 4 Active
              </span>
            </div>

            <div className="space-y-3">
              {ambulanceUnits.map((unit) => {
                const isSelected = unit.id === selectedUnit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-white/75 dark:bg-[#12151C]/80 border-slate-200/80 dark:border-white/10 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {unit.callsign}
                        </div>
                        <div className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                          Plate: {unit.plateNumber} • {unit.contactRadio}
                        </div>
                      </div>
                      <Badge
                        tone={getUnitStatusTone(unit.status)}
                        pulse={unit.status === 'En Route'}
                      >
                        {unit.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>Driver:</strong> {unit.driverName}
                      </div>
                      <div>
                        <strong>Medic Lead:</strong> {unit.medicLead}
                      </div>
                      <div>
                        <strong>Position:</strong> {unit.currentLocation}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                      {unit.status === 'Standby' && (
                        <GlassButton
                          size="sm"
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDispatchModal(unit.id);
                          }}
                          icon={<Send className="w-3.5 h-3.5" />}
                        >
                          Dispatch Unit
                        </GlassButton>
                      )}
                      {unit.status === 'En Route' && (
                        <GlassButton
                          size="sm"
                          variant="emerald"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeAmbulanceMission(unit.id);
                          }}
                          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Complete Run
                        </GlassButton>
                      )}
                      {unit.status !== 'En Route' && (
                        <GlassButton
                          size="sm"
                          variant="glass"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUnitOffDuty(unit.id);
                          }}
                          icon={<Power className="w-3.5 h-3.5" />}
                        >
                          {unit.status === 'Off Duty' ? 'Set Standby' : 'Set Off-Duty'}
                        </GlassButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal: Dispatch Selected Unit */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title={`Dispatch ${selectedUnit.callsign}`}
        subtitle="Transmit immediate emergency coordinates, triage level, and SMS confirmation to caller"
      >
        <form onSubmit={handleConfirmDispatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassSelect
              id="dispatch-unit-select"
              label="Assigned Ambulance Unit"
              value={selectedUnit.id}
              onChange={(e) => setSelectedUnitId(e.target.value)}
            >
              {ambulanceUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.callsign} ({u.status})
                </option>
              ))}
            </GlassSelect>

            <GlassSelect
              id="dispatch-triage-select"
              label="Triage Priority Level"
              value={triagePriority}
              onChange={(e) => setTriagePriority(e.target.value as TriagePriority)}
            >
              <option value="Level 1 - Critical (Red)">Level 1 - Critical (Red)</option>
              <option value="Level 2 - Emergent (Orange)">Level 2 - Emergent (Orange)</option>
              <option value="Level 3 - Urgent (Yellow)">Level 3 - Urgent (Yellow)</option>
            </GlassSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              id="dispatch-caller-name"
              label="Caller / Informant Name"
              required
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
            />
            <GlassInput
              id="dispatch-caller-phone"
              label="Caller Mobile Number (SMS Target)"
              required
              value={callerPhone}
              onChange={(e) => setCallerPhone(e.target.value)}
            />
          </div>

          <GlassInput
            id="dispatch-pickup-address"
            label="Pickup Location (House No., Street, Purok)"
            required
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <GlassSelect
                id="dispatch-hospital"
                label="Receiving Hospital Destination"
                value={receivingHospital}
                onChange={(e) => setReceivingHospital(e.target.value)}
              >
                <option value="Ospital ng Parañaque (OSPAR District 1)">
                  Ospital ng Parañaque (OSPAR District 1)
                </option>
                <option value="Philippine General Hospital (PGH) - Taft">
                  Philippine General Hospital (PGH) - Taft
                </option>
                <option value="Las Piñas General Hospital & Satellite Trauma Center">
                  Las Piñas General Hospital & Trauma Center
                </option>
                <option value="San Juan de Dios Educational Foundation Hospital">
                  San Juan de Dios Hospital (Pasay)
                </option>
              </GlassSelect>
            </div>
            <GlassInput
              id="dispatch-eta"
              type="number"
              min={2}
              max={60}
              label="Est. ETA (Mins)"
              required
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            />
          </div>

          <GlassTextarea
            id="dispatch-patient-summary"
            rows={2}
            label="Patient Chief Complaint & Vital Signs"
            required
            value={patientSummary}
            onChange={(e) => setPatientSummary(e.target.value)}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setIsDispatchModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              icon={<Send className="w-4 h-4" />}
            >
              Confirm & Dispatch Selected Unit
            </GlassButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/inventory/page.tsx
// ==========================================
function getStatusTone(status: MedicineStatus): BadgeTone {
  switch (status) {
    case 'In Stock':
      return 'emerald';
    case 'Low Stock':
      return 'amber';
    case 'Near-Expiry':
      return 'orange';
    case 'Out of Stock':
      return 'rose';
  }
}

function AdminInventoryPage() {
  const {
    medicines,
    nearbyBarangays,
    requisitions,
    restockMedicine,
    dispenseMedicine,
    fileCrossBarangayRequisition,
  } = useApp();

  // Interactive Metric Filter State ('ALL' | 'Low Stock' | 'Near-Expiry' | 'Out of Stock')
  const [statusFilter, setStatusFilter] = useState<'ALL' | MedicineStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Restock & Dispense Modal State
  const [activeBatchForRestock, setActiveBatchForRestock] = useState<MedicineBatch | null>(null);
  const [restockQty, setRestockQty] = useState<number>(100);
  const [restockBatchNo, setRestockBatchNo] = useState<string>('');
  const [restockExpiry, setRestockExpiry] = useState<string>('');

  const [activeBatchForDispense, setActiveBatchForDispense] = useState<MedicineBatch | null>(null);
  const [dispenseQty, setDispenseQty] = useState<number>(10);
  const [patientRecipient, setPatientRecipient] = useState<string>(
    'Lola Teresita Magbanua (Purok 2 Senior Citizen)'
  );

  // Nearby Barangay Requisition State
  const [selectedBarangayId, setSelectedBarangayId] = useState<string>(
    nearbyBarangays[0]?.barangayId || 'brgy-baclaran'
  );
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [reqMedicineName, setReqMedicineName] = useState<string>('Salbutamol Sulfate');
  const [reqDosage, setReqDosage] = useState<string>('2.5mg/2.5mL Resp. Solution');
  const [reqQty, setReqQty] = useState<number>(60);
  const [reqUrgency, setReqUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');
  const [reqNotes, setReqNotes] = useState<string>(
    'Buffer replenishment for Barangay 101 acute respiratory & hypertension counter.'
  );

  // Dynamic Counts for the Top 3 Metric Filter Cards (out of 20 formulary benchmark slots)
  const lowStockCount = medicines.filter((m) => m.status === 'Low Stock').length;
  const nearExpiryCount = medicines.filter((m) => m.status === 'Near-Expiry').length;
  const outOfStockCount = medicines.filter((m) => m.status === 'Out of Stock').length;

  const filteredBatches = useMemo(() => {
    return medicines.filter((m) => {
      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandName.toLowerCase().includes(q) ||
        m.batchNo.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [medicines, statusFilter, searchQuery]);

  const selectedNearbyBarangay =
    nearbyBarangays.find((b) => b.barangayId === selectedBarangayId) || nearbyBarangays[0];

  const toggleMetricFilter = (target: MedicineStatus) => {
    setStatusFilter((prev) => (prev === target ? 'ALL' : target));
  };

  const handleOpenRestock = (batch: MedicineBatch) => {
    setActiveBatchForRestock(batch);
    setRestockQty(100);
    setRestockBatchNo(batch.batchNo);
    setRestockExpiry(batch.expirationDate);
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatchForRestock) return;
    restockMedicine(
      activeBatchForRestock.id,
      Number(restockQty) || 50,
      restockBatchNo,
      restockExpiry
    );
    setActiveBatchForRestock(null);
  };

  const handleOpenDispense = (batch: MedicineBatch) => {
    setActiveBatchForDispense(batch);
    setDispenseQty(Math.min(15, Math.max(1, batch.stock)));
  };

  const handleConfirmDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatchForDispense) return;
    dispenseMedicine(activeBatchForDispense.id, Number(dispenseQty) || 1, patientRecipient);
    setActiveBatchForDispense(null);
  };

  const handleOpenRequisitionModal = (medName?: string, dosage?: string) => {
    const firstMed = selectedNearbyBarangay.availableMedicines[0];
    setReqMedicineName(medName || firstMed?.genericName || 'Salbutamol Sulfate');
    setReqDosage(dosage || firstMed?.dosage || '2.5mg/2.5mL Resp. Solution');
    setIsRequisitionModalOpen(true);
  };

  const handleConfirmRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    fileCrossBarangayRequisition({
      targetBarangayId: selectedNearbyBarangay.barangayId,
      medicineName: reqMedicineName,
      dosage: reqDosage,
      requestedQty: Number(reqQty) || 50,
      urgency: reqUrgency,
      notes: reqNotes,
    });
    setIsRequisitionModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Medicine Inventory & Cross-Barangay Requisition Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            Click any of the top 3 metric cards to dynamically filter batches by threshold status
          </p>
        </div>
        {statusFilter !== 'ALL' && (
          <GlassButton
            size="sm"
            variant="glass"
            onClick={() => setStatusFilter('ALL')}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset Filter (Showing: {statusFilter})
          </GlassButton>
        )}
      </div>

      {/* Top 3 Interactive Metric Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard
          variant="interactive"
          active={statusFilter === 'Low Stock'}
          onClick={() => toggleMetricFilter('Low Stock')}
          ariaLabel="Filter table by Low Stock"
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Low Stock Threshold
              </span>
              {statusFilter === 'Low Stock' && <Badge tone="amber">Active Filter</Badge>}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Low Stock [{lowStockCount}/20]
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Below minimum safety buffer — click to isolate rows
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard
          variant="interactive"
          active={statusFilter === 'Near-Expiry'}
          onClick={() => toggleMetricFilter('Near-Expiry')}
          ariaLabel="Filter table by Near-Expiry"
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800 dark:text-orange-300">
                FEFO Expiry Watch
              </span>
              {statusFilter === 'Near-Expiry' && <Badge tone="orange">Active Filter</Badge>}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Near-Expiry [{nearExpiryCount}/20]
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Expiring within 45 days (First-Expired, First-Out)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-700 dark:text-orange-300 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </GlassCard>

        <GlassCard
          variant="interactive"
          active={statusFilter === 'Out of Stock'}
          onClick={() => toggleMetricFilter('Out of Stock')}
          ariaLabel="Filter table by Out of Stock"
          className="p-5 flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                Critical Stockout
              </span>
              {statusFilter === 'Out of Stock' && <Badge tone="rose">Active Filter</Badge>}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Out of Stock [{outOfStockCount}/20]
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Zero counter balance — trigger inter-barangay request
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-700 dark:text-rose-300 shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid: Left Batch Ledger Table (8 cols), Right Nearby Barangays Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Searchable & Filterable Medicine Batch Table */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Barangay 101 Formulary Batch Ledger ({filteredBatches.length} items)
                </h2>
                {statusFilter !== 'ALL' && (
                  <Badge tone={getStatusTone(statusFilter)}>{statusFilter}</Badge>
                )}
              </div>

              <div className="w-full sm:w-72">
                <GlassInput
                  id="admin-inv-search"
                  placeholder="Search medicine, batch no., shelf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300/80 dark:border-white/15 text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <th className="py-3 px-3">Medicine & Dosage</th>
                    <th className="py-3 px-3">Batch No.</th>
                    <th className="py-3 px-3">Expiration</th>
                    <th className="py-3 px-3 text-right">Stock</th>
                    <th className="py-3 px-3 text-right">Min</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-white/10 text-xs">
                  {filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {batch.genericName}
                        </div>
                        <div className="text-slate-700 dark:text-slate-300">
                          {batch.brandName} • {batch.dosage}
                        </div>
                        <div className="text-[11px] text-indigo-700 dark:text-cyan-300 font-semibold">
                          {batch.shelfLocation}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {batch.batchNo}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {batch.expirationDate}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-sm text-slate-900 dark:text-white">
                        {batch.stock}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                        {batch.minimumStock}
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          tone={getStatusTone(batch.status)}
                          pulse={batch.status === 'Out of Stock'}
                        >
                          {batch.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <GlassButton
                            size="sm"
                            variant="emerald"
                            onClick={() => handleOpenRestock(batch)}
                            title="Restock / Add Stock"
                          >
                            + Restock
                          </GlassButton>
                          <GlassButton
                            size="sm"
                            variant="glass"
                            disabled={batch.stock <= 0}
                            onClick={() => handleOpenDispense(batch)}
                            title="Dispense to Patient"
                          >
                            Dispense
                          </GlassButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right: Nearby Barangays Stock-Sharing Sidebar & Requisition Log */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard variant="elevated" className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Nearby Barangays Buffer Stock
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Select a partner RHU in Parañaque to request emergency stock transfer
                </p>
              </div>
            </div>

            {/* Partner Barangay Selector List */}
            <div className="space-y-2.5">
              {nearbyBarangays.map((brgy) => {
                const isSelected = brgy.barangayId === selectedNearbyBarangay.barangayId;
                return (
                  <div
                    key={brgy.barangayId}
                    onClick={() => setSelectedBarangayId(brgy.barangayId)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/95 dark:bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-white/70 dark:bg-[#12151C]/80 border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                          {brgy.barangayName}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {brgy.contactPerson} • {brgy.contactPhone}
                        </div>
                      </div>
                      <Badge tone="cyan">{brgy.distanceKm} km</Badge>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/70 dark:border-white/10 space-y-1">
                      {brgy.availableMedicines.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-200"
                        >
                          <span className="truncate">
                            {m.genericName} ({m.dosage})
                          </span>
                          <span className="font-black text-emerald-700 dark:text-emerald-300 shrink-0">
                            {m.availableQty} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <GlassButton
              variant="primary"
              fullWidth
              onClick={() => handleOpenRequisitionModal()}
              icon={<Send className="w-4 h-4" />}
            >
              File Request from Selected Barangay
            </GlassButton>
          </GlassCard>

          {/* Active Cross-Barangay Requisitions History */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Filed Cross-Barangay Requisitions ({requisitions.length})
            </h3>
            <div className="space-y-2.5">
              {requisitions.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-white/80 dark:bg-[#12151C]/90 border border-slate-200/80 dark:border-white/10 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-indigo-700 dark:text-cyan-300">
                      {req.id}
                    </span>
                    <Badge tone={req.urgency === 'Emergency' ? 'rose' : 'amber'}>
                      {req.status}
                    </Badge>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {req.medicineName} — {req.requestedQty} units
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    From: {req.targetBarangayName} ({req.requestedAt})
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal 1: Restock Medicine Batch */}
      <Modal
        isOpen={Boolean(activeBatchForRestock)}
        onClose={() => setActiveBatchForRestock(null)}
        title={`Restock Batch: ${activeBatchForRestock?.genericName || ''}`}
        subtitle="Log incoming DOH / City Health Office supply delivery into Barangay 101 ledger"
      >
        <form onSubmit={handleConfirmRestock} className="space-y-4">
          <GlassInput
            id="restock-qty"
            type="number"
            min={1}
            max={2000}
            required
            label="Quantity to Add"
            value={restockQty}
            onChange={(e) => setRestockQty(Number(e.target.value))}
          />
          <GlassInput
            id="restock-batch-no"
            label="Lot / Batch Number"
            required
            value={restockBatchNo}
            onChange={(e) => setRestockBatchNo(e.target.value)}
          />
          <GlassInput
            id="restock-expiry"
            type="date"
            label="Batch Expiration Date"
            required
            value={restockExpiry}
            onChange={(e) => setRestockExpiry(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setActiveBatchForRestock(null)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="emerald">
              Confirm Restock Entry
            </GlassButton>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Dispense Medicine to Resident */}
      <Modal
        isOpen={Boolean(activeBatchForDispense)}
        onClose={() => setActiveBatchForDispense(null)}
        title={`Dispense Medicine: ${activeBatchForDispense?.genericName || ''}`}
        subtitle={`Current Available Stock: ${activeBatchForDispense?.stock || 0} ${
          activeBatchForDispense?.unit || 'units'
        }`}
      >
        <form onSubmit={handleConfirmDispense} className="space-y-4">
          <GlassInput
            id="dispense-patient"
            label="Resident Recipient Name & Purok"
            required
            value={patientRecipient}
            onChange={(e) => setPatientRecipient(e.target.value)}
          />
          <GlassInput
            id="dispense-qty"
            type="number"
            min={1}
            max={activeBatchForDispense?.stock || 1}
            required
            label="Quantity to Dispense"
            value={dispenseQty}
            onChange={(e) => setDispenseQty(Number(e.target.value))}
          />
          <div className="pt-2 flex justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setActiveBatchForDispense(null)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary">
              Record Dispense Transaction
            </GlassButton>
          </div>
        </form>
      </Modal>

      {/* Modal 3: File Cross-Barangay Stock Requisition */}
      <Modal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        title={`File Requisition from ${selectedNearbyBarangay.barangayName}`}
        subtitle={`Distance: ${selectedNearbyBarangay.distanceKm} km • Contact: ${selectedNearbyBarangay.contactPerson}`}
      >
        <form onSubmit={handleConfirmRequisition} className="space-y-4">
          <GlassSelect
            id="req-target-med"
            label="Select Available Medicine from Partner Barangay"
            value={reqMedicineName}
            onChange={(e) => {
              const found = selectedNearbyBarangay.availableMedicines.find(
                (m) => m.genericName === e.target.value
              );
              setReqMedicineName(e.target.value);
              if (found) setReqDosage(found.dosage);
            }}
          >
            {selectedNearbyBarangay.availableMedicines.map((m, idx) => (
              <option key={idx} value={m.genericName}>
                {m.genericName} ({m.dosage}) — {m.availableQty} available
              </option>
            ))}
          </GlassSelect>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              id="req-qty"
              type="number"
              min={5}
              max={500}
              required
              label="Requested Quantity"
              value={reqQty}
              onChange={(e) => setReqQty(Number(e.target.value))}
            />
            <GlassSelect
              id="req-urgency"
              label="Transfer Urgency Level"
              value={reqUrgency}
              onChange={(e) =>
                setReqUrgency(e.target.value as 'Routine' | 'Urgent' | 'Emergency')
              }
            >
              <option value="Routine">Routine (24h RHU Courier)</option>
              <option value="Urgent">Urgent (Same-Day Transfer)</option>
              <option value="Emergency">Emergency (Ambulance Utility Run)</option>
            </GlassSelect>
          </div>

          <GlassTextarea
            id="req-notes"
            rows={2}
            label="Clinical Justification & Receiving BHW Notes"
            value={reqNotes}
            onChange={(e) => setReqNotes(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setIsRequisitionModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" icon={<Send className="w-4 h-4" />}>
              Transmit Requisition & SMS Alert
            </GlassButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/schedule/page.tsx
// ==========================================
const DAYS_OF_WEEK: { day: DayOfWeek; label: string; dateISO: string }[] = [
  { day: 'Mon', label: 'Mon (Nov 2)', dateISO: '2026-11-02' },
  { day: 'Tue', label: 'Tue (Nov 3)', dateISO: '2026-11-03' },
  { day: 'Wed', label: 'Wed (Nov 4)', dateISO: '2026-11-04' },
  { day: 'Thu', label: 'Thu (Nov 5)', dateISO: '2026-11-05' },
  { day: 'Fri', label: 'Fri (Nov 6)', dateISO: '2026-11-06' },
  { day: 'Sat', label: 'Sat (Nov 7 • Today)', dateISO: '2026-11-07' },
  { day: 'Sun', label: 'Sun (Nov 8)', dateISO: '2026-11-08' },
];

function getShiftTone(status: ShiftStatus): BadgeTone {
  switch (status) {
    case 'Active':
      return 'emerald';
    case 'Scheduled':
      return 'indigo';
    case 'On Leave':
      return 'rose';
    case 'Completed':
      return 'slate';
  }
}

function AdminScheduleRosterPage() {
  const { shifts, addPhysicianShift, markPhysicianLeave, restorePhysicianShift } = useApp();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'ALL'>('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  // Add Shift Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState('Dr. Miguelito Villafuerte, MD');
  const [newLicenseNo, setNewLicenseNo] = useState('PRC #0142910');
  const [newSpecialty, setNewSpecialty] = useState<DoctorSpecialty>('General Medicine');
  const [newDay, setNewDay] = useState<DayOfWeek>('Sat');
  const [newTimeSlot, setNewTimeSlot] = useState('01:00 PM - 05:00 PM');
  const [newRoom, setNewRoom] = useState('Consultation Room 2');
  const [newMaxSlots, setNewMaxSlots] = useState<number>(25);

  // Mark Leave Modal State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveTargetShiftId, setLeaveTargetShiftId] = useState<string>(
    shifts.find((s) => s.status === 'Active')?.id || shifts[0]?.id || ''
  );
  const [leaveReason, setLeaveReason] = useState<string>(
    'Emergency Hospital Rounds at Ospital ng Parañaque — Reliever MD Assigned'
  );

  const availableTodayShifts = useMemo(
    () => shifts.filter((s) => s.day === 'Sat' && s.status === 'Active'),
    [shifts]
  );

  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      const matchDay = selectedDay === 'ALL' || s.day === selectedDay;
      const matchSpec = selectedSpecialty === 'ALL' || s.specialty === selectedSpecialty;
      return matchDay && matchSpec;
    });
  }, [shifts, selectedDay, selectedSpecialty]);

  const handleConfirmAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedDate =
      DAYS_OF_WEEK.find((d) => d.day === newDay)?.dateISO || '2026-11-07';
    addPhysicianShift({
      doctorId: `doc-${Date.now()}`,
      doctorName: newDoctorName,
      licenseNo: newLicenseNo,
      specialty: newSpecialty,
      day: newDay,
      dateISO: matchedDate,
      timeSlot: newTimeSlot,
      room: newRoom,
      status: newDay === 'Sat' ? 'Active' : 'Scheduled',
      bookedSlots: 0,
      maxSlots: Number(newMaxSlots) || 20,
    });
    setIsAddModalOpen(false);
  };

  const handleConfirmMarkLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveTargetShiftId) return;
    markPhysicianLeave(leaveTargetShiftId, leaveReason);
    setIsLeaveModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Physician, Dentist & Midwife Duty Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            7-day clinical shift matrix, consultation slot capacity tracking, and instant leave management
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <GlassButton
            variant="danger"
            onClick={() => {
              const firstActive = shifts.find((s) => s.status !== 'On Leave');
              if (firstActive) setLeaveTargetShiftId(firstActive.id);
              setIsLeaveModalOpen(true);
            }}
            icon={<UserX className="w-4 h-4" />}
          >
            Mark Leave
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Shift
          </GlassButton>
        </div>
      </div>

      {/* Main Layout: Left 4 Cols ("Available Today" live sync), Right 8 Cols (7-Day Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Available Today Active Clinicians Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard variant="elevated" className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Available Today (Sat • Nov 7)
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Live sync with Citizen Portal & Triage Queue
                </p>
              </div>
              <Badge tone="emerald" pulse>
                {availableTodayShifts.length} On Duty
              </Badge>
            </div>

            {availableTodayShifts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300">
                No clinicians currently marked Active for today. Add a Saturday shift or restore a leave.
              </div>
            ) : (
              <div className="space-y-3">
                {availableTodayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 rounded-2xl bg-white/85 dark:bg-[#12151C]/90 border border-indigo-200/80 dark:border-white/10 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">
                          {shift.doctorName}
                        </div>
                        <div className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                          {shift.specialty} • {shift.licenseNo}
                        </div>
                      </div>
                      <Badge tone="emerald">Active</Badge>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                        <span>{shift.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                        <span>{shift.room}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                        Slots: {shift.bookedSlots}/{shift.maxSlots}
                      </span>
                      <GlassButton
                        size="sm"
                        variant="glass"
                        onClick={() => {
                          setLeaveTargetShiftId(shift.id);
                          setIsLeaveModalOpen(true);
                        }}
                      >
                        Mark Leave
                      </GlassButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right: 7-Day Calendar Matrix & Shift Filter */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedDay('ALL')}
                  className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                    selectedDay === 'ALL'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  All 7 Days
                </button>
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setSelectedDay(d.day)}
                    className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-extrabold ${
                      selectedDay === d.day
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-56">
                <GlassSelect
                  id="roster-specialty-filter"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="ALL">All Specialties</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="OB-GYN & Maternal Care">OB-GYN & Maternal Care</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Community Dentistry">Community Dentistry</option>
                  <option value="Immunization & Midwifery">Immunization & Midwifery</option>
                </GlassSelect>
              </div>
            </div>

            {/* Shift Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-[#12151C]/85 border border-slate-200/90 dark:border-white/10 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200 text-xs font-extrabold">
                        {shift.day} • {shift.dateISO}
                      </span>
                      <Badge
                        tone={getShiftTone(shift.status)}
                        pulse={shift.status === 'Active'}
                      >
                        {shift.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {shift.doctorName}
                      </h3>
                      <p className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                        {shift.specialty} ({shift.licenseNo})
                      </p>
                    </div>

                    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <div>
                        <strong>Shift Window:</strong> {shift.timeSlot}
                      </div>
                      <div>
                        <strong>Assigned Room:</strong> {shift.room}
                      </div>
                      <div>
                        <strong>Booked Patient Capacity:</strong> {shift.bookedSlots} /{' '}
                        {shift.maxSlots} slots
                      </div>
                    </div>

                    {shift.leaveReason && (
                      <div className="p-2.5 rounded-xl bg-rose-100/90 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-xs font-semibold text-rose-950 dark:text-rose-200">
                        Leave Advisory: {shift.leaveReason}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-end gap-2">
                    {shift.status === 'On Leave' ? (
                      <GlassButton
                        size="sm"
                        variant="emerald"
                        onClick={() => restorePhysicianShift(shift.id)}
                        icon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Restore to Active Duty
                      </GlassButton>
                    ) : (
                      <GlassButton
                        size="sm"
                        variant="glass"
                        onClick={() => {
                          setLeaveTargetShiftId(shift.id);
                          setIsLeaveModalOpen(true);
                        }}
                        icon={<UserX className="w-3.5 h-3.5" />}
                      >
                        Mark Leave
                      </GlassButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modal 1: Add Physician Shift */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Clinician Duty Shift"
        subtitle="Schedule a new physician, dentist, or midwife duty slot into the Barangay 101 roster"
      >
        <form onSubmit={handleConfirmAddShift} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassInput
              id="add-doc-name"
              label="Clinician Full Name & Title"
              required
              value={newDoctorName}
              onChange={(e) => setNewDoctorName(e.target.value)}
            />
            <GlassInput
              id="add-doc-license"
              label="PRC License Number"
              required
              value={newLicenseNo}
              onChange={(e) => setNewLicenseNo(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <GlassSelect
              id="add-doc-specialty"
              label="Clinical Specialty"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value as DoctorSpecialty)}
            >
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="OB-GYN & Maternal Care">OB-GYN & Maternal Care</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Community Dentistry">Community Dentistry</option>
              <option value="Immunization & Midwifery">Immunization & Midwifery</option>
            </GlassSelect>

            <GlassSelect
              id="add-doc-day"
              label="Day of Week"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.day} value={d.day}>
                  {d.label}
                </option>
              ))}
            </GlassSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GlassInput
              id="add-doc-time"
              label="Time Slot Window"
              required
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
            />
            <GlassInput
              id="add-doc-room"
              label="Consultation Room"
              required
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <GlassInput
              id="add-doc-slots"
              type="number"
              min={5}
              max={100}
              label="Max Patient Quota"
              required
              value={newMaxSlots}
              onChange={(e) => setNewMaxSlots(Number(e.target.value))}
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" icon={<UserPlus className="w-4 h-4" />}>
              Publish Shift to Roster
            </GlassButton>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Mark Doctor Leave */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Mark Clinician On Leave"
        subtitle="Updates public Citizen Portal immediately and dispatches SMS advisory to queued patients"
      >
        <form onSubmit={handleConfirmMarkLeave} className="space-y-4">
          <GlassSelect
            id="leave-shift-select"
            label="Select Scheduled Shift"
            value={leaveTargetShiftId}
            onChange={(e) => setLeaveTargetShiftId(e.target.value)}
          >
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.day} ({s.dateISO}) — {s.doctorName} [{s.status}]
              </option>
            ))}
          </GlassSelect>

          <GlassTextarea
            id="leave-reason-input"
            rows={3}
            label="Reason for Leave & Reliever Instructions"
            required
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-3">
            <GlassButton variant="glass" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="danger" icon={<UserX className="w-4 h-4" />}>
              Confirm Leave & Notify Patients
            </GlassButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ==========================================
// MODULE: app/admin/settings/page.tsx
// ==========================================
type SettingsTab = 'Account' | 'Appearance' | 'Language' | 'Notification';

function AdminSettingsPage() {
  const { theme, setTheme, locale, setLocale, fontScale, setFontScale } = useSettings();
  const {
    userProfile,
    updateUserProfile,
    smsPreferences,
    toggleSmsPreference,
    smsLogs,
    sendTestSmsNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>('Account');

  // Account Form State
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [position, setPosition] = useState(userProfile.position);
  const [employeeId, setEmployeeId] = useState(userProfile.employeeId);
  const [mobile, setMobile] = useState(userProfile.mobile);
  const [email, setEmail] = useState(userProfile.email);
  const [prcLicense, setPrcLicense] = useState(userProfile.prcLicense);

  // SMS Test Trigger State
  const [testSmsPhone, setTestSmsPhone] = useState('+63 917 842 9910');
  const [testSmsMessage, setTestSmsMessage] = useState(
    '[ALAGA-101 TEST] Oplan Kalusugan Bakuna Hub is now open at Barangay 101 Covered Court until 4:00 PM.'
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      position,
      employeeId,
      mobile,
      email,
      prcLicense,
    });
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    sendTestSmsNotification(testSmsPhone, testSmsMessage, 'Public Advisory');
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'Account', label: 'Account Profile', icon: <User className="w-4 h-4" /> },
    { id: 'Appearance', label: 'Appearance & Font Scale', icon: <Palette className="w-4 h-4" /> },
    { id: 'Language', label: 'Language (i18n)', icon: <Languages className="w-4 h-4" /> },
    { id: 'Notification', label: 'SMS Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  const fontScaleOptions: {
    level: FontScaleLevel;
    title: string;
    pxLabel: string;
    desc: string;
  }[] = [
    {
      level: 'sm',
      title: 'Compact (87.5%)',
      pxLabel: FONT_SCALE_PX_MAP.sm,
      desc: 'High-density table view for wide desktop monitors',
    },
    {
      level: 'base',
      title: 'Standard Default (100%)',
      pxLabel: FONT_SCALE_PX_MAP.base,
      desc: 'Default WCAG 2.2 AA balanced typography',
    },
    {
      level: 'lg',
      title: 'Senior Citizen Comfortable (112.5%)',
      pxLabel: FONT_SCALE_PX_MAP.lg,
      desc: 'Recommended for Barangay kiosk & older adult consultations',
    },
    {
      level: 'xl',
      title: 'Maximum Low-Vision Accessibility (125%)',
      pxLabel: FONT_SCALE_PX_MAP.xl,
      desc: 'Scales all root rem typography globally for low-vision clarity',
    },
  ];

  const smsPrefLabels: {
    key: keyof SmsNotificationPreferences;
    title: string;
    desc: string;
  }[] = [
    {
      key: 'criticalLowStockAlert',
      title: 'Critical Low Stock & Stockout SMS Alert',
      desc: 'Send immediate SMS to BHW Pharmacist when any batch drops below minimum safety buffer.',
    },
    {
      key: 'nearExpiryDigest',
      title: '45-Day FEFO Near-Expiry Morning Digest',
      desc: 'Daily 07:00 AM SMS digest listing medicine batches expiring within 45 days.',
    },
    {
      key: 'ambulanceDispatchSms',
      title: 'Caller Ambulance ETA & Telemetry SMS',
      desc: 'Automatically text informant with ambulance plate number, medic lead, and live ETA.',
    },
    {
      key: 'crossBarangayRequisitionSms',
      title: 'Cross-Barangay Stock Requisition Gateway',
      desc: 'Notify partner Parañaque RHU pharmacists via SMS when an urgent stock transfer is filed.',
    },
    {
      key: 'doctorLeaveBroadcast',
      title: 'Physician Leave & Reliever Patient Advisory',
      desc: 'Broadcast SMS advisory to booked walk-in patients when a doctor marks leave.',
    },
    {
      key: 'citizenSmsHotlineGateway',
      title: 'Two-Way Citizen SOS Callback Gateway',
      desc: 'Allow residents without mobile data to trigger triage callbacks via SMS shortcode.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Account Profile & System Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          Configure Health Worker credentials, WCAG root font scaling, bilingual Tagalog/English i18n, and SMS triggers
        </p>
      </div>

      {/* 4-Tab Selector Bar (Minimum 44x44px touch targets) */}
      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/70 dark:bg-[#161922]/90 border border-white/60 dark:border-white/10"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>[{tab.id}]</span>
          </button>
        ))}
      </div>

      {/* Tab 1: [Account] */}
      {activeTab === 'Account' && (
        <GlassCard variant="elevated" className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md">
                ES
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {userProfile.fullName}
                </h2>
                <p className="text-xs font-bold text-indigo-700 dark:text-cyan-300">
                  {userProfile.roleTitle} • {userProfile.employeeId}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {userProfile.barangayAssignment}
                </p>
              </div>
            </div>
            <Badge tone="emerald">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified DOH / LGU Credential
            </Badge>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                id="acc-fullname"
                label="Full Name & Professional Suffix"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <GlassInput
                id="acc-emp-id"
                label="LGU Employee ID Number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
              <GlassInput
                id="acc-position"
                label="Plantilla Position / Role"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <GlassInput
                id="acc-prc"
                label="PRC License & Validity"
                value={prcLicense}
                onChange={(e) => setPrcLicense(e.target.value)}
              />
              <GlassInput
                id="acc-mobile"
                label="Official Duty Mobile (SMS Alerts)"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <GlassInput
                id="acc-email"
                type="email"
                label="LGU Government Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Last Login: {userProfile.lastLogin}
              </span>
              <GlassButton
                type="submit"
                variant="primary"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Save Account Profile
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Tab 2: [Appearance] (Glass Theme + Dynamic Root <html> Font Scaling Engine) */}
      {activeTab === 'Appearance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <GlassCard variant="elevated" className="p-6 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Glassmorphism Surface Mode
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Choose between Frosted Lavender/Sky Light Mode and Deep Obsidian Dark Console Mode. Both strictly enforce WCAG 2.2 AA contrast ratios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`min-h-[84px] p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    theme === 'light'
                      ? 'bg-indigo-50/95 border-indigo-600 ring-2 ring-indigo-600 text-slate-900'
                      : 'bg-white/60 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-sm font-extrabold">Frosted Light Glass</div>
                    <div className="text-[11px] opacity-80">Lavender & Sky Daylight</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`min-h-[84px] p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    theme === 'dark'
                      ? 'bg-[#1A1E29] border-cyan-400 ring-2 ring-cyan-400 text-white'
                      : 'bg-white/60 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Moon className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm font-extrabold">Obsidian Dark Glass</div>
                    <div className="text-[11px] opacity-80">#12151C Dispatch Night</div>
                  </div>
                </button>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-7">
            <GlassCard variant="elevated" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Dynamic Root `&lt;html&gt;` Font-Size Scaling Engine
                  </h2>
                </div>
                <Badge tone="indigo">
                  Root: {FONT_SCALE_PX_MAP[fontScale]} ({fontScale.toUpperCase()})
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Updates <code className="font-mono font-bold">document.documentElement.style.fontSize</code> and <code className="font-mono font-bold">data-font-scale</code> on the root <code className="font-mono font-bold">&lt;html&gt;</code> element so all Tailwind <code className="font-mono font-bold">rem</code> utilities scale proportionally across every screen.
              </p>

              <div className="space-y-2.5">
                {fontScaleOptions.map((opt) => (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setFontScale(opt.level)}
                    className={`w-full min-h-[54px] p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      fontScale === opt.level
                        ? 'bg-indigo-50/95 dark:bg-indigo-950/60 border-indigo-600 dark:border-cyan-400 ring-1 ring-indigo-600 dark:ring-cyan-400'
                        : 'bg-white/70 dark:bg-[#12151C]/80 border-slate-200/80 dark:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {opt.title}
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">{opt.desc}</div>
                    </div>
                    <Badge tone={fontScale === opt.level ? 'emerald' : 'slate'}>
                      {opt.pxLabel}
                    </Badge>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab 3: [Language] (Filipino / Tagalog & English i18n) */}
      {activeTab === 'Language' && (
        <GlassCard variant="elevated" className="p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Bilingual Interface Localization (Tagalog / Filipino & English)
          </h2>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Switch system labels, citizen medicine lookup headers, and Oplan Kalusugan announcements between English and conversational Filipino.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`min-h-[96px] p-5 rounded-2xl border text-left transition-all space-y-1.5 ${
                locale === 'en'
                  ? 'bg-indigo-50/95 dark:bg-indigo-950/60 border-indigo-600 dark:border-cyan-400 ring-2 ring-indigo-600'
                  : 'bg-white/70 dark:bg-[#12151C]/80 border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  English (Philippine Civic Standard)
                </span>
                {locale === 'en' && <Badge tone="emerald">Active</Badge>}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Standard DOH & LGU clinical terminology for health workers and administrative reporting.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setLocale('tl')}
              className={`min-h-[96px] p-5 rounded-2xl border text-left transition-all space-y-1.5 ${
                locale === 'tl'
                  ? 'bg-indigo-50/95 dark:bg-indigo-950/60 border-indigo-600 dark:border-cyan-400 ring-2 ring-indigo-600'
                  : 'bg-white/70 dark:bg-[#12151C]/80 border-slate-200 dark:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  Filipino / Tagalog (Wika ng Barangay)
                </span>
                {locale === 'tl' && <Badge tone="emerald">Aktibo</Badge>}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Mas madaling maunawaan ng mga residente, Senior Citizens, at Barangay Health Workers.
              </p>
            </button>
          </div>
        </GlassCard>
      )}

      {/* Tab 4: [Notification] (SMS Toggles & Live Trigger Preview) */}
      {activeTab === 'Notification' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <GlassCard variant="elevated" className="p-6 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Automated SMS Gateway Triggers
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Configure which operational events automatically dispatch SMS alerts via the Parañaque LGU Cellular Gateway.
              </p>

              <div className="space-y-2.5">
                {smsPrefLabels.map((item) => {
                  const enabled = smsPreferences[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#12151C]/85 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => toggleSmsPreference(item.key)}
                        className={`min-h-[44px] min-w-[76px] px-3 rounded-xl font-extrabold text-xs transition-all ${
                          enabled
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  SMS Notification Trigger Preview
                </h3>
              </div>

              <form onSubmit={handleSendTestSms} className="space-y-3">
                <GlassInput
                  id="sms-test-recipient"
                  label="Recipient Mobile Number"
                  value={testSmsPhone}
                  onChange={(e) => setTestSmsPhone(e.target.value)}
                />
                <div>
                  <label
                    htmlFor="sms-test-body"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-1"
                  >
                    SMS Payload Preview (160-char GSM)
                  </label>
                  <textarea
                    id="sms-test-body"
                    rows={3}
                    value={testSmsMessage}
                    onChange={(e) => setTestSmsMessage(e.target.value)}
                    className="w-full rounded-xl bg-white/90 dark:bg-[#12151C] border border-slate-300 dark:border-white/20 p-3 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <GlassButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  icon={<Send className="w-4 h-4" />}
                >
                  Trigger Test SMS Broadcast
                </GlassButton>
              </form>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Recent Outbound SMS Log ({smsLogs.length})
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {smsLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-white/75 dark:bg-[#12151C]/90 border border-slate-200/80 dark:border-white/10 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-indigo-700 dark:text-cyan-300">
                        <span>{log.recipient}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                        {log.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE: app/page.tsx
// ==========================================
function AlagaRootEntryPage() {
  const { toastMessage } = useApp();
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('citizen-home');

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient Glassmorphic Neon Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-24 -left-24 w-96 h-96 rounded-full bg-violet-500/20 dark:bg-violet-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/3 -right-24 w-96 h-96 rounded-full bg-cyan-400/20 dark:bg-cyan-500/15 blur-3xl"
      />

      <GlassNavbar activeRoute={activeRoute} onNavigate={setActiveRoute} />

      {/* Live Toast Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-indigo-600/95 text-white border border-white/20 shadow-2xl flex items-center gap-2.5 text-xs font-extrabold"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeRoute === 'citizen-home' && (
          <CitizenPortalPage
            onOpenAmbulanceTracker={() => setActiveRoute('citizen-ambulance')}
          />
        )}
        {activeRoute === 'citizen-ambulance' && (
          <PublicAmbulanceTrackerPage onBack={() => setActiveRoute('citizen-home')} />
        )}
        {activeRoute.startsWith('admin-') && (
          <AdminLayout>
            {activeRoute === 'admin-overview' && (
              <AdminOverviewPage onNavigate={setActiveRoute} />
            )}
            {activeRoute === 'admin-dispatch' && <AdminDispatchConsolePage />}
            {activeRoute === 'admin-inventory' && <AdminInventoryPage />}
            {activeRoute === 'admin-schedule' && <AdminScheduleRosterPage />}
            {activeRoute === 'admin-settings' && <AdminSettingsPage />}
          </AdminLayout>
        )}
      </main>
    </div>
  );
}

// ==========================================
// ROOT EXPORT FOR CANVAS PREVIEW
// ==========================================
export default function App() {
  return (
    <SettingsProvider>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-[#DDE7FF] via-[#E8DCFC] to-[#F3E8FF] dark:from-[#0D1017] dark:via-[#12151C] dark:to-[#1A1E29] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-600 selection:text-white">
          <AlagaRootEntryPage />
        </div>
      </AppProvider>
    </SettingsProvider>
  );
}
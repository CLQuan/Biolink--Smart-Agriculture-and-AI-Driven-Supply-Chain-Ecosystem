export type UserRole = 'supplier' | 'driver';

export type GradeLevel = 'A' | 'B' | 'C' | 'Rejected';

export type BatchStatus = 'pending' | 'approved' | 'rejected' | 'synced';

export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  farmName?: string;
  vehiclePlate?: string;
}

export interface CropBatch {
  id: string;
  batchId: string;
  cropType: string;
  grade: GradeLevel;
  gradeConfidence: number;
  weight: number;
  farmName: string;
  date: string;
  status: BatchStatus;
  syncStatus: SyncStatus;
  notes: string;
}

export interface GradingResult {
  cropType: string;
  grade: GradeLevel;
  confidence: number;
  notes: string;
}

export interface SyncRecord {
  id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial';
  batchesSynced: number;
  message: string;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  batteryPercent: number;
  signalStrength: number;
  temperature: number;
  humidity: number;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface TemperaturePoint {
  time: string;
  value: number;
}

export interface SensorAlert {
  id: string;
  sensorId: string;
  type: 'temperature' | 'humidity' | 'battery' | 'signal';
  message: string;
  timestamp: string;
  severity: 'warning' | 'critical';
}

export interface RouteStop {
  id: string;
  name: string;
  time: string;
  status: 'completed' | 'current' | 'upcoming';
  isDestination?: boolean;
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'loading';
  etaDisplay: string;
  etaMinutes: number;
  crateCount: number;
  departureTime: string;
  driverName: string;
  vehiclePlate: string;
  distanceKm: number;
  elapsedDisplay: string;
  remainingDisplay: string;
  currentSpeedKmh: number;
  onSchedule: boolean;
}

export interface CrateDelivery {
  crateId: string;
  contents: string;
  grade: GradeLevel;
  weightKg: number;
  origin: string;
  farmName: string;
  custodyEvents: CustodyEvent[];
}

export interface CustodyEvent {
  id: string;
  action: string;
  location: string;
  timestamp: string;
  actor: string;
}

// Navigation param types
export type RootStackParamList = {
  Login: undefined;
  RoleSelect: undefined;
  SupplierTabs: undefined;
  DriverTabs: undefined;
};

export type SupplierTabParamList = {
  SupplierHome: undefined;
  Grading: undefined;
  BatchList: undefined;
  SyncStatus: undefined;
};

export type DriverTabParamList = {
  DriverHome: undefined;
  Route: undefined;
  Sensors: undefined;
  ScanDelivery: undefined;
};

// Types for Church Certificate Management System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'priest' | 'admin';
}

export interface ChurchMember {
  id: string;
  sno: number;
  name: string;
  fatherName: string;
  motherName: string;
  baptismName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaptismRecord extends ChurchMember {
  dateOfBirth: Date;
  dateOfBaptism: Date;
  type: 'baptism';
}

export interface MarriageRecord {
  id: string;
  sno: number;
  groomName: string;
  groomFatherName: string;
  groomMotherName: string;
  groomBaptismName?: string;
  brideName: string;
  brideFatherName: string;
  brideMotherName: string;
  brideBaptismName?: string;
  dateOfMarriage: Date;
  type: 'marriage';
  createdAt: Date;
  updatedAt: Date;
}

export interface DeathRecord extends ChurchMember {
  dateOfBirth?: Date;
  dateOfDeath: Date;
  type: 'death';
}

export type RecordType = 'baptism' | 'marriage' | 'death';

export interface CertificateData {
  type: RecordType;
  record: BaptismRecord | MarriageRecord | DeathRecord;
  churchName: string;
  churchAddress: string;
  priestName: string;
  issueDate: Date;
}

export interface ChurchSettings {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
}

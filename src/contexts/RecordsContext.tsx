import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BaptismRecord, MarriageRecord, DeathRecord, ChurchSettings } from '@/types';

// Initial demo data
const INITIAL_BAPTISM_RECORDS: BaptismRecord[] = [
  {
    id: '1',
    sno: 1,
    name: 'Michael Thomas',
    fatherName: 'Robert Thomas',
    motherName: 'Sarah Thomas',
    baptismName: 'Michael',
    dateOfBirth: new Date('2020-03-15'),
    dateOfBaptism: new Date('2020-06-21'),
    type: 'baptism',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sno: 2,
    name: 'Emma Williams',
    fatherName: 'David Williams',
    motherName: 'Jennifer Williams',
    baptismName: 'Grace',
    dateOfBirth: new Date('2021-08-10'),
    dateOfBaptism: new Date('2021-12-25'),
    type: 'baptism',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const INITIAL_MARRIAGE_RECORDS: MarriageRecord[] = [
  {
    id: '1',
    sno: 1,
    groomName: 'James Anderson',
    groomFatherName: 'William Anderson',
    groomMotherName: 'Patricia Anderson',
    groomBaptismName: 'James',
    brideName: 'Elizabeth Brown',
    brideFatherName: 'Richard Brown',
    brideMotherName: 'Mary Brown',
    brideBaptismName: 'Elizabeth',
    dateOfMarriage: new Date('2023-06-15'),
    type: 'marriage',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const INITIAL_DEATH_RECORDS: DeathRecord[] = [
  {
    id: '1',
    sno: 1,
    name: 'George Miller',
    fatherName: 'Henry Miller',
    motherName: 'Agnes Miller',
    baptismName: 'George',
    dateOfBirth: new Date('1945-02-20'),
    dateOfDeath: new Date('2024-01-10'),
    type: 'death',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface RecordsContextType {
  baptismRecords: BaptismRecord[];
  marriageRecords: MarriageRecord[];
  deathRecords: DeathRecord[];
  churchSettings: ChurchSettings;
  addBaptismRecord: (record: Omit<BaptismRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => void;
  updateBaptismRecord: (id: string, record: Partial<BaptismRecord>) => void;
  deleteBaptismRecord: (id: string) => void;
  addMarriageRecord: (record: Omit<MarriageRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => void;
  updateMarriageRecord: (id: string, record: Partial<MarriageRecord>) => void;
  deleteMarriageRecord: (id: string) => void;
  addDeathRecord: (record: Omit<DeathRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => void;
  updateDeathRecord: (id: string, record: Partial<DeathRecord>) => void;
  deleteDeathRecord: (id: string) => void;
  updateChurchSettings: (settings: Partial<ChurchSettings>) => void;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [baptismRecords, setBaptismRecords] = useState<BaptismRecord[]>(INITIAL_BAPTISM_RECORDS);
  const [marriageRecords, setMarriageRecords] = useState<MarriageRecord[]>(INITIAL_MARRIAGE_RECORDS);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>(INITIAL_DEATH_RECORDS);
  const [churchSettings, setChurchSettings] = useState<ChurchSettings>({
    name: 'St. Mary\'s Catholic Church',
    address: '123 Church Street, Holy City, HC 12345',
    phone: '+1 (555) 123-4567',
    email: 'office@stmarys.church',
  });

  // Baptism CRUD
  const addBaptismRecord = useCallback((record: Omit<BaptismRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => {
    const newRecord: BaptismRecord = {
      ...record,
      id: Date.now().toString(),
      sno: baptismRecords.length + 1,
      type: 'baptism',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBaptismRecords(prev => [...prev, newRecord]);
  }, [baptismRecords.length]);

  const updateBaptismRecord = useCallback((id: string, record: Partial<BaptismRecord>) => {
    setBaptismRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...record, updatedAt: new Date() } : r))
    );
  }, []);

  const deleteBaptismRecord = useCallback((id: string) => {
    setBaptismRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // Marriage CRUD
  const addMarriageRecord = useCallback((record: Omit<MarriageRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => {
    const newRecord: MarriageRecord = {
      ...record,
      id: Date.now().toString(),
      sno: marriageRecords.length + 1,
      type: 'marriage',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMarriageRecords(prev => [...prev, newRecord]);
  }, [marriageRecords.length]);

  const updateMarriageRecord = useCallback((id: string, record: Partial<MarriageRecord>) => {
    setMarriageRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...record, updatedAt: new Date() } : r))
    );
  }, []);

  const deleteMarriageRecord = useCallback((id: string) => {
    setMarriageRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // Death CRUD
  const addDeathRecord = useCallback((record: Omit<DeathRecord, 'id' | 'sno' | 'createdAt' | 'updatedAt' | 'type'>) => {
    const newRecord: DeathRecord = {
      ...record,
      id: Date.now().toString(),
      sno: deathRecords.length + 1,
      type: 'death',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDeathRecords(prev => [...prev, newRecord]);
  }, [deathRecords.length]);

  const updateDeathRecord = useCallback((id: string, record: Partial<DeathRecord>) => {
    setDeathRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, ...record, updatedAt: new Date() } : r))
    );
  }, []);

  const deleteDeathRecord = useCallback((id: string) => {
    setDeathRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  // Church Settings
  const updateChurchSettings = useCallback((settings: Partial<ChurchSettings>) => {
    setChurchSettings(prev => ({ ...prev, ...settings }));
  }, []);

  return (
    <RecordsContext.Provider
      value={{
        baptismRecords,
        marriageRecords,
        deathRecords,
        churchSettings,
        addBaptismRecord,
        updateBaptismRecord,
        deleteBaptismRecord,
        addMarriageRecord,
        updateMarriageRecord,
        deleteMarriageRecord,
        addDeathRecord,
        updateDeathRecord,
        deleteDeathRecord,
        updateChurchSettings,
      }}
    >
      {children}
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  const context = useContext(RecordsContext);
  if (context === undefined) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
}

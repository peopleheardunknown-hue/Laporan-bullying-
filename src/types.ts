export type UserRole = 'admin' | 'guru_bk' | 'siswa';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  victim_name: string;
  perpetrator_name: string;
  location: string;
  incident_date: string;
  description: string;
  evidence_url: string | null;
  status: 'diterima' | 'diproses' | 'selesai';
  created_at: string;
  is_anonymous: boolean;
}

export interface FollowUp {
  id: string;
  report_id: string;
  guru_id: string;
  notes: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

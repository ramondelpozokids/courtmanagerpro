export interface BirthdayPerson {
  id: string;
  full_name: string;
  role: string;
  person_type: 'player' | 'staff';
  birth_date: string;
  photo_url: string | null;
  next_birthday: string;
  days_until: number;
  turning_age: number;
  official_slug?: string | null;
}

export interface BirthdayNotificationRecord {
  id: string;
  team_id: string;
  person_name: string;
  person_role: string;
  person_type: 'player' | 'staff';
  person_id: string | null;
  birthday_date: string;
  turning_age: number | null;
  recipient_email: string;
  recipient_name: string | null;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending' | 'retrying';
  attempts: number;
  error_message: string | null;
  dedupe_key: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BirthdayEmailSendResult {
  ok: boolean;
  attempts: number;
  error: string | null;
  provider: string;
  simulated?: boolean;
}

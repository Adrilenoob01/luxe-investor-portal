import { Profile } from './profile';
import { OrderProject } from './order-project';

// Type pour les données minimales du profil retournées dans les relations
export interface ProfileMinimal {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface BaseTransaction {
  id: string;
  user_id: string | null;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  is_cancelled: boolean | null;
  profiles?: ProfileMinimal;
}

export interface Investment extends BaseTransaction {
  project_id: string | null;
  payment_method: string;
  order_projects?: OrderProject;
}

export interface Withdrawal extends BaseTransaction {
  withdrawal_method: string | null;
  fees: number | null;
  iban: string | null;
  phone_number: string | null;
}
import { Profile } from './profile';
import { OrderProject } from './order-project';

interface BaseTransaction {
  id: string;
  user_id: string | null;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  is_cancelled: boolean | null;
  profiles?: Profile;
}

export interface Investment extends BaseTransaction {
  project_id: string | null;
  payment_method: string;
  order_projects?: OrderProject;
}

export interface Withdrawal extends BaseTransaction {
  withdrawal_method: string | null;
}
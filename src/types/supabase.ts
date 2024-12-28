export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  is_admin: boolean | null;
  available_balance: number;
  invested_amount: number;
  created_at: string;
  updated_at: string;
  email: string | null;
}

export interface OrderProject {
  id: string;
  name: string;
  return_rate: number;
  description: string;
  is_active: boolean | null;
  target_amount: number;
  collected_amount: number;
  implementation_date: string | null;
  end_date: string | null;
  status: string;
  image_url: string | null;
  short_description: string | null;
  detailed_description: string | null;
  location: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string | null;
  project_id: string | null;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  order_projects?: OrderProject;
}

export interface Withdrawal {
  id: string;
  user_id: string | null;
  amount: number;
  status: string;
  withdrawal_method: string | null;
  created_at: string;
  updated_at: string;
  is_cancelled: boolean | null;
}
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
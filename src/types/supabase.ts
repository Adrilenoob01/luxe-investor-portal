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
}

export interface InvestmentPack {
  id: string;
  name: string;
  min_amount: number;
  return_rate: number;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string | null;
  pack_id: string | null;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  investment_packs?: InvestmentPack;
}
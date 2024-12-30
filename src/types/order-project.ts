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
  min_amount: number;
}
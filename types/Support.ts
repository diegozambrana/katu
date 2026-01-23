export type SupportMessageStatus = "PENDING" | "SOLVED" | "CLOSED";

export type SupportMessage = {
  id: string;
  created_at: string;
  updated_at: string;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  user_id: string;
  user_email?: string; // Email from profiles or auth.users
};

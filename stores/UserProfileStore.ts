import { create } from "zustand";

export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  role: UserRole;
  email?: string;
  full_name?: string;
  onboarding_completed: boolean;
}

interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  isAdmin: () => boolean;
}

const defaultState = {
  profile: null,
  loading: true,
  error: null,
};

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  ...defaultState,

  setProfile: (profile) => set({ profile, loading: false }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  reset: () => set(defaultState),

  isAdmin: () => {
    const { profile } = get();
    return profile?.role === "ADMIN";
  },
}));

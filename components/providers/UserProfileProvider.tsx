"use client";

import { useEffect } from "react";
import { useUserProfileStore } from "@/stores/UserProfileStore";
import type { UserProfile } from "@/actions/user/UserActions";

interface UserProfileProviderProps {
  children: React.ReactNode;
  initialProfile: UserProfile | null;
}

export function UserProfileProvider({
  children,
  initialProfile,
}: UserProfileProviderProps) {
  const { setProfile, setLoading } = useUserProfileStore();

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    } else {
      setLoading(false);
    }
  }, [initialProfile, setProfile, setLoading]);

  return <>{children}</>;
}

import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SocialMediaPlatform {
  name: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const socialMedia: SocialMediaPlatform[] = [
  {
    name: "Facebook",
    value: "facebook",
    icon: Facebook,
    color: "text-blue-600",
  },
  {
    name: "Instagram",
    value: "instagram",
    icon: Instagram,
    color: "text-pink-600",
  },
  {
    name: "(X) Twitter",
    value: "twitter",
    icon: Twitter,
    color: "text-gray-900 dark:text-gray-100",
  },
  {
    name: "YouTube",
    value: "youtube",
    icon: Youtube,
    color: "text-red-600",
  },
  {
    name: "LinkedIn",
    value: "linkedin",
    icon: Linkedin,
    color: "text-blue-700",
  },
  {
    name: "TikTok",
    value: "tiktok",
    icon: Instagram, // TikTok no está disponible en lucide-react, usamos Instagram como fallback
    color: "text-black dark:text-white",
  },
];

export const getSocialMediaByValue = (value: string): SocialMediaPlatform | undefined => {
  return socialMedia.find((platform) => platform.value === value);
};

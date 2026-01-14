"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { socialMedia } from "@/constants/socialMedia";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
  active: boolean;
}

interface BusinessSocialLinksManagerProps {
  socialLinks: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export const BusinessSocialLinksManager = ({
  socialLinks,
  onChange,
}: BusinessSocialLinksManagerProps) => {
  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "facebook", // Usar el value, no el name
      url: "",
      sort_order: socialLinks.length + 1,
      active: true,
    };
    onChange([...socialLinks, newLink]);
  };

  const removeSocialLink = (id: string) => {
    onChange(socialLinks.filter((link) => link.id !== id));
  };

  const updateSocialLink = (
    id: string,
    field: keyof SocialLink,
    value: string | number | boolean
  ) => {
    onChange(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  return (
    <div className="space-y-4">
      {socialLinks.map((link) => (
        <div
          key={link.id}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border rounded-lg"
        >
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Select
              value={link.platform}
              onValueChange={(value) =>
                updateSocialLink(link.id, "platform", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {socialMedia.map((social) => (
                  <SelectItem key={social.value} value={social.value}>
                    {social.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="https://..."
              value={link.url}
              onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
            />
            <div className="flex items-center gap-2 justify-end">
              <div className="flex items-center gap-2">
                <Switch
                  checked={link.active}
                  onCheckedChange={(checked) =>
                    updateSocialLink(link.id, "active", checked)
                  }
                />
                <span className="text-sm">Active</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(link.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={addSocialLink}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Social Link
        </Button>
      </div>
    </div>
  );
};

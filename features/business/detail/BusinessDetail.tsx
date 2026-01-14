"use client";

import { useBusinessDetail } from "./hooks/useBusinessDetail";
import { MainContainer } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Eye,
  Phone,
  Mail,
  Globe,
  MapPin,
  Copy,
  ExternalLink,
  Coffee,
  MessageCircle,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessDetailProps {
  businessId: string;
}

export const BusinessDetail = ({ businessId }: BusinessDetailProps) => {
  const router = useRouter();
  const { business, loading, error } = useBusinessDetail(businessId);

  if (!business) {
    return (
      <MainContainer
        title="Business Profile Details"
        error={error || undefined}
        loading={loading}
      >
        <div></div>
      </MainContainer>
    );
  }

  // Datos falsos para campos que no existen en el tipo
  const mockData = {
    profileViews: 1234,
    productsListed: 45,
    socialMedia: [
      {
        platform: "Facebook",
        url: "facebook.com/artisancoffee",
        active: true,
        icon: MessageCircle,
        color: "text-blue-600",
      },
      {
        platform: "Instagram",
        url: "instagram.com/artisancoffee",
        active: true,
        icon: MessageCircle,
        color: "text-pink-600",
      },
      {
        platform: "YouTube",
        url: "youtube.com/artisancoffee",
        active: false,
        icon: Video,
        color: "text-red-600",
      },
    ],
    recentActivity: [
      { action: "Profile updated", time: "2 hours ago", color: "bg-green-500" },
      { action: "New product added", time: "1 day ago", color: "bg-blue-500" },
      {
        action: "Cover image updated",
        time: "3 days ago",
        color: "bg-purple-500",
      },
    ],
  };

  const publicUrl = `catalogo.app/b/${business.slug}`;

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "2 hours ago";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const lastUpdated = formatTimeAgo(business.udpated_at);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl);
  };

  return (
    <MainContainer
      title="Business Profile Details"
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/business/${businessId}/edit`)}
            variant="default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview Public Page
          </Button>
        </div>
      }
      loading={loading}
      error={error || undefined}
    >
      <div className="space-y-6">
        {/* Business Card with Cover */}
        <Card className="relative overflow-hidden mb-4">
          {business.cover && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
              style={{ backgroundImage: `url(${business.cover})` }}
            />
          )}
          <CardContent className="relative p-6 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              {business.avatar ? (
                <img
                  src={business.avatar}
                  alt={business.avatar_caption || business.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Coffee className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{business.name}</h2>
              <p className="text-muted-foreground font-mono text-sm">
                {business.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - 8/12 (66.67%) */}
          <div className="lg:col-span-8 space-y-6 col-span-12">
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Business Name
                  </p>
                  <p className="font-medium">{business.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">URL Slug</p>
                  <p className="font-mono text-sm">{business.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Description
                  </p>
                  <p className="text-sm">
                    {business.description ||
                      "Premium artisan coffee and freshly baked goods made daily with locally sourced ingredients. We specialize in single-origin coffee beans and handcrafted pastries."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">
                      {business.phone || "+591 123 456 789"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">
                      {business.whatsapp_phone || "+591 987 654 321"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {business.email || "info@artisancoffee.com"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <p className="font-medium">
                      {business.website_url || "www.artisancoffee.com"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {business.address
                        ? `${business.address}, ${business.city}, ${business.country}`
                        : "123 Main Street, Santa Cruz, Bolivia"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.socialMedia.map((social) => {
                  const Icon = social.icon;
                  return (
                    <div
                      key={social.platform}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${social.color}`} />
                        <div>
                          <p className="font-medium">{social.platform}</p>
                          <p className="text-sm text-muted-foreground">
                            {social.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            social.active ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {social.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 4/12 (33.33%) */}
          <div className="lg:col-span-4 col-span-12 space-y-6">
            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Profile Views
                  </p>
                  <p className="text-2xl font-bold">{mockData.profileViews}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Products Listed
                  </p>
                  <p className="text-2xl font-bold">
                    {mockData.productsListed}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="font-medium">{lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant={business.active ? "default" : "outline"}>
                    {business.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Public URL */}
            <Card>
              <CardHeader>
                <CardTitle>Public URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your public catalog page:
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="text-sm flex-1">{publicUrl}</code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy URL
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Page
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockData.recentActivity.map((activity) => (
                  <div
                    key={activity.action}
                    className="flex items-center gap-3"
                  >
                    <div className={`h-2 w-2 rounded-full ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

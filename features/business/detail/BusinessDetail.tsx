"use client";

import { useBusinessDetail } from "./hooks/useBusinessDetail";
import { MainContainer } from "@/components/layout/container";
import { BREADCRUMB } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Phone,
  Mail,
  Globe,
  MapPin,
  Coffee,
} from "lucide-react";
import { getSocialMediaByValue } from "@/constants/socialMedia";
import { useRouter } from "next/navigation";
import { PublicURLCard } from "@/components/PublicURL";

interface BusinessDetailProps {
  businessId: string;
}

export const BusinessDetail = ({ businessId }: BusinessDetailProps) => {
  const router = useRouter();
  const { business, loading, error } = useBusinessDetail(businessId);

  if (!business) {
    return (
      <MainContainer
        title="Detalles de la Empresa"
        error={error || undefined}
        loading={loading}
        breadcrumb={BREADCRUMB.BUSINESS_DETAIL}
      >
        <div></div>
      </MainContainer>
    );
  }

  // Obtener social links del business, ordenados por sort_order
  const socialLinks = business.business_social_links
    ? [...business.business_social_links]
      .filter((link) => link.active) // Solo mostrar links activos
      .sort((a, b) => a.sort_order - b.sort_order)
    : [];

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

  return (
    <MainContainer
      title="Business Profile Details"
      breadcrumb={BREADCRUMB.BUSINESS_DETAIL}
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/business/${businessId}/edit`)}
            variant="default"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
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
                <CardTitle>{"Información de la Empresa"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {"Nombre de la Empresa"}
                  </p>
                  <p className="font-medium">{business.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {"Descripción"}
                  </p>
                  <p className="text-sm">
                    {business.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{"Información de Contacto"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {business.phone}
                      </p>
                    </div>
                  </div>
                )}
                {business.whatsapp_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">
                        {business.whatsapp_phone}
                      </p>
                    </div>
                  </div>
                )}
                {business.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {business.email || "info@artisancoffee.com"}
                      </p>
                    </div>
                  </div>
                )}
                {business.website_url && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-medium">
                        {business.website_url || "www.artisancoffee.com"}
                      </p>
                    </div>
                  </div>
                )}
                {business.address && (
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
                )}
                {!business.phone && !business.whatsapp_phone && !business.email && !business.website_url && !business.address && (
                  <p className="text-sm text-muted-foreground">
                    No hay información de contacto configurada
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialLinks.length > 0 ? (
                  socialLinks.map((link) => {
                    const platform = getSocialMediaByValue(link.platform);
                    if (!platform) return null;

                    const Icon = platform.icon;
                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${platform.color}`} />
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                              {link.url}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm text-muted-foreground">
                            Active
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay redes sociales configuradas
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 4/12 (33.33%) */}
          <div className="lg:col-span-4 col-span-12 space-y-6">
            {/* Profile Stats */}
            <Card>
              <CardHeader>
                <CardTitle>{"Estadísticas"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Profile Views
                  </p>
                  <p className="text-2xl font-bold">{mockData.profileViews}</p>
                </div> */}
                {/* <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Productos Listados
                  </p>
                  <p className="text-2xl font-bold">
                    {mockData.productsListed}
                  </p>
                </div> */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Última Actualización
                  </p>
                  <p className="font-medium">{lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant={business.active ? "default" : "outline"}>
                    {business.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Public URL */}
            <div className="hidden">
              <PublicURLCard slug={business.slug} />
            </div>

            {/* Recent Activity */}
            {/* <Card>
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
            </Card> */}
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

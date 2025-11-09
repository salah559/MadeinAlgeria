import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Factory } from "@shared/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Factory as FactoryIcon,
  TrendingUp,
  Users,
  Eye,
  Star,
  MapPin,
  Building2,
  BarChart3,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalFactories: number;
  totalViews: number;
  totalReviews: number;
  averageRating: number;
  verifiedFactories: number;
  pendingFactories: number;
  topWilayas: Array<{ wilaya: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  recentFactories: Factory[];
  topRatedFactories: Factory[];
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  subtitle?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-bold">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>{trend}</span>
            </div>
          )}
          {subtitle && (
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const { data: factories } = useQuery<Factory[]>({
    queryKey: ["/api/factories"],
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO title={language === "ar" ? "غير مصرح" : "Unauthorized"} />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {language === "ar" ? "غير مصرح بالوصول" : "Access Denied"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === "ar"
                ? "ليس لديك صلاحيات للوصول إلى هذه الصفحة"
                : "You don't have permission to access this page"}
            </p>
            <Link href="/">
              <Button>{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats: DashboardStats = {
    totalFactories: factories?.length || 0,
    totalViews: factories?.reduce((sum, f) => sum + (f.viewsCount || 0), 0) || 0,
    totalReviews: factories?.reduce((sum, f) => sum + (f.reviewsCount || 0), 0) || 0,
    averageRating:
      factories && factories.length > 0
        ? factories.reduce((sum, f) => sum + (f.rating || 0), 0) / factories.length
        : 0,
    verifiedFactories: factories?.filter((f) => f.verified).length || 0,
    pendingFactories: factories?.filter((f) => !f.verified).length || 0,
    topWilayas: [],
    topCategories: [],
    recentFactories: factories?.slice(0, 5) || [],
    topRatedFactories:
      factories
        ?.filter((f) => f.rating && f.rating > 0)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5) || [],
  };

  if (factories && factories.length > 0) {
    const wilayaCount: Record<string, number> = {};
    const categoryCount: Record<string, number> = {};

    factories.forEach((f) => {
      wilayaCount[f.wilaya] = (wilayaCount[f.wilaya] || 0) + 1;
      categoryCount[f.category] = (categoryCount[f.category] || 0) + 1;
    });

    stats.topWilayas = Object.entries(wilayaCount)
      .map(([wilaya, count]) => ({ wilaya, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    stats.topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={
          language === "ar"
            ? "لوحة التحكم - دليل المصانع"
            : "Admin Dashboard - Factory Directory"
        }
      />
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === "ar" ? "لوحة التحكم" : language === "fr" ? "Tableau de Bord" : "Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {language === "ar"
                ? "نظرة شاملة على إحصائيات المنصة"
                : language === "fr"
                ? "Vue d'ensemble des statistiques de la plateforme"
                : "Overview of platform statistics"}
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                {language === "ar" ? "نظرة عامة" : language === "fr" ? "Aperçu" : "Overview"}
              </TabsTrigger>
              <TabsTrigger value="factories" data-testid="tab-factories">
                <FactoryIcon className="w-4 h-4 mr-2" />
                {language === "ar" ? "المصانع" : language === "fr" ? "Usines" : "Factories"}
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                {language === "ar" ? "التحليلات" : language === "fr" ? "Analyses" : "Analytics"}
              </TabsTrigger>
              <TabsTrigger value="manage" data-testid="tab-manage">
                <Building2 className="w-4 h-4 mr-2" />
                {language === "ar" ? "إدارة" : language === "fr" ? "Gérer" : "Manage"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title={language === "ar" ? "إجمالي المصانع" : "Total Factories"}
                  value={stats.totalFactories}
                  icon={FactoryIcon}
                  trend="+12%"
                  subtitle={language === "ar" ? "هذا الشهر" : "this month"}
                />
                <StatCard
                  title={language === "ar" ? "إجمالي الزيارات" : "Total Views"}
                  value={stats.totalViews.toLocaleString()}
                  icon={Eye}
                  trend="+18%"
                />
                <StatCard
                  title={language === "ar" ? "التقييمات" : "Reviews"}
                  value={stats.totalReviews}
                  icon={Users}
                />
                <StatCard
                  title={language === "ar" ? "متوسط التقييم" : "Avg Rating"}
                  value={stats.averageRating.toFixed(1)}
                  icon={Star}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "ar" ? "أعلى الولايات" : "Top Wilayas"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topWilayas.map((item, index) => (
                        <div key={item.wilaya} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{item.wilaya}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.count} {language === "ar" ? "مصنع" : "factories"}
                              </div>
                            </div>
                          </div>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "ar" ? "أعلى القطاعات" : "Top Categories"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topCategories.map((item, index) => (
                        <div key={item.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{item.category}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.count} {language === "ar" ? "مصنع" : "factories"}
                              </div>
                            </div>
                          </div>
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "ar" ? "أعلى المصانع تقييماً" : "Top Rated Factories"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topRatedFactories.map((factory) => (
                      <div
                        key={factory.id}
                        className="flex items-center justify-between p-3 rounded-md hover-elevate cursor-pointer"
                        onClick={() => setLocation(`/factory/${factory.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          {factory.logoUrl && (
                            <img
                              src={factory.logoUrl}
                              alt={factory.name}
                              className="w-12 h-12 object-contain rounded-md"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                              {language === "ar" ? factory.nameAr : factory.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {factory.wilaya} • {factory.category}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{factory.rating?.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="factories">
              <Card>
                <CardContent className="p-6 text-center">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === "ar" ? "قائمة المصانع" : "Factories List"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === "ar"
                      ? "انتقل إلى صفحة إدارة المصانع"
                      : "Go to factories management page"}
                  </p>
                  <Link href="/admin">
                    <Button>
                      {language === "ar" ? "إدارة المصانع" : "Manage Factories"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  title={language === "ar" ? "مصانع موثقة" : "Verified"}
                  value={stats.verifiedFactories}
                  icon={FactoryIcon}
                />
                <StatCard
                  title={language === "ar" ? "قيد المراجعة" : "Pending"}
                  value={stats.pendingFactories}
                  icon={Building2}
                />
                <StatCard
                  title={language === "ar" ? "معدل النمو" : "Growth Rate"}
                  value="+25%"
                  icon={TrendingUp}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "ar" ? "تحليلات الأداء" : "Performance Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>
                      {language === "ar"
                        ? "الرسوم البيانية التفصيلية قريباً"
                        : "Detailed charts coming soon"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/admin")}>
                  <CardContent className="p-6">
                    <Building2 className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">
                      {language === "ar" ? "إدارة المصانع" : "Manage Factories"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar"
                        ? "إضافة، تعديل، وحذف المصانع"
                        : "Add, edit, and delete factories"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate cursor-pointer opacity-50">
                  <CardContent className="p-6">
                    <Users className="w-12 h-12 mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">
                      {language === "ar" ? "إدارة المستخدمين" : "Manage Users"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? "قريباً" : "Coming soon"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

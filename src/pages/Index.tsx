import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Vote, 
  Users, 
  FileText, 
  UserPlus, 
  ArrowRight,
  MapPin,
  Calendar,
  Heart
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 civic-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              <span>2026년 6월 3일 지방선거</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              <span className="text-primary">서울 지방선거</span>
              <br />
              사회복지 정책 플랫폼
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              시민과 사회복지 현장의 목소리를 정책으로 연결합니다.
              <br className="hidden sm:block" />
              지역 선거구 정보를 확인하고, 사회복지 정책을 제안해주세요.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <Link to="/candidates/si">
                  <MapPin className="h-4 w-4" />
                  선거구 확인하기
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Link to="/policy">
                  <FileText className="h-4 w-4" />
                  정책 제안하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              무엇을 할 수 있나요?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              시민 여러분의 참여로 더 나은 사회복지 정책을 만들어갑니다
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Users}
              title="시의원 선거구"
              description="서울시의회 의원 선거구별 정보를 확인하세요"
              href="/candidates/si"
            />
            <FeatureCard
              icon={MapPin}
              title="구의원 선거구"
              description="구의회 의원 선거구별 정보를 확인하세요"
              href="/candidates/gu"
            />
            <FeatureCard
              icon={FileText}
              title="정책 제안"
              description="사회복지사들의 정책 아이디어를 제안해주세요"
              href="/policy"
            />
            <FeatureCard
              icon={UserPlus}
              title="예비후보 등록"
              description="출마를 준비 중이신가요? 정보를 등록해주세요"
              href="/register"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard number="25" label="서울시 자치구" />
            <StatCard number="112" label="시의원 선거구" />
            <StatCard number="112" label="구의원 선거구" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-elevated bg-card">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 text-primary mb-4">
                    <Heart className="h-5 w-5 fill-primary" />
                    <span className="text-sm font-medium">사회복지사를 위한 공간</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    현장의 목소리를 정책으로
                  </h2>
                  <p className="text-muted-foreground max-w-xl">
                    사회복지 현장에서 느끼시는 정책적 개선 사항이 있으신가요?
                    여러분의 제안이 실제 정책으로 이어질 수 있도록 함께 만들어갑니다.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/policy">
                      정책 제안하기
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

function FeatureCard({ icon: Icon, title, description, href }: FeatureCardProps) {
  return (
    <Link to={href} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-border/50">
        <CardContent className="p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-transform group-hover:scale-110">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
            자세히 보기 <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center p-8 rounded-2xl bg-card shadow-card">
      <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">{number}</p>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export default Index;

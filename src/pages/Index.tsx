import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SeoulMap } from "@/components/SeoulMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Vote, 
  FileText, 
  UserPlus, 
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";

function getDaysUntilElection() {
  const electionDate = new Date('2026-06-03');
  const today = new Date();
  const timeDiff = electionDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary-foreground/10 text-primary-foreground font-bold mb-8 backdrop-blur-sm">
              <Calendar className="h-6 w-6" />
              <span className="text-2xl">D-{getDaysUntilElection()}</span>
              <span className="text-base opacity-90">2026년 6월 3일 지방선거</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-primary-foreground mb-8">
              서울사회복지사
              <br className="hidden sm:block" />
              6.3 지방선거 플랫폼
            </h1>
            
            <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              사회복지 현장의 목소리를 정책으로 연결합니다.
              <br className="hidden sm:block" />
              예비후보 등록과 정책 제안에 참여해주세요.
            </p>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Candidate Registration Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-elevated group">
              <CardContent className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 transition-transform group-hover:scale-110">
                  <UserPlus className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">6.3 지방선거 출마자 등록</h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  2026 6.3 지방선거에서 서울시의 시의원·구의원 출마를 준비하시는 분들의 정보를 등록해주세요. 사회복지사 자격증 및 회비 납부 여부를 확인 후 공개처리 됩니다.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    시의원 / 구의원 출마 등록
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    사회복지 공약 작성
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    선거구별 후보자 노출
                  </li>
                </ul>
                <Button asChild className="w-full gap-2">
                  <Link to="/register">
                    6.3 지방선거 출마자 등록하기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Policy Proposal Section */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">

            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-elevated group">
              <CardContent className="p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground mb-6 transition-transform group-hover:scale-110">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">사회복지 관련 정책 제안</h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  사회복지 현장에서 느끼시는 정책적 개선 사항을 제안해주세요. 제안된 정책은 각 후보자의 정책 간담회를 통해 전달하겠습니다.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    사회복지사 정책 제안
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    분야별 정책 아이디어
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    후보자에게 정책 전달
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link to="/policy">
                    사회복지 관련 정책 제안하기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Candidate Search Section */}
      <section className="py-12 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-none shadow-elevated bg-card max-w-3xl mx-auto">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
                  <MapPin className="h-7 w-7" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  내 선거구 후보자 찾기
                </h2>
                <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
                  관리자 승인을 받은 예비후보자들의 정보를 선거구별로 확인하세요.
                  시의원, 구의원 후보자를 한눈에 볼 수 있습니다.
                </p>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/candidates">
                    <MapPin className="h-4 w-4" />
                    후보자 확인하기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            <StatCard number="25" label="서울시 자치구" />
            <StatCard number="112" label="시의원 선거구" />
            <StatCard number="112" label="구의원 선거구" />
          </div>
        </div>
      </section>
    
      {/* 서울시 선거구 지도 */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SeoulMap />
        </div>
      </section>

    </Layout>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center p-6 rounded-2xl bg-card shadow-card">
      <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{number}</p>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export default Index;

import { useState, useEffect, useMemo } from "react";
import { fetchCandidatesFromSheets, type Candidate, calculateAge } from "@/lib/googleSheets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Phone, Mail, Globe, FileText, MapPin, Calendar, Building2, UserCircle, BadgeCheck, Coins } from "lucide-react";

interface District {
  name: string;
}

// 서울시 25개 구 정보 (가나다순 정렬)
const districts: District[] = [
  { name: "강남구" }, { name: "강동구" }, { name: "강북구" },
  { name: "강서구" }, { name: "관악구" }, { name: "광진구" },
  { name: "구로구" }, { name: "금천구" }, { name: "노원구" },
  { name: "도봉구" }, { name: "동대문구" }, { name: "동작구" },
  { name: "마포구" }, { name: "서대문구" }, { name: "서초구" },
  { name: "성동구" }, { name: "성북구" }, { name: "송파구" },
  { name: "양천구" }, { name: "영등포구" }, { name: "용산구" },
  { name: "은평구" }, { name: "종로구" }, { name: "중구" },
  { name: "중랑구" }
];

export function SeoulMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // 후보자 데이터 가져오기
  useEffect(() => {
    async function loadCandidates() {
      setLoading(true);
      try {
        const data = await fetchCandidatesFromSheets();
        setCandidates(data);
      } catch (error) {
        console.error('Failed to load candidates:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, []);

  // 선택된 구의 후보자 필터링
  const filteredCandidates = useMemo(() => {
    if (!selectedDistrict) return [];
    return candidates.filter(candidate => {
       // district에서 구 이름 추출 (예: "강남구가선거구" -> "강남구")
       const candidateGu = candidate.district.replace(/[가-차]선거구$/, '');
       return candidateGu === selectedDistrict && candidate.approved;
    });
  }, [selectedDistrict, candidates]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-card rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          서울시 선거구별 후보자 현황
        </h2>
        
        {/* 구 선택 버튼 그리드 */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
          {districts.map((district) => (
            <button
              key={district.name}
              onClick={() => setSelectedDistrict(district.name)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${selectedDistrict === district.name 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card border-border hover:border-primary hover:bg-primary/10'
                }
              `}
            >
              <div className="text-sm font-medium">{district.name}</div>
            </button>
          ))}
        </div>

        {/* 선택된 구 정보 및 후보자 리스트 */}
        {selectedDistrict ? (
          <div className="bg-secondary/20 rounded-xl p-6 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedDistrict}
            </h3>
            
            {loading ? (
              <div className="text-center py-10">데이터를 불러오는 중입니다...</div>
            ) : filteredCandidates.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <Dialog key={candidate.id}>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group h-full flex flex-col bg-card">
                        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                          {candidate.candidatePhotoUrl ? (
                            <img
                              src={candidate.candidatePhotoUrl}
                              alt={candidate.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                              <User className="h-20 w-20 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            {candidate.councilType === "si" ? "시의원" : "구의원"}
                          </div>
                        </div>
                        
                        <CardHeader className="space-y-1 p-4">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                            {candidate.party && (
                              <span className="text-xs font-medium text-primary px-2 py-1 rounded bg-primary/10">
                                {candidate.party}
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-sm font-medium text-foreground/80">
                            {candidate.district}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 flex-grow p-4 pt-0">
                          {candidate.currentPosition && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {candidate.currentPosition}
                            </p>
                          )}
                          
                          <Button variant="outline" size="sm" className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            상세 정보 보기
                          </Button>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2 flex-wrap">
                          {candidate.name} 후보자 상세 정보
                          {candidate.party && (
                            <span className="text-base font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md text-sm">
                              {candidate.party}
                            </span>
                          )}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-foreground/80 mt-2">
                          {candidate.district} | {candidate.councilType === "si" ? "시의원" : "구의원"} 예비후보
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid md:grid-cols-[300px_1fr] gap-6 py-4">
                        {/* Left Column: Photo & Basic Info */}
                        <div className="space-y-4">
                          <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-muted border">
                            {candidate.candidatePhotoUrl ? (
                              <img
                                src={candidate.candidatePhotoUrl}
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <User className="h-20 w-20 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm p-4 bg-muted/30 rounded-lg">
                             <div className="flex items-center gap-2">
                              <div>{calculateAge(candidate.birthDate)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <div>{candidate.phone}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <div className="break-all">{candidate.email}</div>
                            </div>
                            {candidate.socialMediaUrl && (
                              <div className="pt-2 border-t mt-2">
                                <a 
                                  href={candidate.socialMediaUrl.startsWith('http') ? candidate.socialMediaUrl : `https://${candidate.socialMediaUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:underline font-medium"
                                >
                                  <Globe className="h-4 w-4" />
                                  홈페이지/SNS 방문하기
                                </a>
                              </div>
                            )}
                          </div>
                          
                          {candidate.electionFlyerUrl && (
                            <Button className="w-full" asChild>
                              <a href={candidate.electionFlyerUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                선거공보물 보기
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {/* Right Column: Detailed Info */}
                        <div className="space-y-6">
                           {/* Social Worker Badge */}
                           {candidate.hasSocialWorkerLicense && candidate.hasSocialWorkerLicense !== 'false' && candidate.hasSocialWorkerLicense !== 'none' && (
                              <div className="mb-4">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                  <BadgeCheck className="mr-2 h-5 w-5" />
                                  {candidate.hasSocialWorkerLicense === 'level1' ? '사회복지사 1급' : 
                                   candidate.hasSocialWorkerLicense === 'level2' ? '사회복지사 2급' : '사회복지사 자격 보유'}
                                </span>
                              </div>
                            )}

                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-2 text-primary">
                               <UserCircle className="h-5 w-5" /> 현재 직책/직업
                            </h4>
                            <p className="text-foreground/90 whitespace-pre-wrap pl-1">
                              {candidate.currentPosition || "정보 없음"}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-2 text-primary">
                               <Building2 className="h-5 w-5" /> 주요 경력
                            </h4>
                            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed pl-1 text-sm bg-muted/20 p-3 rounded-md">
                              {candidate.careerSummary || "정보 없음"}
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg flex items-center gap-2 border-b pb-2 text-primary">
                               <FileText className="h-5 w-5" /> 사회복지 관련 공약/정책
                            </h4>
                            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed pl-1 text-sm bg-muted/20 p-3 rounded-md">
                              {candidate.welfarePolicy || "정보 없음"}
                            </p>
                          </div>

                          {(candidate.hasElectionOffice || candidate.hasKickoffEvent) && (
                            <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                              {candidate.hasElectionOffice && (
                                <div className="space-y-1">
                                  <div className="font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> 선거 사무소
                                  </div>
                                  <p className="text-sm pl-6">{candidate.officeAddress}</p>
                                </div>
                              )}
                              {candidate.hasKickoffEvent && (
                                <div className="space-y-1">
                                  <div className="font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> 발대식 일정
                                  </div>
                                  <p className="text-sm pl-6">
                                    {candidate.kickoffEventDate} {candidate.kickoffEventDetails}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                             {candidate.hasPaidMembershipFee && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                회비 납부 완료
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-2">등록된 후보자가 없습니다.</p>
                <p className="text-sm">후보자 등록을 기다리고 있습니다.</p>
                <p className="text-xs mt-4 opacity-70">* 관리자 승인 후 노출된 후보자만 표시됩니다.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary/10 rounded-xl border border-dashed border-border">
            <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">
              원하시는 자치구를 선택하면 후보자 정보를 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

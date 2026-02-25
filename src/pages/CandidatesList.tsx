import { useState, useMemo, useEffect } from "react";
 import { Layout } from "@/components/layout/Layout";
 import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Building2, UserCircle, RefreshCw, Mail, Globe, FileText, Calendar, BadgeCheck, Coins, User } from "lucide-react";
 import { siDistricts, seoulGus } from "@/data/districts";
 import { fetchCandidatesFromSheets, type Candidate, calculateAge, getGoogleDriveViewUrl } from "@/lib/googleSheets";
 
 export default function CandidatesList() {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedGu, setSelectedGu] = useState<string>("all");
   const [councilType, setCouncilType] = useState<"si" | "gu">("si");
   const [candidates, setCandidates] = useState<Candidate[]>([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

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

  // 수동 새로고침 함수
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchCandidatesFromSheets();
      setCandidates(data);
    } catch (error) {
      console.error('Failed to refresh candidates:', error);
    } finally {
      setRefreshing(false);
    }
  };

   const filteredCandidates = useMemo(() => {
      const result = candidates.filter((candidate) => {
        const matchesType = candidate.councilType === councilType;
        const matchesSearch =
          candidate.name.includes(searchTerm) ||
          candidate.district.includes(searchTerm) ||
          candidate.welfarePolicy?.includes(searchTerm);
        
        // district에서 구 이름 추출 (예: "강남구가선거구" -> "강남구")
        const candidateGu = candidate.district.replace(/([가-차]|제\d+)선거구$/, '');
        const matchesGu = selectedGu === "all" || candidateGu === selectedGu;
        
        return matchesType && matchesSearch && matchesGu && candidate.approved;
      });

      // 가나다순 정렬 + 비례대표 맨 뒤로
      return result.sort((a, b) => {
        // 1. 비례대표 체크 (비례대표가 포함된 경우 맨 뒤로)
        const isProportionalA = a.district.includes('비례대표');
        const isProportionalB = b.district.includes('비례대표');
        
        if (isProportionalA && !isProportionalB) return 1;
        if (!isProportionalA && isProportionalB) return -1;
        
        // 2. 자치구명 가나다순 정렬
        const districtCompare = a.district.localeCompare(b.district, 'ko');
        if (districtCompare !== 0) return districtCompare;
        
        // 3. 같은 선거구 내에서는 이름순 정렬
        return a.name.localeCompare(b.name, 'ko');
      });
    }, [searchTerm, selectedGu, councilType, candidates]);
 
   const districts = siDistricts.filter(d => 
     selectedGu === "all" || d.guName === selectedGu
   );
 
   return (
     <Layout>
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">내 선거구 후보자</h1>
                <p className="text-muted-foreground">승인된 예비후보자 정보를 확인하세요</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </Button>
          </div>
        </div>
 
         {/* Council Type Tabs */}
         <Tabs value={councilType} onValueChange={(v) => setCouncilType(v as "si" | "gu")} className="mb-6">
           <TabsList className="grid w-full max-w-md grid-cols-2">
             <TabsTrigger value="si" className="gap-2">
               <Users className="h-4 w-4" />
               시의원
             </TabsTrigger>
             <TabsTrigger value="gu" className="gap-2">
               <Building2 className="h-4 w-4" />
               구의원
             </TabsTrigger>
           </TabsList>
         </Tabs>
 
         {/* Filters */}
         <div className="flex flex-col sm:flex-row gap-4 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="후보자명, 선거구, 공약으로 검색..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10"
             />
           </div>
           <Select value={selectedGu} onValueChange={setSelectedGu}>
             <SelectTrigger className="w-full sm:w-[200px]">
               <SelectValue placeholder="자치구 선택" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">전체 자치구</SelectItem>
                {seoulGus
                  .filter(gu => gu !== "비례대표")
                  .sort((a, b) => a.localeCompare(b, 'ko'))
                  .concat(seoulGus.includes("비례대표") ? ["비례대표"] : [])
                  .map((gu) => (
                  <SelectItem key={gu} value={gu}>
                    {gu}
                  </SelectItem>
                ))}
             </SelectContent>
           </Select>
         </div>
 
         {/* Results */}
         {filteredCandidates.length > 0 ? (
           <div className="space-y-6">
             <p className="text-sm text-muted-foreground">
               총 <span className="font-semibold text-foreground">{filteredCandidates.length}</span>명의 후보자
             </p>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <Dialog key={candidate.id}>
                    <DialogTrigger asChild>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full flex flex-col">
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
                        
                        <CardHeader className="space-y-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">{candidate.name}</CardTitle>
                            {candidate.party && (
                              <span className="text-sm font-medium text-primary px-2 py-1 rounded bg-primary/10">
                                {candidate.party}
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-base font-medium text-foreground/80">
                            {candidate.district}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 flex-grow p-5 pt-0">
                          {candidate.currentPosition && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {candidate.currentPosition}
                            </p>
                          )}
                          
                          <div className="pt-2 flex flex-wrap gap-2">
                            {candidate.hasSocialWorkerLicense && candidate.hasSocialWorkerLicense !== 'false' && candidate.hasSocialWorkerLicense !== 'none' && (
                              <div className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                <BadgeCheck className="h-3 w-3" />
                                {candidate.hasSocialWorkerLicense === 'level1' ? '사회복지사 1급' : 
                                 candidate.hasSocialWorkerLicense === 'level2' ? '사회복지사 2급' : '사회복지사'}
                              </div>
                            )}
                            {candidate.hasPaidMembershipFee && (
                              <div className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                <Coins className="h-3 w-3" />
                                회비납부
                              </div>
                            )}
                          </div>
                          
                          <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
                          
                          <div className="flex flex-col gap-2 text-sm p-4 bg-muted/30 rounded-lg">
                              {/* Age Display */}
                              <div>{calculateAge(candidate.birthDate)}</div>

                              {/* Email Display - Explicitly check for email */}
                              {candidate.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <div className="break-all">{candidate.email}</div>
                                </div>
                              )}
                             
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
                              <a 
                                href={getGoogleDriveViewUrl(candidate.electionFlyerUrl)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                선거공보물 보기
                              </a>
                            </Button>
                          )}
                        </div>
                        
                        {/* Right Column: Detailed Info */}
                        <div className="space-y-6">
                           {/* Social Worker Badge - Moved to top */}
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
                             {/* Removed Social Worker Badge from here */}
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
           </div>
         ) : (
           <div className="text-center py-16">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
               <Users className="h-8 w-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold text-foreground mb-2">
               등록된 후보자가 없습니다
             </h3>
             <p className="text-muted-foreground max-w-md mx-auto">
               {selectedGu !== "all" 
                 ? `${selectedGu}에 등록된 ${councilType === "si" ? "시의원" : "구의원"} 예비후보가 아직 없습니다.`
                 : "아직 승인된 예비후보자가 없습니다. 후보자 등록을 기다려주세요."}
             </p>
           </div>
         )}
 
         {/* District Info */}
         {selectedGu !== "all" && (
           <div className="mt-12">
             <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
               <MapPin className="h-4 w-4 text-primary" />
               {selectedGu} 선거구 정보
             </h2>
             <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
               {districts.map((district) => (
                 <Card key={district.id} className="bg-muted/30">
                   <CardContent className="p-4">
                     <div className="flex items-start justify-between mb-2">
                       <h3 className="font-medium text-foreground text-sm">
                         {district.districtName}
                       </h3>
                       <Badge variant="outline" className="shrink-0 text-xs">
                         정수 {district.seats}
                       </Badge>
                     </div>
                     <p className="text-xs text-muted-foreground">
                       {district.dongs.join(", ")}
                     </p>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
         )}
       </div>
     </Layout>
   );
 }
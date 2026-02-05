 import { useState, useMemo } from "react";
 import { Layout } from "@/components/layout/Layout";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Search, MapPin, Users, Building2, UserCircle } from "lucide-react";
 import { siDistricts, seoulGus } from "@/data/districts";
 
 // Mock data for approved candidates - in real app, this would come from database
 const mockCandidates = [
   {
     id: "1",
     name: "홍길동",
     party: "무소속",
     councilType: "si",
     guName: "종로구",
     districtName: "종로구가선거구",
     welfarePolicy: "노인복지시설 확충 및 돌봄 서비스 강화",
     currentPosition: "사회복지사",
     approved: true,
   },
   {
     id: "2",
     name: "김복지",
     party: "더불어민주당",
     councilType: "gu",
     guName: "강남구",
     districtName: "강남구가선거구",
     welfarePolicy: "청년 주거지원 정책 확대",
     currentPosition: "구의원",
     approved: true,
   },
 ];
 
 export default function CandidatesList() {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedGu, setSelectedGu] = useState<string>("all");
   const [councilType, setCouncilType] = useState<"si" | "gu">("si");
 
   const filteredCandidates = useMemo(() => {
     return mockCandidates.filter((candidate) => {
       const matchesType = candidate.councilType === councilType;
       const matchesSearch =
         candidate.name.includes(searchTerm) ||
         candidate.districtName.includes(searchTerm) ||
         candidate.welfarePolicy?.includes(searchTerm);
       const matchesGu = selectedGu === "all" || candidate.guName === selectedGu;
       return matchesType && matchesSearch && matchesGu && candidate.approved;
     });
   }, [searchTerm, selectedGu, councilType]);
 
   const districts = siDistricts.filter(d => 
     selectedGu === "all" || d.guName === selectedGu
   );
 
   return (
     <Layout>
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Header */}
         <div className="mb-8">
           <div className="flex items-center gap-3 mb-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
               <MapPin className="h-6 w-6" />
             </div>
             <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-foreground">내 선거구 후보자</h1>
               <p className="text-muted-foreground">승인된 예비후보자 정보를 확인하세요</p>
             </div>
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
               {seoulGus.map((gu) => (
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
                 <Card key={candidate.id} className="hover:shadow-card transition-shadow">
                   <CardContent className="p-5">
                     <div className="flex items-start gap-4">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                         <UserCircle className="h-6 w-6" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                           <Badge variant="secondary" className="text-xs">
                             {candidate.party}
                           </Badge>
                         </div>
                         <p className="text-sm text-muted-foreground mb-2">
                           {candidate.districtName}
                         </p>
                         {candidate.currentPosition && (
                           <p className="text-xs text-muted-foreground mb-2">
                             {candidate.currentPosition}
                           </p>
                         )}
                         {candidate.welfarePolicy && (
                           <p className="text-sm text-foreground/80 line-clamp-2">
                             📋 {candidate.welfarePolicy}
                           </p>
                         )}
                       </div>
                     </div>
                   </CardContent>
                 </Card>
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
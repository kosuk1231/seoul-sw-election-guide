 import { useState, useMemo } from "react";
 import { Layout } from "@/components/layout/Layout";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Search, MapPin, Users } from "lucide-react";
 import { siDistricts, seoulGus } from "@/data/districts";
 
 export default function CandidatesSi() {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedGu, setSelectedGu] = useState<string>("all");
 
   const filteredDistricts = useMemo(() => {
     return siDistricts.filter((district) => {
       const matchesSearch =
         district.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         district.dongs.some((dong) =>
           dong.toLowerCase().includes(searchTerm.toLowerCase())
         );
       const matchesGu = selectedGu === "all" || district.guName === selectedGu;
       return matchesSearch && matchesGu;
     });
   }, [searchTerm, selectedGu]);
 
   const groupedDistricts = useMemo(() => {
     const groups: Record<string, typeof filteredDistricts> = {};
     filteredDistricts.forEach((district) => {
       if (!groups[district.guName]) {
         groups[district.guName] = [];
       }
       groups[district.guName].push(district);
     });
     return groups;
   }, [filteredDistricts]);
 
   return (
     <Layout>
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Header */}
         <div className="mb-8">
           <div className="flex items-center gap-3 mb-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
               <Users className="h-6 w-6" />
             </div>
             <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-foreground">시의원 선거구</h1>
               <p className="text-muted-foreground">서울특별시의회 의원 선거구 현황</p>
             </div>
           </div>
         </div>
 
         {/* Filters */}
         <div className="flex flex-col sm:flex-row gap-4 mb-8">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="선거구명 또는 동 이름으로 검색..."
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
 
         {/* Results count */}
         <p className="text-sm text-muted-foreground mb-6">
           총 <span className="font-semibold text-foreground">{filteredDistricts.length}</span>개 선거구
         </p>
 
         {/* Districts Grid */}
         <div className="space-y-8">
           {Object.entries(groupedDistricts).map(([guName, districts]) => (
             <div key={guName}>
               <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-primary" />
                 {guName}
                 <Badge variant="secondary" className="ml-2">
                   {districts.length}개 선거구
                 </Badge>
               </h2>
               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                 {districts.map((district) => (
                   <Card key={district.id} className="hover:shadow-card transition-shadow">
                     <CardContent className="p-5">
                       <div className="flex items-start justify-between mb-3">
                         <h3 className="font-semibold text-foreground">
                           {district.districtName}
                         </h3>
                         <Badge variant="outline" className="shrink-0">
                           정수 {district.seats}명
                         </Badge>
                       </div>
                       <div className="flex flex-wrap gap-1.5">
                         {district.dongs.map((dong) => (
                           <span
                             key={dong}
                             className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs"
                           >
                             {dong}
                           </span>
                         ))}
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
           ))}
         </div>
 
         {filteredDistricts.length === 0 && (
           <div className="text-center py-12">
             <p className="text-muted-foreground">검색 결과가 없습니다.</p>
           </div>
         )}
       </div>
     </Layout>
   );
 }
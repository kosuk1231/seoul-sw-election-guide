 import { useState } from "react";
 import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/FileUpload";
import { validateImageFile, validateFlyerFile } from "@/lib/fileUpload";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Checkbox } from "@/components/ui/checkbox";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { UserPlus, Send, CheckCircle2, AlertCircle } from "lucide-react";
 import { useToast } from "@/hooks/use-toast";
 import { seoulGus, siDistricts } from "@/data/districts";
import { submitCandidateToSheets } from "@/lib/googleSheets";
 
 const councilTypes = [
   { value: "si", label: "시의원" },
   { value: "gu", label: "구의원" },
 ];
 
 export default function CandidateRegister() {
   const { toast } = useToast();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [agreedToTerms, setAgreedToTerms] = useState(false);
   const [selectedGu, setSelectedGu] = useState("");
   const [formData, setFormData] = useState({
     name: "",
     birthDate: "",
     phone: "",
     email: "",
     councilType: "",
     district: "",
     party: "",
     currentPosition: "",
     careerSummary: "",
     welfarePolicy: "",
     socialMediaUrl: "",
     hasSocialWorkerLicense: "",
     hasPaidMembershipFee: "",
     hasElectionOffice: "",
     electionOfficeAddress: "",
     hasKickoffEvent: "",
     kickoffEventDate: "",
     kickoffEventDetails: "",
    candidatePhoto: null as { base64: string; mimeType: string; extension: string } | null,
    electionFlyer: null as { base64: string; mimeType: string; extension: string } | null,
   });
 
   const handleChange = (field: string, value: string) => {
     setFormData((prev) => ({ ...prev, [field]: value }));
   };


  const handleFileChange = (field: string, fileData: { base64: string; mimeType: string; extension: string } | null) => {
    setFormData((prev) => ({ ...prev, [field]: fileData }));
  };
 
   const availableDistricts = siDistricts.filter(d => d.guName === selectedGu);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!agreedToTerms) {
       toast({
         title: "개인정보 수집 동의 필요",
         description: "개인정보 수집 및 이용에 동의해주세요.",
         variant: "destructive",
       });
       return;
     }
 
     if (!formData.name || !formData.birthDate || !formData.phone || !formData.email || !formData.councilType || !formData.district || !formData.hasSocialWorkerLicense || !formData.hasPaidMembershipFee || !formData.hasElectionOffice) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "이름, 생년, 연락처, 이메일, 출마 유형, 선거구, 자격증 유무, 회비 납부 여부, 선거 사무소 여부는 필수입니다.",
        variant: "destructive",
      });
      return;
    }
 
     setIsSubmitting(true);
 
     try {
       await submitCandidateToSheets(formData, agreedToTerms);
      
       setIsSubmitted(true);
       toast({
         title: "정상적으로 등록되었습니다",
         description: "내용을 확인 후 관리자가 등록할 예정입니다.",
       });
       
       // 폼 초기화
       setFormData({
         name: "",
         birthDate: "",
         phone: "",
         email: "",
         councilType: "",
         district: "",
         party: "",
         currentPosition: "",
         careerSummary: "",
         welfarePolicy: "",
         socialMediaUrl: "",
         hasSocialWorkerLicense: "",
         hasPaidMembershipFee: "",
         hasElectionOffice: "",
         electionOfficeAddress: "",
         hasKickoffEvent: "",
         kickoffEventDate: "",
         kickoffEventDetails: "",
         candidatePhoto: null,
         electionFlyer: null,
       });
       setAgreedToTerms(false);
       setSelectedGu("");
     } catch (error) {
       console.error('제출 오류:', error);
      toast({
        title: "오류가 발생했습니다",
        description: error instanceof Error ? error.message : "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
     } finally {
       setIsSubmitting(false);
     }
   };
 
   if (isSubmitted) {
     return (
       <Layout>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
           <div className="max-w-md mx-auto text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground mx-auto mb-6">
               <CheckCircle2 className="h-8 w-8" />
             </div>
             <h1 className="text-2xl font-bold text-foreground mb-4">
               예비후보 등록이 완료되었습니다
             </h1>
             <p className="text-muted-foreground mb-8">
               등록해주신 정보를 확인 후 연락드리겠습니다.
               사회복지 정책에 관심 가져주셔서 감사합니다.
             </p>
             <Button onClick={() => {
               setIsSubmitted(false);
               setFormData({
                 name: "",
                 birthDate: "",
                 phone: "",
                 email: "",
                 councilType: "",
                 district: "",
                 party: "",
                 currentPosition: "",
                 careerSummary: "",
                 welfarePolicy: "",
                 socialMediaUrl: "",
                 hasSocialWorkerLicense: "",
                 hasPaidMembershipFee: "",
                 hasElectionOffice: "",
                 electionOfficeAddress: "",
                 hasKickoffEvent: "",
                 kickoffEventDate: "",
                 kickoffEventDetails: "",
                 candidatePhoto: null,
                 electionFlyer: null,
               });
               setAgreedToTerms(false);
             }}>
               처음으로
             </Button>
           </div>
         </div>
       </Layout>
     );
   }
 
   return (
     <Layout>
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
         {/* Header */}
         <div className="max-w-2xl mx-auto mb-8">
           <div className="flex items-center gap-3 mb-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
               <UserPlus className="h-6 w-6" />
             </div>
             <div>
               <h1 className="text-2xl sm:text-3xl font-bold text-foreground">6.3 지방선거 출마자 등록</h1>
               <p className="text-muted-foreground">2026년 6월 3일 서울 지방선거 출마자 정보 등록</p>
             </div>
           </div>
           
           <div className="bg-secondary/50 rounded-lg p-4 flex gap-3">
             <AlertCircle className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
             <div className="text-sm text-secondary-foreground">
               <p className="font-medium mb-1">예비후보 등록 안내</p>
               <p>등록하신 정보는 검증 절차를 거쳐 웹사이트에 게재됩니다. 정확한 정보를 입력해주세요.</p>
             </div>
           </div>
         </div>
 
         {/* Form */}
         <Card className="max-w-2xl mx-auto">
           <CardHeader>
             <CardTitle>예비후보 등록서</CardTitle>
             <CardDescription>* 표시는 필수 입력 항목입니다</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSubmit} className="space-y-6">
               {/* Personal Info */}
               <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-foreground border-b pb-2">기본 정보</h3>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="name">성명 *</Label>
                     <Input
                       id="name"
                       placeholder="홍길동"
                       value={formData.name}
                       onChange={(e) => handleChange("name", e.target.value)}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                    <Label htmlFor="birthDate">생년월일 (YYMMDD)</Label>
                    <Input
                      id="birthDate"
                      type="text"
                      placeholder="901111"
                      value={formData.birthDate}
                      onChange={(e) => handleChange("birthDate", e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>
                 </div>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="phone">연락처 *</Label>
                     <Input
                       id="phone"
                       placeholder="010-0000-0000"
                       value={formData.phone}
                       onChange={(e) => handleChange("phone", e.target.value)}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email">이메일 *</Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="example@email.com"
                       value={formData.email}
                       onChange={(e) => handleChange("email", e.target.value)}
                       required
                     />
                   </div>
                 </div>
               </div>

               {/* Social Worker Info */}
               <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-foreground border-b pb-2">사회복지사 정보</h3>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="hasSocialWorkerLicense">사회복지사 자격증 유무 *</Label>
                     <Select value={formData.hasSocialWorkerLicense} onValueChange={(value) => handleChange("hasSocialWorkerLicense", value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="선택" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="none">없음</SelectItem>
                         <SelectItem value="level1">1급</SelectItem>
                         <SelectItem value="level2">2급</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="hasPaidMembershipFee">서울시사회복지사협회 회비 납부 여부(2026년 포함) *</Label>
                     <Select value={formData.hasPaidMembershipFee} onValueChange={(value) => handleChange("hasPaidMembershipFee", value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="선택" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="yes">납부</SelectItem>
                         <SelectItem value="no">미납</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
               </div>
 
               {/* Election Info */}
               <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-foreground border-b pb-2">출마 정보</h3>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="councilType">출마 유형 *</Label>
                     <Select value={formData.councilType} onValueChange={(value) => handleChange("councilType", value)}>
                       <SelectTrigger>
                         <SelectValue placeholder="선택" />
                       </SelectTrigger>
                       <SelectContent>
                         {councilTypes.map((type) => (
                           <SelectItem key={type.value} value={type.value}>
                             {type.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="party">소속 정당</Label>
                     <Input
                       id="party"
                       placeholder="무소속 또는 정당명"
                       value={formData.party}
                       onChange={(e) => handleChange("party", e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                     <Label htmlFor="gu">자치구 *</Label>
                     <Select value={selectedGu} onValueChange={(value) => {
                       setSelectedGu(value);
                       handleChange("district", "");
                     }}>
                       <SelectTrigger>
                         <SelectValue placeholder="자치구 선택" />
                       </SelectTrigger>
                       <SelectContent>
                         {seoulGus.map((gu) => (
                           <SelectItem key={gu} value={gu}>
                             {gu}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="district">선거구 *</Label>
                     <Select 
                       value={formData.district} 
                       onValueChange={(value) => handleChange("district", value)}
                       disabled={!selectedGu}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder={selectedGu ? "선거구 선택" : "자치구를 먼저 선택하세요"} />
                       </SelectTrigger>
                       <SelectContent>
                         {availableDistricts.map((d) => (
                           <SelectItem key={d.id} value={d.districtName}>
                             {d.districtName}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
               </div>
 
               {/* Career Info */}
               <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-foreground border-b pb-2">경력 및 정책</h3>
                 <div className="space-y-2">
                   <Label htmlFor="currentPosition">현재 직책/직업</Label>
                   <Input
                     id="currentPosition"
                     placeholder="현재 직책 또는 직업"
                     value={formData.currentPosition}
                     onChange={(e) => handleChange("currentPosition", e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="careerSummary">주요 경력</Label>
                   <Textarea
                     id="careerSummary"
                     placeholder="주요 경력사항을 간략히 작성해주세요."
                     rows={3}
                     value={formData.careerSummary}
                     onChange={(e) => handleChange("careerSummary", e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="welfarePolicy">사회복지 관련 공약/정책</Label>
                   <Textarea
                     id="welfarePolicy"
                     placeholder="사회복지와 관련하여 추진하고자 하는 정책이나 공약을 작성해주세요."
                     rows={4}
                     value={formData.welfarePolicy}
                     onChange={(e) => handleChange("welfarePolicy", e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="socialMediaUrl">홈페이지/SNS 주소</Label>
                   <Input
                     id="socialMediaUrl"
                     placeholder="https://"
                     value={formData.socialMediaUrl}
                     onChange={(e) => handleChange("socialMediaUrl", e.target.value)}
                   />
                 </div>
               </div>

               {/* Election Office Info */}
               <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-foreground border-b pb-2">선거 사무소</h3>
                 <div className="space-y-2">
                   <Label htmlFor="hasElectionOffice">선거 사무소 여부 *</Label>
                   <Select value={formData.hasElectionOffice} onValueChange={(value) => {
                     handleChange("hasElectionOffice", value);
                     if (value === "no") {
                       handleChange("electionOfficeAddress", "");
                     }
                   }}>
                     <SelectTrigger>
                       <SelectValue placeholder="선택" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="yes">있음</SelectItem>
                       <SelectItem value="no">없음</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 {formData.hasElectionOffice === "yes" && (
                   <div className="space-y-2">
                     <Label htmlFor="electionOfficeAddress">선거 사무소 주소</Label>
                     <Input
                       id="electionOfficeAddress"
                       placeholder="서울시 OO구 OO동 OO번지"
                       value={formData.electionOfficeAddress}
                       onChange={(e) => handleChange("electionOfficeAddress", e.target.value)}
                     />
                   </div>
                 )}
               </div>

                {/* Kickoff Event Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground border-b pb-2">향후 일정</h3>
                  <div className="space-y-2">
                    <Label htmlFor="hasKickoffEvent">발대식 유무</Label>
                    <Select value={formData.hasKickoffEvent} onValueChange={(value) => {
                      handleChange("hasKickoffEvent", value);
                      if (value === "no") {
                        handleChange("kickoffEventDate", "");
                        handleChange("kickoffEventDetails", "");
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">있음</SelectItem>
                        <SelectItem value="no">없음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.hasKickoffEvent === "yes" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="kickoffEventDate">발대식 날짜</Label>
                        <Input
                          id="kickoffEventDate"
                          type="date"
                          value={formData.kickoffEventDate}
                          onChange={(e) => handleChange("kickoffEventDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="kickoffEventDetails">발대식 세부 정보</Label>
                        <Input
                          id="kickoffEventDetails"
                          placeholder="시간, 장소 등"
                          value={formData.kickoffEventDetails}
                          onChange={(e) => handleChange("kickoffEventDetails", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 후보자 사진 및 선거공보물 업로드 */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">후보자 사진 및 선거공보물 등록</h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FileUpload
                      label="후보자 사진"
                      accept=".jpg,.jpeg,.png,.webp"
                      onFileSelect={(fileData) => handleFileChange("candidatePhoto", fileData)}
                      validateFile={validateImageFile}
                      preview={true}
                    />
                    
                    <FileUpload
                      label="선거공보물"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      onFileSelect={(fileData) => handleFileChange("electionFlyer", fileData)}
                      validateFile={validateFlyerFile}
                      preview={true}
                    />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    * 후보자 사진과 선거공보물은 선택사항입니다. 이미지는 JPG, PNG, WebP 형식만 가능하며, 공보물은 PDF도 업로드 가능합니다.
                  </p>
                </div>
 
               {/* Agreement */}
               <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-start space-x-3">
                   <Checkbox 
                     id="terms" 
                     checked={agreedToTerms}
                     onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                   />
                   <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                     개인정보 수집 및 이용에 동의합니다. 수집된 정보는 예비후보 검증 및 웹사이트 게재 목적으로만 사용되며, 
                     선거 종료 후 파기됩니다.
                   </label>
                 </div>
               </div>
 
               <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                 {isSubmitting ? (
                   "등록 중..."
                 ) : (
                   <>
                     <Send className="h-4 w-4" />
                     예비후보 등록 신청
                   </>
                 )}
               </Button>
             </form>
           </CardContent>
         </Card>
       </div>
     </Layout>
   );
 }
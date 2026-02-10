import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitPolicyToSheets } from "@/lib/googleSheets";

const policyCategories = [
 "임금(임금체계 등)",
 "복리후생",
 "경력인정 및 승급",
 "고용(인력증원 등)",
 "휴가",
 "안전과 인권",
 "일가정양립 등",
 "대시민복지정책",
 "기타",
];

export default function PolicyProposal() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    category: "",
    title: "",
    currentIssue: "",
    proposedSolution: "",
    expectedEffect: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!agreedToTerms) {
      toast({
        title: "개인정보 수집 동의 필요",
        description: "개인정보 수집 및 이용에 동의해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.category || !formData.title || !formData.currentIssue || !formData.proposedSolution) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "이름, 이메일, 분야, 제목, 현황, 제안 내용은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Here we would typically send to Google Sheets via Apps Script
    // For now, we'll simulate the submission
    try {
      await submitPolicyToSheets(formData);
     
      setIsSubmitted(true);
      toast({
        title: "정상적으로 등록되었습니다",
        description: "정책 제언에 감사합니다.",
      });
      
      // 폼 초기화
      setFormData({
        name: "",
        organization: "",
        email: "",
        phone: "",
        category: "",
        title: "",
        currentIssue: "",
        proposedSolution: "",
        expectedEffect: "",
      });
      setAgreedToTerms(false);
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
              정상적으로 등록되었습니다
            </h1>
            <p className="text-muted-foreground mb-8">
              정책 제안에 감사합니다.
            </p>
            <Button onClick={() => {
              setIsSubmitted(false);
              setAgreedToTerms(false);
            }}>
              새로운 제안하기
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">사회복지 관련 정책 제안</h1>
             <p className="text-muted-foreground">사회복지 현장의 목소리를 들려주세요</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            사회복지 현장에서 느끼시는 정책적 개선 사항이나 아이디어를 제안해주세요.
            제안해주신 내용은 후보자들에게 전달되어 정책 개발에 활용됩니다.
          </p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>정책 제안서</CardTitle>
            <CardDescription>* 표시는 필수 입력 항목입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">제안자 정보</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">소속 기관</Label>
                    <Input
                      id="organization"
                      placeholder="OO복지관"
                      value={formData.organization}
                      onChange={(e) => handleChange("organization", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Policy Proposal */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">정책 제안 내용</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">정책 분야 *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="분야 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {policyCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">정책 제목 *</Label>
                    <Input
                      id="title"
                      placeholder="제안하시는 정책의 제목"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentIssue">현황 및 문제점 *</Label>
                  <Textarea
                    id="currentIssue"
                    placeholder="현재 현장에서 겪고 있는 문제점이나 개선이 필요한 상황을 설명해주세요."
                    rows={4}
                    value={formData.currentIssue}
                    onChange={(e) => handleChange("currentIssue", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedSolution">정책 제안 내용 *</Label>
                  <Textarea
                    id="proposedSolution"
                    placeholder="문제 해결을 위해 제안하시는 구체적인 정책 내용을 작성해주세요."
                    rows={4}
                    value={formData.proposedSolution}
                    onChange={(e) => handleChange("proposedSolution", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedEffect">기대 효과</Label>
                  <Textarea
                    id="expectedEffect"
                    placeholder="이 정책이 시행되면 기대되는 효과를 작성해주세요."
                    rows={3}
                    value={formData.expectedEffect}
                    onChange={(e) => handleChange("expectedEffect", e.target.value)}
                  />
                </div>
              </div>

              {/* Agreement */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="policy-terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label htmlFor="policy-terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    개인정보 수집 및 이용에 동의합니다. 수집된 정보는 정책 제안 검토 및 결과 회신 목적으로만 사용되며, 
                    선거 종료 후 파기됩니다.
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  "제출 중..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    정책 제안 제출
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
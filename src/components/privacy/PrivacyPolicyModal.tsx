import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PrivacyPolicyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline">
          개인정보처리방침
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>개인정보 처리방침</DialogTitle>
          <DialogDescription>
            2026 서울 지방선거 사회복지 정책 플랫폼의 개인정보 처리방침입니다.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-foreground">
            <section className="space-y-2">
              <h3 className="font-semibold text-lg">1. 개인정보의 처리 목적</h3>
              <p>
                본 플랫폼은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>예비후보자 등록 및 관리: 본인 확인, 출마 자격 확인(사회복지사 자격 등), 등록 의사 확인, 등록 횟수 제한 등</li>
                <li>정책 제안 관리: 정책 제안 접수, 검토 결과 회신, 중복 제안 방지 등</li>
                <li>서비스 제공: 후보자 정보 게시, 정책 제안 게시 등</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">2. 개인정보의 처리 및 보유 기간</h3>
              <p>
                본 플랫폼은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>보유 기간: 2026년 6월 3일 지방선거 종료 후 1개월 이내 파기</li>
                <li>단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지 보유할 수 있습니다.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">3. 처리하는 개인정보의 항목</h3>
              <p>본 플랫폼은 다음의 개인정보 항목을 처리하고 있습니다.</p>
              <div className="space-y-2 mt-2">
                <p className="font-medium">[예비후보자 등록]</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>필수항목: 성명, 생년월일, 연락처, 이메일, 정당, 선거구, 자격증 보유 현황</li>
                  <li>선택항목: 현직, 경력, 공약, 사진, 선거공보물</li>
                </ul>
              </div>
              <div className="space-y-2 mt-2">
                <p className="font-medium">[정책 제안]</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>필수항목: 성명, 이메일</li>
                  <li>선택항목: 연락처, 소속</li>
                </ul>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">4. 개인정보의 제3자 제공</h3>
              <p>
                본 플랫폼은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">5. 정보주체의 권리·의무 및 그 행사방법</h3>
              <p>
                정보주체는 본 플랫폼에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 이에 대해 지체 없이 조치하겠습니다.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">6. 개인정보의 파기</h3>
              <p>
                본 플랫폼은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-lg">7. 개인정보 보호책임자</h3>
              <p>본 플랫폼은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>책임자: 서울특별시사회복지사협회 사무처</li>
                <li>연락처: 서울특별시사회복지사협회 대표 번호</li>
              </ul>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

 import { Vote, Heart } from "lucide-react";
 import { Link } from "react-router-dom";
 
 export function Footer() {
   return (
     <footer className="border-t border-border bg-card/50">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="grid gap-8 md:grid-cols-3">
           {/* Logo and Description */}
           <div className="space-y-4">
             <Link to="/" className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                 <Vote className="h-5 w-5" />
               </div>
               <div>
                 <p className="text-base font-semibold text-foreground">2026 서울 지방선거</p>
                 <p className="text-sm text-muted-foreground">사회복지 정책 플랫폼</p>
               </div>
             </Link>
             <p className="text-sm text-muted-foreground leading-relaxed">
               서울시민과 사회복지 현장을 연결하는 시민 참여 플랫폼입니다.
               모든 시민의 목소리가 정책에 반영될 수 있도록 함께 만들어갑니다.
             </p>
           </div>
 
           {/* Quick Links */}
           <div className="space-y-4">
             <h4 className="text-sm font-semibold text-foreground">바로가기</h4>
             <div className="flex flex-col gap-2">
               <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                 예비후보 등록
               </Link>
              <Link to="/policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                정책 제안하기
              </Link>
              <Link to="/candidates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                내 선거구 후보자 보기
              </Link>
             </div>
           </div>
 
           {/* Contact */}
           <div className="space-y-4">
             <h4 className="text-sm font-semibold text-foreground">운영</h4>
             <div className="space-y-2 text-sm text-muted-foreground">
               <p>서울특별시사회복지사협회</p>
             </div>
           </div>
         </div>
 
         <div className="mt-12 pt-8 border-t border-border">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="text-xs text-muted-foreground">
               © 2026 서울특별시사회복지사협회. 모든 권리 보유.
             </p>
              <p className="text-xs text-muted-foreground">
                서울사회복지사의 목소리가 정책이 됩니다
              </p>
           </div>
         </div>
       </div>
     </footer>
   );
 }
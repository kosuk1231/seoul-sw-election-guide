 import { useState } from "react";
 import { Link, useLocation } from "react-router-dom";
import { Menu, X, Vote, FileText, UserPlus, MapPin } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { cn } from "@/lib/utils";
 
 const navigation = [
   { name: "홈", href: "/", icon: Vote },
   { name: "예비후보 등록", href: "/register", icon: UserPlus },
  { name: "정책 제안", href: "/policy", icon: FileText },
  { name: "내 선거구 후보자", href: "/candidates", icon: MapPin },
 ];
 
 export function Header() {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const location = useLocation();
 
   return (
     <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
       <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex h-16 items-center justify-between">
           {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="서울사회복지사협회 로고" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">서울사회사회복지사 6.3 지방선거 플랫폼</p>
              </div>
            </Link>
 
           {/* Desktop Navigation */}
           <div className="hidden md:flex md:items-center md:gap-1">
             {navigation.map((item) => {
               const isActive = location.pathname === item.href;
               return (
                 <Link
                   key={item.name}
                   to={item.href}
                   className={cn(
                     "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                     isActive
                       ? "bg-primary/10 text-primary"
                       : "text-muted-foreground hover:text-foreground hover:bg-muted"
                   )}
                 >
                   {item.name}
                 </Link>
               );
             })}
           </div>
 
           {/* Mobile menu button */}
           <Button
             variant="ghost"
             size="icon"
             className="md:hidden"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
           >
             {mobileMenuOpen ? (
               <X className="h-5 w-5" />
             ) : (
               <Menu className="h-5 w-5" />
             )}
           </Button>
         </div>
 
         {/* Mobile Navigation */}
         {mobileMenuOpen && (
           <div className="md:hidden py-4 border-t border-border animate-slide-down">
             <div className="flex flex-col gap-1">
               {navigation.map((item) => {
                 const Icon = item.icon;
                 const isActive = location.pathname === item.href;
                 return (
                   <Link
                     key={item.name}
                     to={item.href}
                     onClick={() => setMobileMenuOpen(false)}
                     className={cn(
                       "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                       isActive
                         ? "bg-primary/10 text-primary"
                         : "text-muted-foreground hover:text-foreground hover:bg-muted"
                     )}
                   >
                     <Icon className="h-4 w-4" />
                     {item.name}
                   </Link>
                 );
               })}
             </div>
           </div>
         )}
       </nav>
     </header>
   );
 }
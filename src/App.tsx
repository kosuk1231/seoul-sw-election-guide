import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CandidatesSi from "./pages/CandidatesSi";
import CandidatesGu from "./pages/CandidatesGu";
import PolicyProposal from "./pages/PolicyProposal";
import CandidateRegister from "./pages/CandidateRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/candidates/si" element={<CandidatesSi />} />
          <Route path="/candidates/gu" element={<CandidatesGu />} />
          <Route path="/policy" element={<PolicyProposal />} />
          <Route path="/register" element={<CandidateRegister />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

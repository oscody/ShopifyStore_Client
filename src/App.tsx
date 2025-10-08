import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import Store from "@/pages/store";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import { ViewMode } from "@/lib/types";

function Router() {
  const [currentView, setCurrentView] = useState<ViewMode>('store');

  return (
    <>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <Switch>
        <Route path="/" component={() => currentView === 'store' ? <Store /> : <Admin />} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import Store from "@/pages/store";
import Collections from "@/pages/collections";
import Admin from "@/pages/admin";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";
import { ViewMode } from "@/lib/types";

function Router() {
  const [currentView, setCurrentView] = useState<ViewMode>("store");
  const [, setLocation] = useLocation();

  // Handle navigation between store and admin views
  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    if (view === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/");
    }
  };

  return (
    <>
      <Navigation currentView={currentView} onViewChange={handleViewChange} />
      <Switch>
        <Route path="/" component={Store} />
        <Route path="/admin" component={Admin} />
        <Route path="/collections" component={Collections} />
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

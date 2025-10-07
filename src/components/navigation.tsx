import { ViewMode } from "@/lib/types";

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => onViewChange('store')}
        data-testid="button-store-view"
        className={`px-4 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 transition-all ${
          currentView === 'store'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'
        }`}
      >
        <i className="fas fa-store mr-2"></i>Store View
      </button>
      <button
        onClick={() => onViewChange('admin')}
        data-testid="button-admin-view"
        className={`px-4 py-2 rounded-lg font-medium shadow-lg hover:opacity-90 transition-all ${
          currentView === 'admin'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'
        }`}
      >
        <i className="fas fa-user-shield mr-2"></i>Admin Panel
      </button>
    </div>
  );
}

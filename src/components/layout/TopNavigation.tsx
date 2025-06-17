
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { User, Settings } from "lucide-react";

export function TopNavigation() {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">StockMind</h1>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Home</a>
            <a href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Dashboard</a>
            <a href="/ai-chat" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">AI Chat</a>
            <a href="/watchlist" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Watchlist</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-blue-600 text-white hover:bg-blue-700">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

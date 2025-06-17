
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { User, Settings } from "lucide-react";

export function TopNavigation() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-gray-900">StockMind</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</a>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Dashboard</a>
            <a href="/ai-chat" className="text-gray-600 hover:text-gray-900 text-sm font-medium">AI Chat</a>
            <a href="/watchlist" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Watchlist</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Settings className="w-4 h-4" />
          </Button>
          <Button size="icon" className="bg-blue-600 text-white hover:bg-blue-700 w-8 h-8 rounded-full">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

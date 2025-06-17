
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function AISearchBox() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ask AI Anything</h2>
      <div className="flex space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="What would you like to know about the markets?"
            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
          Ask
        </Button>
      </div>
    </div>
  );
}

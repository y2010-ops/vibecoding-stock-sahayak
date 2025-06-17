
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AISearchBox() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ask AI Anything</h2>
      <div className="flex space-x-3">
        <Input 
          placeholder=""
          className="flex-1 border-slate-200 dark:border-slate-700"
        />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg">
          Ask
        </Button>
      </div>
    </div>
  );
}

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm">
      <div className="w-full max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search for guests, rooms, or services..."
            className="pl-10 bg-white border-transparent shadow-sm focus:border-indigo-100 focus:ring-2 focus:ring-indigo-100 rounded-xl h-11 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <Button variant="ghost" size="icon" className="relative hover:bg-white/50 rounded-xl h-10 w-10">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-gray-50"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
             <div className="text-sm font-bold text-gray-900">John Doe</div>
             <div className="text-xs text-gray-500">General Manager</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeTab: 'all' | 'users' | 'posts';
  onTabChange: (tab: 'all' | 'users' | 'posts') => void;
}

export default function SearchHeader({ 
  searchQuery, 
  onSearchChange, 
  activeTab, 
  onTabChange 
}: SearchHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg">
      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users and posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 rounded-xl"
            autoFocus
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'users', label: 'Users' },
          { key: 'posts', label: 'Posts' }
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "outline"}
            size="sm"
            onClick={() => onTabChange(key as 'all' | 'users' | 'posts')}
            className={`whitespace-nowrap border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
              activeTab === key 
                ? 'shadow-lg hover:shadow-xl' 
                : 'border-2 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpertFiltersProps {
  selectedSector: string;
  onSectorChange: (value: string) => void;
  selectedExpertType: string;
  onExpertTypeChange: (value: string) => void;
}

const sectors = [
  { value: "all", label: "All Sectors" },
  { value: "financial", label: "Financial" },
  { value: "technology", label: "Technology" },
  { value: "energy", label: "Energy" },
  { value: "healthcare", label: "Healthcare" },
  { value: "industrials", label: "Industrials" },
  { value: "consumer", label: "Consumer Goods" },
  { value: "materials", label: "Materials" },
  { value: "utilities", label: "Utilities" }
];

const expertTypes = [
  { value: "all", label: "All Types" },
  { value: "individual", label: "Individual" },
  { value: "broker", label: "Broker Firms" },
  { value: "corporate", label: "Corporate Insider" }
];

export default function ExpertFilters({
  selectedSector,
  onSectorChange,
  selectedExpertType,
  onExpertTypeChange
}: ExpertFiltersProps) {
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b-2 border-gray-200/50 shadow-lg z-20">
      <div className="px-4 py-3">
        <div className="flex gap-2">
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger className="h-8 text-xs bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedExpertType} onValueChange={onExpertTypeChange}>
            <SelectTrigger className="h-8 text-xs bg-white/70 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {expertTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
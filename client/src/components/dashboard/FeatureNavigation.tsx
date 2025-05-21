import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Define feature types for our top navigation
type FeatureType = "watchlist" | "analytics" | "debate" | "quiz" | "news";

interface FeatureNavigationProps {
  activeFeature: FeatureType;
  onFeatureSelect: (feature: FeatureType) => void;
}

const FeatureNavigation = ({ activeFeature, onFeatureSelect }: FeatureNavigationProps) => {
  const features = [
    { id: "watchlist" as FeatureType, icon: "bookmark", label: "Watchlist" },
    { id: "analytics" as FeatureType, icon: "analytics", label: "Analytics" },
    { id: "debate" as FeatureType, icon: "forum", label: "Debate" },
    { id: "quiz" as FeatureType, icon: "quiz", label: "Quiz" },
    { id: "news" as FeatureType, icon: "feed", label: "News" },
  ];

  return (
    <ScrollArea className="w-full px-4 py-3">
      <div className="flex space-x-6">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="ghost"
            className="flex flex-col items-center px-0 py-2 h-auto space-y-1 min-w-[64px] click-bounce feature-btn"
            onClick={() => onFeatureSelect(feature.id)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                activeFeature === feature.id ? "bg-primary scale-105" : "bg-gray-100 hover:scale-110"
              }`}
            >
              <span
                className={`material-icons ${
                  activeFeature === feature.id ? "text-white" : "text-gray-700"
                }`}
              >
                {feature.icon}
              </span>
            </div>
            <span
              className={`text-xs transition-colors duration-300 ${
                activeFeature === feature.id ? "text-primary font-medium" : "text-gray-700"
              }`}
            >
              {feature.label}
            </span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FeatureNavigation;

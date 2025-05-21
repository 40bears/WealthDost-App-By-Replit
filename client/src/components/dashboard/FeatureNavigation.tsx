import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Define feature types for our top navigation
type FeatureType = "home" | "watchlist" | "debate" | "quiz" | "tribe" | "ask-expert";

interface FeatureNavigationProps {
  activeFeature: FeatureType;
  onFeatureSelect: (feature: FeatureType) => void;
}

const FeatureNavigation = ({ activeFeature, onFeatureSelect }: FeatureNavigationProps) => {
  const features = [
    { id: "home" as FeatureType, icon: "home", label: "Home" },
    { id: "watchlist" as FeatureType, icon: "bookmark", label: "Watchlist" },
    { id: "debate" as FeatureType, icon: "forum", label: "Debate" },
    { id: "quiz" as FeatureType, icon: "quiz", label: "Quiz" },
    { id: "tribe" as FeatureType, icon: "groups", label: "Tribe" },
    { id: "ask-expert" as FeatureType, icon: "psychology", label: "Ask Expert" },
  ];

  return (
    <ScrollArea className="w-full px-4 py-3">
      <div className="flex space-x-6">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="ghost"
            className="flex flex-col items-center px-0 py-2 h-auto space-y-1 min-w-[64px]"
            onClick={() => onFeatureSelect(feature.id)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeFeature === feature.id ? "bg-primary" : "bg-gray-100"
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
              className={`text-xs ${
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

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const FeatureNavigation = () => {
  const features = [
    { id: "watchlist", icon: "bookmark", label: "Watchlist" },
    { id: "debate", icon: "forum", label: "Debate" },
    { id: "quiz", icon: "quiz", label: "Quiz" },
    { id: "tribe", icon: "groups", label: "Tribe" },
    { id: "ask-expert", icon: "psychology", label: "Ask Expert", active: true },
  ];

  return (
    <ScrollArea className="w-full px-4 py-3">
      <div className="flex space-x-6">
        {features.map((feature) => (
          <Button
            key={feature.id}
            variant="ghost"
            className="flex flex-col items-center px-0 py-2 h-auto space-y-1 min-w-[64px]"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                feature.active ? "bg-primary" : "bg-gray-100"
              }`}
            >
              <span
                className={`material-icons ${
                  feature.active ? "text-white" : "text-gray-700"
                }`}
              >
                {feature.icon}
              </span>
            </div>
            <span
              className={`text-xs ${
                feature.active ? "text-primary font-medium" : "text-gray-700"
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

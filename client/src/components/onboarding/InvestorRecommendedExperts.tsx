import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useExperts, type Expert } from "@/hooks/graphql";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
  selected: Expert[];
  onChange: (expert: Expert, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  onSkipToDashboard: () => void;
};

export function InvestorRecommendedExperts({ selected, onChange, onBack, onNext, onSkipToDashboard }: Props) {
  const { data, loading, error } = useExperts();
  const experts = data?.experts || [];

  const toggleExpert = (expert: Expert) => {
    const isSelected = selected.some(e => e.id === expert.id);
    onChange(expert, !isSelected);
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.[0] || '';
    const lastInitial = lastName?.[0] || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || '?';
  };

  return (
    <div className="px-4 py-4 flex flex-col w-full h-screen">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Recommended Experts</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Follow these top-performing experts to get personalized investment insights:
      </p>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-sm mb-2">Failed to load experts</p>
            <p className="text-red-500 text-xs">{error.message}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto pr-1">
            {experts.map((expert) => {
              const specializations = expert.profile?.specializations || [];

              return (
                <div
                  key={expert.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      {getInitials(expert.firstName, expert.lastName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-0.5">
                        {expert.firstName} {expert.lastName}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">@{expert.username}</p>

                      {expert.profile?.profileBio && (
                        <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                          {expert.profile.profileBio}
                        </p>
                      )}

                      {specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {specializations.slice(0, 3).map((spec, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 capitalize"
                            >
                              {spec}
                            </Badge>
                          ))}
                          {specializations.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600"
                            >
                              +{specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={selected.some(e => e.id === expert.id)}
                        onCheckedChange={() => toggleExpert(expert)}
                        className="mt-1 h-5 w-5"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {experts.length === 0 && (
              <div className="flex-1 flex items-center justify-center py-12">
                <p className="text-gray-500 text-sm">No experts available</p>
              </div>
            )}
          </div>

          <div className="mt-auto pb-6 safe-area-bottom">
            <Button onClick={onSkipToDashboard} className="w-full mb-3 bg-[#E2E8F0] text-gray-700 hover:bg-[#E2E8F0]/80">
              Skip to dashboard
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
              <Button onClick={onNext} className="flex-1">
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

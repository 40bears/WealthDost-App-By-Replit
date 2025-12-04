import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Expert = {
  id: string;
  name: string;
  role: string;
  specialization: string;
  followers: string;
  successRate: string;
  avgReturn: string;
  avatar: string;
};

type Props = {
  selected: string[];
  onChange: (expertId: string, checked: boolean) => void;
  onBack: () => void;
  onNext: () => void;
};

export function InvestorRecommendedExperts({ selected, onChange, onBack, onNext }: Props) {
  const experts: Expert[] = [
    {
      id: "rajesh-kumar",
      name: "Rajesh Kumar",
      role: "Value Investor | 10Y Exp | NISM Certified",
      specialization: "Technology & Financial Stocks",
      followers: "8.5K",
      successRate: "86%",
      avgReturn: "+20.20%",
      avatar: "R"
    },
    {
      id: "priya-sharma",
      name: "Priya Sharma",
      role: "Growth Investor | Energy Specialist",
      specialization: "Energy & Renewable Sector",
      followers: "14.6K",
      successRate: "82%",
      avgReturn: "+40.30%",
      avatar: "P"
    },
    {
      id: "vikram-patel",
      name: "Vikram Patel",
      role: "Technical Analyst | Options Trading",
      specialization: "Options & Derivatives",
      followers: "10.9K",
      successRate: "78%",
      avgReturn: "+21.00%",
      avatar: "V"
    },
    {
      id: "anita-desai",
      name: "Anita Desai",
      role: "Sector Rotation Expert | Corporate Insider",
      specialization: "Technology & Corporate Analysis",
      followers: "11.4K",
      successRate: "74%",
      avgReturn: "+29.20%",
      avatar: "A"
    },
    {
      id: "arjun-singh",
      name: "Arjun Singh",
      role: "Momentum Trader | Growth Stocks",
      specialization: "Growth & Momentum Trading",
      followers: "23.9K",
      successRate: "79%",
      avgReturn: "+31.00%",
      avatar: "A"
    }
  ];

  const toggleExpert = (expertId: string) => {
    const isSelected = selected.includes(expertId);
    onChange(expertId, !isSelected);
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

      <div className="flex-1 space-y-3 mb-6 overflow-y-auto pr-1">
        {experts.map((expert) => (
          <div
            key={expert.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-lg flex-shrink-0">
                {expert.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-0.5">{expert.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{expert.role}</p>
                <p className="text-xs text-blue-600 mb-3">{expert.specialization}</p>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-900">{expert.followers}</span>
                    <span className="text-gray-500 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{expert.successRate}</span>
                    <span className="text-gray-500 ml-1">success rate</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-600">{expert.avgReturn}</span>
                    <span className="text-gray-500 ml-1">avg return</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Checkbox
                  checked={selected.includes(expert.id)}
                  onCheckedChange={() => toggleExpert(expert.id)}
                  className="mt-1 h-5 w-5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}

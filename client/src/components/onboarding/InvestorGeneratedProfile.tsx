import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  interests: string[];
  experienceLevel: string;
  riskPersona: string;
};

function personaMeta(code: string) {
  switch (code) {
    case 'owl': return { emoji: '🦉', name: 'Cautious Owl', color: 'blue' };
    case 'shark': return { emoji: '🦈', name: 'Risk-Taking Shark', color: 'red' };
    default: return { emoji: '🦊', name: 'Calculated Fox', color: 'yellow' };
  }
}

export function InvestorGeneratedProfile({ formData, onBack, onComplete }: {
  formData: FormData;
  onBack: () => void;
  onComplete: () => void;
}) {
  const meta = personaMeta(formData.riskPersona || 'fox');
  return (
    <div className="px-4 py-6 flex flex-col w-full min-h-screen">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg sm:text-xl font-semibold ml-2">Your Wealth Enthusiast Profile</h2>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="bg-primary text-white p-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4 border-2 border-white">
              <AvatarFallback className="bg-white text-primary text-3xl">
                <span className="material-icons">person</span>
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-xl">{formData.fullName || 'Sarah Johnson'}</h3>
              <p className="text-primary-100">@{formData.username || 'TechInvestor'}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-700 mb-4">{formData.profileBio || 'Long-term investor | Tech stocks | AI enthusiast'}</p>
          <div className="flex mb-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500">Experience</div>
              <div className="font-medium">
                {formData.experienceLevel === 'beginner' && '🐣 Beginner'}
                {formData.experienceLevel === 'intermediate' && '🦅 Intermediate'}
                {formData.experienceLevel === 'advanced' && '🦈 Advanced'}
                {!formData.experienceLevel && '🦅 Intermediate'}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Risk Persona</div>
              <div className="font-medium flex items-center">
                <span className={`inline-block w-3 h-3 bg-${meta.color}-400 rounded-full mr-1`}></span>
                {meta.emoji} {meta.name}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Interests</div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.includes('stocks') && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>)}
              {formData.interests.includes('crypto') && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🚀 Crypto & Web3</span>)}
              {formData.interests.includes('realestate') && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏠 Real Estate</span>)}
              {formData.interests.includes('macro') && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🌍 Macroeconomics</span>)}
              {formData.interests.includes('personal') && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Personal Finance</span>)}
              {formData.interests.length === 0 && (
                <>
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🚀 Crypto & Web3</span>
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Personal Finance</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto pb-6 safe-area-bottom">
        <Button onClick={onComplete} className="w-full">Enter WealthDost</Button>
      </div>
    </div>
  );
}


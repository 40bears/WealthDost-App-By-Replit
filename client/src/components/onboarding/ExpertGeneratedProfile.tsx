import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPersonaEmoji } from "@/lib/utils";

type FormData = {
  fullName: string;
  username: string;
  profileBio: string;
  education: string;
  achievements: string[];
  specializations: string[];
  expertPersona: string;
};

function getEducationDisplay(code: string): string {
  switch (code) {
    case "ca": return "CA";
    case "cfa": return "CFA";
    case "mba": return "MBA Finance";
    case "bcom": return "B.Com/M.Com";
    case "engineer": return "Finance Engineer";
    case "self": return "Market Expert";
    default: return "MBA Finance";
  }
}

function getPersonaColor(persona: string): string {
  switch (persona) {
    case "owl": return "blue";
    case "fox": return "yellow";
    case "shark": return "red";
    default: return "blue";
  }
}

function getPersonaName(persona: string): string {
  switch (persona) {
    case "owl": return "The Wise Owl";
    case "fox": return "The Strategic Fox";
    case "shark": return "The Bold Shark";
    default: return "The Wise Owl";
  }
}

export function ExpertGeneratedProfile({ formData, onBack, onComplete }: {
  formData: FormData;
  onBack: () => void;
  onComplete: () => void;
}) {
  const personaColor = getPersonaColor(formData.expertPersona || 'owl');
  const personaName = getPersonaName(formData.expertPersona || 'owl');
  const personaEmoji = getPersonaEmoji(formData.expertPersona || "owl");

  return (
    <div className="px-4 py-6 flex flex-col w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-xl font-semibold ml-2">Your Expert Profile</h2>
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
              <div className="flex items-center">
                <h3 className="font-semibold text-xl">{formData.fullName || "Rahul Sharma"}</h3>
                <span className="ml-2 bg-white text-primary text-xs py-0.5 px-1.5 rounded-full flex items-center">
                  <span className="material-icons text-xs mr-0.5">verified</span>
                  Expert
                </span>
              </div>
              <p className="text-primary-100">@{formData.username || "ValueInvestor"}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-700 mb-4">{formData.profileBio || "Equity Research | Value Investing | 15+ years experience"}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.education && (
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
                <span className="text-gray-500">{getEducationDisplay(formData.education)}</span>
              </div>
            )}
            {!formData.education && (
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm">
                <span className="text-gray-500">CFA</span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Expert Persona</div>
            <div className="font-medium flex items-center">
              <span className={`inline-block w-3 h-3 bg-${personaColor}-500 rounded-full mr-1`}></span>
              {personaEmoji} {personaName}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Specializations</div>
            <div className="flex flex-wrap gap-2">
              {formData.specializations.includes("stocks") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>)}
              {formData.specializations.includes("macro") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🌍 Macroeconomics</span>)}
              {formData.specializations.includes("wealth") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Wealth Planning</span>)}
              {formData.specializations.includes("crypto") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🚀 Crypto & Web3</span>)}
              {formData.specializations.includes("privateequity") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏦 Private Equity</span>)}
              {formData.specializations.includes("realestate") && (<span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏠 Real Estate</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Button onClick={onComplete} className="w-full">Enter WealthDost</Button>
      </div>
    </div>
  );
}


import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { InvestorBasicProfile } from "@/components/onboarding/InvestorBasicProfile";
import { InvestorContentPreferences } from "@/components/onboarding/InvestorContentPreferences";
import { InvestorGeneratedProfile } from "@/components/onboarding/InvestorGeneratedProfile";
import { InvestorRiskProfile } from "@/components/onboarding/InvestorRiskProfile";
import { useState } from "react";
import { useLocation } from "wouter";

interface InvestorOnboardingProps {
  onBack: () => void;
  onComplete?: (data: any) => void;
}

export const InvestorOnboarding = ({ onBack, onComplete }: InvestorOnboardingProps) => {
  const [, navigate] = useLocation();
  
  const flow = useFlowMachine({
    initial: 'basic',
    transitions: {
      basic: { NEXT: 'content' },
      content: { BACK: 'basic', NEXT: 'risk' },
      risk: { BACK: 'content', NEXT: 'generated' },
      generated: { BACK: 'risk' },
    },
  });
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    profileBio: "",
    password: "",
    confirmPassword: "",
    detailedBio: "",
    experienceLevel: "",
    interests: [] as string[],
    industrySector: "",
    searchableTags: [] as string[],
    followingExperts: [] as string[],
    riskLevel: "",
    returnTarget: "",
    riskPersona: "",
  });


  // Step 1: Basic profile data
  const handleBasicProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Step 2: Content preferences
  const handleContentPreferenceChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  // Step 3: Industry sector
  const handleIndustrySectorChange = (value: string) => {
    setFormData(prev => ({ ...prev, industrySector: value }));
  };

  // Step 4: Searchable tags
  const handleSearchableTagsChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      searchableTags: checked 
        ? [...prev.searchableTags, value]
        : prev.searchableTags.filter(tag => tag !== value)
    }));
  };

  // Step 6: Recommended experts
  const handleExpertFollowChange = (expertId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      followingExperts: checked 
        ? [...prev.followingExperts, expertId]
        : prev.followingExperts.filter(id => id !== expertId)
    }));
  };

  // Step 5: Risk profile
  const handleRiskProfileChange = (value: string) => {
    let riskPersona = "";
    let returnTarget = "";
    
    if (value === "low") {
      riskPersona = "owl";
      returnTarget = "5-8%";
    } else if (value === "moderate") {
      riskPersona = "fox";
      returnTarget = "10-15%";
    } else if (value === "high") {
      riskPersona = "shark";
      returnTarget = "20%+";
    }
    
    setFormData(prev => ({
      ...prev,
      riskLevel: value,
      riskPersona,
      returnTarget,
    }));
  };

  // Navigation between steps
  const goToNextStep = () => flow.send('NEXT');
  const goToPreviousStep = () => flow.send('BACK');

  const handleSubmit = () => {
    goToNextStep();
  };

  const getProgressPercentage = () => {
    switch (flow.state) {
      case 'basic': return 40;
      case 'content': return 60;
      case 'risk': return 80;
      case 'generated': return 100;
      default: return 25;
    }
  };


  return (
    <FlowMachineProvider value={flow}>
      <div className="h-full overflow-auto">
        <FlowRoutes>
          <FlowRoute
            name="basic"
            element={
              <InvestorBasicProfile
                formData={formData}
                onBack={onBack}
                onNext={goToNextStep}
                onBasicChange={handleBasicProfileChange}
                onExperienceLevelChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="content"
            element={
              <InvestorContentPreferences
                selected={formData.interests}
                onChange={(v, c) => handleContentPreferenceChange(v, c)}
                onBack={goToPreviousStep}
                onNext={goToNextStep}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="risk"
            element={
              <InvestorRiskProfile
                value={formData.riskLevel}
                onChange={handleRiskProfileChange}
                onBack={goToPreviousStep}
                onNext={handleSubmit}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="generated"
            element={
              <InvestorGeneratedProfile
                formData={formData}
                onBack={goToPreviousStep}
                onComplete={() => { if (onComplete) onComplete(formData); else navigate('/dashboard'); }}
              />
            }
          />
        </FlowRoutes>
      </div>
    </FlowMachineProvider>
  );
};

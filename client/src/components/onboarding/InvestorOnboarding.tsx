import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { InvestorBasicProfile } from "@/components/onboarding/InvestorBasicProfile";
import { InvestorContentPreferences } from "@/components/onboarding/InvestorContentPreferences";
import { InvestorGeneratedProfile } from "@/components/onboarding/InvestorGeneratedProfile";
import { InvestorIndustrySector } from "@/components/onboarding/InvestorIndustrySector";
import { InvestorRecommendedExperts } from "@/components/onboarding/InvestorRecommendedExperts";
import { InvestorRiskProfile } from "@/components/onboarding/InvestorRiskProfile";
import { InvestorTopics } from "@/components/onboarding/InvestorTopics";
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
      content: { BACK: 'basic', NEXT: 'industry' },
      industry: { BACK: 'content', NEXT: 'topics' },
      topics: { BACK: 'industry', NEXT: 'risk' },
      risk: { BACK: 'topics', NEXT: 'experts' },
      experts: { BACK: 'risk', NEXT: 'generated' },
      generated: { BACK: 'experts' },
    },
  });
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    profileBio: "",
    detailedBio: "",
    experienceLevel: "",
    interests: [] as string[],
    industrySectors: [] as string[],
    topics: [] as string[],
    riskLevel: "",
    returnTarget: "",
    riskPersona: "",
    followedExperts: [] as string[],
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

  // Step 3: Industry sectors
  const handleIndustrySectorChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      industrySectors: checked
        ? [...prev.industrySectors, value]
        : prev.industrySectors.filter(sector => sector !== value)
    }));
  };

  // Step 4: Topics
  const handleTopicsChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      topics: checked
        ? [...prev.topics, value]
        : prev.topics.filter(topic => topic !== value)
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

  // Step 6: Recommended experts
  const handleExpertsChange = (expertId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      followedExperts: checked
        ? [...prev.followedExperts, expertId]
        : prev.followedExperts.filter(id => id !== expertId)
    }));
  };

  // Navigation between steps
  const goToNextStep = () => flow.send('NEXT');
  const goToPreviousStep = () => flow.send('BACK');

  const handleSubmit = () => {
    goToNextStep();
  };

  const handleSkipToDashboard = () => {
    if (onComplete) {
      onComplete(formData);
    } else {
      navigate('/dashboard');
    }
  };

  const getProgressPercentage = () => {
    switch (flow.state) {
      case 'basic': return 15;
      case 'content': return 30;
      case 'industry': return 45;
      case 'topics': return 60;
      case 'risk': return 75;
      case 'experts': return 90;
      case 'generated': return 100;
      default: return 15;
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
                onSkipToDashboard={handleSkipToDashboard}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="industry"
            element={
              <InvestorIndustrySector
                selected={formData.industrySectors}
                onChange={(v, c) => handleIndustrySectorChange(v, c)}
                onBack={goToPreviousStep}
                onNext={goToNextStep}
                onSkipToDashboard={handleSkipToDashboard}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="topics"
            element={
              <InvestorTopics
                selected={formData.topics}
                onChange={(v, c) => handleTopicsChange(v, c)}
                onBack={goToPreviousStep}
                onNext={goToNextStep}
                onSkipToDashboard={handleSkipToDashboard}
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
                onNext={goToNextStep}
                onSkipToDashboard={handleSkipToDashboard}
                progress={getProgressPercentage()}
              />
            }
          />
          <FlowRoute
            name="experts"
            element={
              <InvestorRecommendedExperts
                selected={formData.followedExperts}
                onChange={handleExpertsChange}
                onBack={goToPreviousStep}
                onNext={handleSubmit}
                onSkipToDashboard={handleSkipToDashboard}
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

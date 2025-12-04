import { FlowMachineProvider, useFlowMachine } from "@/components/flow/FlowMachine";
import { FlowRoute } from "@/components/flow/FlowRoute";
import { FlowRoutes } from "@/components/flow/FlowRoutes";
import { ExpertBasicProfile } from "@/components/onboarding/ExpertBasicProfile";
import { ExpertGeneratedProfile } from "@/components/onboarding/ExpertGeneratedProfile";
import { ExpertPersona } from "@/components/onboarding/ExpertPersona";
import { ExpertSpecializations } from "@/components/onboarding/ExpertSpecializations";
import { useState } from "react";
import { useLocation } from "wouter";

interface ExpertOnboardingProps {
  onBack: () => void;
  onComplete?: (data: any) => void;
}

export const ExpertOnboarding = ({ onBack, onComplete }: ExpertOnboardingProps) => {
  const [, navigate] = useLocation();
  
  const flow = useFlowMachine({
    initial: 'basic',
    transitions: {
      basic: { NEXT: 'specializations' },
      specializations: { BACK: 'basic', NEXT: 'persona' },
      persona: { BACK: 'specializations', NEXT: 'generated' },
      generated: { BACK: 'persona' },
    },
  });
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    profileBio: "",
    detailedBio: "",
    education: "",
    achievements: [] as string[],
    specializations: [] as string[],
    expertPersona: "",
  });

  // Step 1: Basic profile data
  const handleBasicProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle education select
  const handleEducationChange = (value: string) => {
    setFormData(prev => ({ ...prev, education: value }));
  };

  // Handle achievements checkbox
  const handleAchievementChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      achievements: checked 
        ? [...prev.achievements, value]
        : prev.achievements.filter(item => item !== value)
    }));
  };

  // Step 2: Specializations
  const handleSpecializationChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specializations: checked 
        ? [...prev.specializations, value]
        : prev.specializations.filter(item => item !== value)
    }));
  };

  // Step 3: Expert persona
  const handleExpertPersonaChange = (value: string) => {
    setFormData(prev => ({ ...prev, expertPersona: value }));
  };

  // Navigation between steps
  const goToNextStep = () => flow.send('NEXT');
  const goToPreviousStep = () => flow.send('BACK');


  const handleSubmit = () => {
    goToNextStep();
  };

  const getProgressPercentage = () => {
    switch (flow.state) {
      case 'basic': return 33;
      case 'specializations': return 66;
      case 'persona': return 100;
      case 'generated': return 100;
      default: return 33;
    }
  };

  // Steps are routed below via FlowRoutes

  // Step 1: Basic Profile & Expertise
  const renderBasicProfile = () => (
    <ExpertBasicProfile
      formData={formData}
      onBack={onBack}
      onNext={goToNextStep}
      onBasicChange={handleBasicProfileChange}
      onEducationChange={handleEducationChange}
      onAchievementChange={handleAchievementChange}
      progress={getProgressPercentage()}
    />
  );

  // Step 2: Investment Specialization
  const renderSpecializations = () => (
    <ExpertSpecializations
      selected={formData.specializations}
      onChange={(v, c) => handleSpecializationChange(v, c)}
      onBack={goToPreviousStep}
      onNext={goToNextStep}
      progress={getProgressPercentage()}
    />
  );

  // Step 3: Expert Persona
  const renderExpertPersona = () => (
    <ExpertPersona
      value={formData.expertPersona}
      onChange={handleExpertPersonaChange}
      onBack={goToPreviousStep}
      onNext={handleSubmit}
      progress={getProgressPercentage()}
    />
  );

  // Step 4: Generated Profile
  const renderGeneratedProfile = () => {
    return (
      <ExpertGeneratedProfile
        formData={formData}
        onBack={goToPreviousStep}
        onComplete={() => { if (onComplete) { onComplete(formData); } else { navigate("/dashboard"); } }}
      />
    );
  };

  return (
    <FlowMachineProvider value={flow}>
      <div className="h-full overflow-auto">
        <FlowRoutes>
          <FlowRoute name="basic" element={renderBasicProfile()} />
          <FlowRoute name="specializations" element={renderSpecializations()} />
          <FlowRoute name="persona" element={renderExpertPersona()} />
          <FlowRoute name="generated" element={renderGeneratedProfile()} />
        </FlowRoutes>
      </div>
    </FlowMachineProvider>
  );
};

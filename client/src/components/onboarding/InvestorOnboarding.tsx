import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getPersonaEmoji } from "@/lib/utils";
import { useLocation } from "wouter";

interface InvestorOnboardingProps {
  onBack: () => void;
}

export const InvestorOnboarding = ({ onBack }: InvestorOnboardingProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for form data
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    profileBio: "",
    detailedBio: "",
    experienceLevel: "",
    interests: [] as string[],
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

  // Step 3: Risk profile
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
  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  // Mock submission
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      // Continue with profile creation
      createInvestorProfileMutation.mutate({
        userId: data.id,
        interests: formData.interests,
        riskPersona: formData.riskPersona,
        riskLevel: formData.riskLevel,
        returnTarget: formData.returnTarget,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createInvestorProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest('POST', '/api/investor-profile', profileData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investor-profile'] });
      // Navigate to dashboard on success
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create investor profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    // In a real app, this would submit to the backend
    // For now, let's just navigate to the next step
    goToNextStep();
    
    // Mock user creation in a real app
    // createUserMutation.mutate({
    //   username: formData.username,
    //   password: "password123", // In a real app, this would be securely handled
    //   fullName: formData.fullName,
    //   profileBio: formData.profileBio,
    //   userType: "investor",
    //   experienceLevel: formData.experienceLevel,
    // });
  };

  const getProgressPercentage = () => {
    switch (step) {
      case 1: return 40;
      case 2: return 60;
      case 3: return 80;
      case 4: return 100;
      default: return 25;
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBasicProfile();
      case 2:
        return renderContentPreferences();
      case 3:
        return renderRiskProfile();
      case 4:
        return renderGeneratedProfile();
      default:
        return renderBasicProfile();
    }
  };

  // Step 1: Basic Profile
  const renderBasicProfile = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Wealth Enthusiast Profile</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <form className="space-y-4 flex-1">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleBasicProfileChange}
            className="mt-1"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <Label htmlFor="username">Finance Username</Label>
          <div className="flex mt-1">
            <div className="bg-gray-100 flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300">
              <span className="text-gray-500">@</span>
            </div>
            <Input 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleBasicProfileChange}
              className="rounded-l-none"
              placeholder="StockGuru, CryptoWhale"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a finance-themed username</p>
        </div>

        <div>
          <Label htmlFor="profileBio">Profile Bio</Label>
          <Textarea 
            id="profileBio"
            name="profileBio"
            value={formData.profileBio}
            onChange={handleBasicProfileChange}
            className="mt-1"
            placeholder="Long-term investor | Tech stocks | AI enthusiast"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Optional: Add a finance-related tagline</p>
        </div>



        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">Investment Experience Level</Label>
          <RadioGroup 
            value={formData.experienceLevel}
            onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
          >
            <div className="space-y-3">
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="beginner" id="beginner" className="mt-0.5 mr-3" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🐣 Beginner <span className="text-sm ml-1 text-gray-500">(0-2 years)</span></span>
                  <p className="text-sm text-gray-600">New to investing and learning the basics</p>
                </Label>
              </div>
              
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="intermediate" id="intermediate" className="mt-0.5 mr-3" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🦅 Intermediate <span className="text-sm ml-1 text-gray-500">(2-5 years)</span></span>
                  <p className="text-sm text-gray-600">Comfortable with basic investments</p>
                </Label>
              </div>
              
              <div className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="advanced" id="advanced" className="mt-0.5 mr-3" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <span className="font-medium flex items-center">🦈 Advanced <span className="text-sm ml-1 text-gray-500">(5+ years)</span></span>
                  <p className="text-sm text-gray-600">Experienced investor familiar with complex strategies</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </form>

      <div className="mt-auto">
        <Button onClick={goToNextStep} className="w-full">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 2: Content Preferences
  const renderContentPreferences = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Content Preferences</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <p className="text-gray-600 mb-4 text-sm">Select topics you're interested in:</p>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="stocks" 
            checked={formData.interests.includes("stocks")} 
            onCheckedChange={(checked) => handleContentPreferenceChange("stocks", checked as boolean)}
            className="mr-2" 
          />
          <Label htmlFor="stocks" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">📈 Stock Market</span>
            <p className="text-sm text-gray-700">Equities, indices, and market analysis</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="crypto" 
            checked={formData.interests.includes("crypto")} 
            onCheckedChange={(checked) => handleContentPreferenceChange("crypto", checked as boolean)}
            className="mr-2" 
          />
          <Label htmlFor="crypto" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🚀 Crypto & Web3</span>
            <p className="text-sm text-gray-700">Cryptocurrencies, blockchain, NFTs</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="realestate" 
            checked={formData.interests.includes("realestate")} 
            onCheckedChange={(checked) => handleContentPreferenceChange("realestate", checked as boolean)}
            className="mr-2" 
          />
          <Label htmlFor="realestate" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏠 Real Estate & Alternative Assets</span>
            <p className="text-sm text-gray-700">Property investments, REITs, collectibles</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="macro" 
            checked={formData.interests.includes("macro")} 
            onCheckedChange={(checked) => handleContentPreferenceChange("macro", checked as boolean)}
            className="mr-2" 
          />
          <Label htmlFor="macro" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🌍 Macroeconomics & Global Markets</span>
            <p className="text-sm text-gray-700">Economic trends, geopolitics, policy analysis</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="personal" 
            checked={formData.interests.includes("personal")} 
            onCheckedChange={(checked) => handleContentPreferenceChange("personal", checked as boolean)}
            className="mr-2" 
          />
          <Label htmlFor="personal" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">💰 Personal Finance & Wealth Building</span>
            <p className="text-sm text-gray-700">Budgeting, saving, retirement planning</p>
          </Label>
        </div>
      </div>

      <div className="mt-auto flex space-x-3">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextStep} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 3: Risk Profile
  const renderRiskProfile = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Risk Profile Assessment</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold mb-2">How do you react to market volatility & what's your return target?</h3>
        <p className="text-sm text-gray-600 mb-2">This helps us understand your investment style and risk tolerance.</p>

        <RadioGroup 
          value={formData.riskLevel}
          onValueChange={handleRiskProfileChange}
          className="space-y-3 mt-4"
        >
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="low" id="low" className="mt-0.5 mr-3" />
            <Label htmlFor="low" className="flex-1 cursor-pointer">
              <div className="font-medium">📉 Sell immediately to avoid losses</div>
              <p className="text-sm text-gray-600">I prefer stability and low risk investments</p>
              <div className="mt-2 bg-green-100 text-green-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">account_balance</span>
                5-8% Return Target (Safe & Steady)
              </div>
            </Label>
          </div>
          
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="moderate" id="moderate" className="mt-0.5 mr-3" />
            <Label htmlFor="moderate" className="flex-1 cursor-pointer">
              <div className="font-medium">🤷‍♂️ Hold, but get slightly anxious</div>
              <p className="text-sm text-gray-600">I can tolerate some ups and downs</p>
              <div className="mt-2 bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                10-15% Return Target (Balanced Growth)
              </div>
            </Label>
          </div>
          
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="high" id="high" className="mt-0.5 mr-3" />
            <Label htmlFor="high" className="flex-1 cursor-pointer">
              <div className="font-medium">🚀 Buy more! I see opportunities</div>
              <p className="text-sm text-gray-600">I embrace volatility as a chance to profit</p>
              <div className="mt-2 bg-red-100 text-red-800 text-sm py-1 px-2 rounded inline-flex items-center">
                <span className="material-icons text-sm mr-1">trending_up</span>
                20%+ Return Target (High-Risk, High-Reward)
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mt-auto flex space-x-3">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1">
          Finish
        </Button>
      </div>
    </div>
  );

  // Step 4: Generated Profile
  const renderGeneratedProfile = () => {
    // Determine risk persona emoji and color
    let personaEmoji = "🦊";
    let personaName = "Calculated Fox";
    let personaColor = "yellow";
    
    if (formData.riskPersona === "owl") {
      personaEmoji = "🦉";
      personaName = "Cautious Owl";
      personaColor = "blue";
    } else if (formData.riskPersona === "shark") {
      personaEmoji = "🦈";
      personaName = "Risk-Taking Shark";
      personaColor = "red";
    }
    
    return (
      <div className="px-4 py-6 flex flex-col w-full min-h-screen">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
            <span className="material-icons">arrow_back</span>
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold ml-2">Your Wealth Enthusiast Profile</h2>
        </div>

        {/* Progress Bar */}
        <Progress value={getProgressPercentage()} className="h-1 mb-6" />

        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="bg-primary text-white p-4">
            <div className="flex items-center">
              <Avatar className="h-16 w-16 mr-4 border-2 border-white">
                <AvatarFallback className="bg-white text-primary text-3xl">
                  <span className="material-icons">person</span>
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-xl">{formData.fullName || "Sarah Johnson"}</h3>
                <p className="text-primary-100">@{formData.username || "TechInvestor"}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-gray-700 mb-4">{formData.profileBio || "Long-term investor | Tech stocks | AI enthusiast"}</p>
            
            <div className="flex mb-4">
              <div className="flex-1">
                <div className="text-sm text-gray-500">Experience</div>
                <div className="font-medium">
                  {formData.experienceLevel === "beginner" && "🐣 Beginner"}
                  {formData.experienceLevel === "intermediate" && "🦅 Intermediate"}
                  {formData.experienceLevel === "advanced" && "🦈 Advanced"}
                  {!formData.experienceLevel && "🦅 Intermediate"}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Risk Persona</div>
                <div className="font-medium flex items-center">
                  <span className={`inline-block w-3 h-3 bg-${personaColor}-400 rounded-full mr-1`}></span>
                  {personaEmoji} {personaName}
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Interests</div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.includes("stocks") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>
                )}
                {formData.interests.includes("crypto") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🚀 Crypto & Web3</span>
                )}
                {formData.interests.includes("realestate") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏠 Real Estate</span>
                )}
                {formData.interests.includes("macro") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🌍 Macroeconomics</span>
                )}
                {formData.interests.includes("personal") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Personal Finance</span>
                )}
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

        <div className={`bg-${personaColor}-50 border border-${personaColor}-100 rounded-xl p-4 mb-6`}>
          <div className="flex">
            <span className={`material-icons text-${personaColor}-500 mr-3`}>tips_and_updates</span>
            <div>
              <h4 className={`font-medium text-${personaColor}-700`}>Your Wealth Persona: The {personaName}</h4>
              {formData.riskPersona === "owl" && (
                <p className="text-sm text-blue-700">You're a cautious investor who prioritizes safety and stability in your investments. You prefer proven, established assets with reliable returns.</p>
              )}
              {(formData.riskPersona === "fox" || !formData.riskPersona) && (
                <p className="text-sm text-yellow-700">You're a balanced investor who assesses risks carefully while seeking growth opportunities. You prefer to have a strategic approach to investing.</p>
              )}
              {formData.riskPersona === "shark" && (
                <p className="text-sm text-red-700">You're a bold investor who seeks high-growth opportunities and isn't afraid of volatility. You see market dips as buying opportunities.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Enter WealthDost
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      {renderStep()}
    </div>
  );
};

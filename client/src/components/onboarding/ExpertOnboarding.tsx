import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getPersonaEmoji } from "@/lib/utils";
import { useLocation } from "wouter";

interface ExpertOnboardingProps {
  onBack: () => void;
}

export const ExpertOnboarding = ({ onBack }: ExpertOnboardingProps) => {
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
      createExpertProfileMutation.mutate({
        userId: data.id,
        education: formData.education,
        achievements: formData.achievements,
        specializations: formData.specializations,
        expertPersona: formData.expertPersona,
        isVerified: false,
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

  const createExpertProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest('POST', '/api/expert-profile', profileData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/expert-profile'] });
      // Navigate to dashboard on success
      navigate("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create expert profile. Please try again.",
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
    //   userType: "expert",
    // });
  };

  const getProgressPercentage = () => {
    switch (step) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      case 4: return 100;
      default: return 33;
    }
  };

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderBasicProfile();
      case 2:
        return renderSpecializations();
      case 3:
        return renderExpertPersona();
      case 4:
        return renderGeneratedProfile();
      default:
        return renderBasicProfile();
    }
  };

  // Step 1: Basic Profile & Expertise
  const renderBasicProfile = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Expert Profile</h2>
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
          <Label htmlFor="username">Expert Username</Label>
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
              placeholder="AlphaAnalyst, MarketMaverick"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Choose a professional finance-themed username</p>
        </div>

        <div>
          <Label htmlFor="profileBio">Professional Bio</Label>
          <Textarea 
            id="profileBio"
            name="profileBio"
            value={formData.profileBio}
            onChange={handleBasicProfileChange}
            className="mt-1"
            placeholder="Equity Research | Options Trader | Macro Specialist"
            rows={3}
          />
        </div>



        <div>
          <Label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Educational Background</Label>
          <Select value={formData.education} onValueChange={handleEducationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ca">CA (Chartered Accountant)</SelectItem>
              <SelectItem value="cfa">CFA (Chartered Financial Analyst)</SelectItem>
              <SelectItem value="mba">MBA Finance (IIM/ISB/Other)</SelectItem>
              <SelectItem value="bcom">B.Com/M.Com</SelectItem>
              <SelectItem value="engineer">Finance Engineer</SelectItem>
              <SelectItem value="self">Self-Taught Market Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-3">Exceptional Achievements</Label>
          <div className="space-y-2">
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="tv" 
                checked={formData.achievements.includes("tv")} 
                onCheckedChange={(checked) => handleAchievementChange("tv", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="tv" className="flex-1 cursor-pointer">
                Featured on CNBC/ET Now
              </Label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="recognition" 
                checked={formData.achievements.includes("recognition")} 
                onCheckedChange={(checked) => handleAchievementChange("recognition", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="recognition" className="flex-1 cursor-pointer">
                SEBI/RBI Recognized
              </Label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="aum" 
                checked={formData.achievements.includes("aum")} 
                onCheckedChange={(checked) => handleAchievementChange("aum", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="aum" className="flex-1 cursor-pointer">
                Managed ₹100Cr+ AUM
              </Label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="speaker" 
                checked={formData.achievements.includes("speaker")} 
                onCheckedChange={(checked) => handleAchievementChange("speaker", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="speaker" className="flex-1 cursor-pointer">
                Top Finance Speaker
              </Label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="published" 
                checked={formData.achievements.includes("published")} 
                onCheckedChange={(checked) => handleAchievementChange("published", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="published" className="flex-1 cursor-pointer">
                Published in Forbes/Moneycontrol
              </Label>
            </div>
            
            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Checkbox 
                id="founder" 
                checked={formData.achievements.includes("founder")} 
                onCheckedChange={(checked) => handleAchievementChange("founder", checked as boolean)}
                className="mr-2" 
              />
              <Label htmlFor="founder" className="flex-1 cursor-pointer">
                Finance Startup Founder
              </Label>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-auto">
        <Button onClick={goToNextStep} className="w-full">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 2: Investment Specialization
  const renderSpecializations = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Your Specialization</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <p className="text-gray-600 mb-4 text-sm">Select your investment specializations (up to 3):</p>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="stocks" 
            checked={formData.specializations.includes("stocks")} 
            onCheckedChange={(checked) => handleSpecializationChange("stocks", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("stocks")}
          />
          <Label htmlFor="stocks" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">📈 Stock Market & Equity Research</span>
            <p className="text-sm text-gray-700">Stock analysis, valuations, and market strategies</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="crypto" 
            checked={formData.specializations.includes("crypto")} 
            onCheckedChange={(checked) => handleSpecializationChange("crypto", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("crypto")}
          />
          <Label htmlFor="crypto" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🚀 Crypto & Web3</span>
            <p className="text-sm text-gray-700">Blockchain technology, DeFi, and token economics</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="privateequity" 
            checked={formData.specializations.includes("privateequity")} 
            onCheckedChange={(checked) => handleSpecializationChange("privateequity", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("privateequity")}
          />
          <Label htmlFor="privateequity" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏦 Private Equity & Venture Capital</span>
            <p className="text-sm text-gray-700">Startup investing, PE deals, and fundraising</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="macro" 
            checked={formData.specializations.includes("macro")} 
            onCheckedChange={(checked) => handleSpecializationChange("macro", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("macro")}
          />
          <Label htmlFor="macro" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🌍 Macroeconomics & Global Markets</span>
            <p className="text-sm text-gray-700">Economic analysis, geopolitics, and policy impacts</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="wealth" 
            checked={formData.specializations.includes("wealth")} 
            onCheckedChange={(checked) => handleSpecializationChange("wealth", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("wealth")}
          />
          <Label htmlFor="wealth" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">💰 Wealth Planning & Financial Advisory</span>
            <p className="text-sm text-gray-700">Comprehensive financial planning and advisory services</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="realestate" 
            checked={formData.specializations.includes("realestate")} 
            onCheckedChange={(checked) => handleSpecializationChange("realestate", checked as boolean)}
            className="mr-2" 
            disabled={formData.specializations.length >= 3 && !formData.specializations.includes("realestate")}
          />
          <Label htmlFor="realestate" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏠 Real Estate & Alternative Investments</span>
            <p className="text-sm text-gray-700">Property markets, REITs, and non-traditional assets</p>
          </Label>
        </div>
      </div>

      <div className="mt-auto flex space-x-3">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={goToNextStep} 
          className="flex-1"
          disabled={formData.specializations.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );

  // Step 3: Expert Persona
  const renderExpertPersona = () => (
    <div className="px-4 py-6 flex flex-col w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-xl font-semibold ml-2">Your Expert Approach</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-6" />

      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h3 className="font-semibold mb-2">How do you approach investment research?</h3>
        <p className="text-sm text-gray-600 mb-4">This helps us match you with the right audience.</p>

        <RadioGroup 
          value={formData.expertPersona}
          onValueChange={handleExpertPersonaChange}
          className="space-y-4"
        >
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="owl" id="owl" className="mt-0.5 mr-3" />
            <Label htmlFor="owl" className="flex-1 cursor-pointer">
              <div className="font-medium">🦉 The Wise Owl</div>
              <p className="text-sm text-gray-600">Focus on long-term fundamentals, value investing, and comprehensive research. Less concerned with short-term fluctuations.</p>
              <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded">
                Long-Term Value Expert
              </div>
            </Label>
          </div>
          
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="fox" id="fox" className="mt-0.5 mr-3" />
            <Label htmlFor="fox" className="flex-1 cursor-pointer">
              <div className="font-medium">🦊 The Strategic Fox</div>
              <p className="text-sm text-gray-600">Balance fundamental analysis with technical indicators. Adapt strategies based on market conditions.</p>
              <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-sm py-1 px-2 rounded">
                Balanced Approach Expert
              </div>
            </Label>
          </div>
          
          <div className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="shark" id="shark" className="mt-0.5 mr-3" />
            <Label htmlFor="shark" className="flex-1 cursor-pointer">
              <div className="font-medium">🦈 The Bold Shark</div>
              <p className="text-sm text-gray-600">Focus on high-growth opportunities, emerging trends, and contrarian strategies. Comfortable with volatility and higher risk.</p>
              <div className="mt-2 inline-block bg-red-100 text-red-800 text-sm py-1 px-2 rounded">
                Growth & Trading Expert
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <h3 className="flex items-center font-semibold text-blue-800 mb-2">
          <span className="material-icons mr-1 text-blue-600">verified</span>
          Expert Verification
        </h3>
        <p className="text-sm text-blue-700">Your profile will be reviewed by our team. Verification badge will be awarded after checking your credentials.</p>
      </div>

      <div className="mt-auto pt-6 pb-4">
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!formData.expertPersona}
        >
          Create Expert Profile
        </Button>
      </div>
    </div>
  );

  // Step 4: Generated Profile
  const renderGeneratedProfile = () => {
    // Get education display name
    const getEducationDisplay = (code: string): string => {
      switch (code) {
        case "ca": return "CA";
        case "cfa": return "CFA";
        case "mba": return "MBA Finance";
        case "bcom": return "B.Com/M.Com";
        case "engineer": return "Finance Engineer";
        case "self": return "Market Expert";
        default: return "MBA Finance";
      }
    };
    
    // Get persona color
    const getPersonaColor = (persona: string): string => {
      switch (persona) {
        case "owl": return "blue";
        case "fox": return "yellow";
        case "shark": return "red";
        default: return "blue";
      }
    };
    
    // Get persona name
    const getPersonaName = (persona: string): string => {
      switch (persona) {
        case "owl": return "The Wise Owl";
        case "fox": return "The Strategic Fox";
        case "shark": return "The Bold Shark";
        default: return "The Wise Owl";
      }
    };
    
    const personaEmoji = getPersonaEmoji(formData.expertPersona || "owl");
    const personaName = getPersonaName(formData.expertPersona || "owl");
    const personaColor = getPersonaColor(formData.expertPersona || "owl");
    
    return (
      <div className="px-4 py-6 flex flex-col w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
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
              
              {(formData.achievements.includes("published") || formData.achievements.length === 0) && (
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-sm flex items-center">
                  <span className="material-icons text-blue-500 text-xs mr-1">verified</span>
                  <span className="text-blue-700">Published Author</span>
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
                {formData.specializations.includes("stocks") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>
                )}
                {formData.specializations.includes("macro") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🌍 Macroeconomics</span>
                )}
                {formData.specializations.includes("wealth") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Wealth Planning</span>
                )}
                {formData.specializations.includes("crypto") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🚀 Crypto & Web3</span>
                )}
                {formData.specializations.includes("privateequity") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏦 Private Equity</span>
                )}
                {formData.specializations.includes("realestate") && (
                  <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🏠 Real Estate</span>
                )}
                {formData.specializations.length === 0 && (
                  <>
                    <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">📈 Stock Market</span>
                    <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">🌍 Macroeconomics</span>
                    <span className="bg-primary text-white px-2 py-1 rounded-lg text-sm">💰 Wealth Planning</span>
                  </>
                )}
              </div>
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

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
      case 1: return 15;
      case 2: return 30;
      case 3: return 45;
      case 4: return 60;
      case 5: return 75;
      case 6: return 90;
      case 7: return 100;
      default: return 15;
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
        return renderIndustrySector();
      case 4:
        return renderSearchableTags();
      case 5:
        return renderRiskProfile();
      case 6:
        return renderRecommendedExperts();
      case 7:
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
        <h2 className="text-lg font-semibold ml-2">Wealth Seeker Profile</h2>
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

      <div className="mt-auto pb-6 safe-area-bottom">
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

      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextStep} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 3: Industry Sector
  const renderIndustrySector = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Industry Sector</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <p className="text-gray-600 mb-4 text-sm">What industry sector interests you most?</p>

      <RadioGroup 
        value={formData.industrySector}
        onValueChange={handleIndustrySectorChange}
        className="space-y-2 mb-4 flex-1"
      >
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="technology" id="tech" className="mr-3" />
          <Label htmlFor="tech" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">💻 Technology</span>
            <p className="text-sm text-gray-700">Software, hardware, AI, and tech innovation</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="healthcare" id="healthcare" className="mr-3" />
          <Label htmlFor="healthcare" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏥 Healthcare & Pharmaceuticals</span>
            <p className="text-sm text-gray-700">Medical devices, biotech, and pharma companies</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="financial" id="financial" className="mr-3" />
          <Label htmlFor="financial" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏦 Financial Services</span>
            <p className="text-sm text-gray-700">Banks, insurance, fintech, and payment systems</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="energy" id="energy" className="mr-3" />
          <Label htmlFor="energy" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">⚡ Energy & Utilities</span>
            <p className="text-sm text-gray-700">Renewable energy, oil & gas, power generation</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="consumer" id="consumer" className="mr-3" />
          <Label htmlFor="consumer" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🛍️ Consumer Goods</span>
            <p className="text-sm text-gray-700">Retail, food & beverage, lifestyle brands</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <RadioGroupItem value="industrial" id="industrial" className="mr-3" />
          <Label htmlFor="industrial" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">🏭 Industrial & Manufacturing</span>
            <p className="text-sm text-gray-700">Machinery, aerospace, automotive, logistics</p>
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextStep} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 4: Searchable Tags
  const renderSearchableTags = () => (
    <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
          <span className="material-icons">arrow_back</span>
        </Button>
        <h2 className="text-lg font-semibold ml-2">Searchable Tags</h2>
      </div>

      {/* Progress Bar */}
      <Progress value={getProgressPercentage()} className="h-1 mb-4" />

      <p className="text-gray-600 mb-4 text-sm">Select tags that describe your investment style and interests:</p>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="value-investor" 
            checked={formData.searchableTags.includes("value-investor")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("value-investor", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="value-investor" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#ValueInvestor</span>
            <p className="text-sm text-gray-700">Focus on undervalued stocks with strong fundamentals</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="growth-investor" 
            checked={formData.searchableTags.includes("growth-investor")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("growth-investor", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="growth-investor" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#GrowthInvestor</span>
            <p className="text-sm text-gray-700">Invest in companies with high growth potential</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="dividend-investor" 
            checked={formData.searchableTags.includes("dividend-investor")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("dividend-investor", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="dividend-investor" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#DividendInvestor</span>
            <p className="text-sm text-gray-700">Focus on dividend-paying stocks for steady income</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="swing-trader" 
            checked={formData.searchableTags.includes("swing-trader")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("swing-trader", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="swing-trader" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#SwingTrader</span>
            <p className="text-sm text-gray-700">Short to medium-term trading strategies</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="long-term-investor" 
            checked={formData.searchableTags.includes("long-term-investor")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("long-term-investor", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="long-term-investor" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#LongTermInvestor</span>
            <p className="text-sm text-gray-700">Buy and hold strategy for wealth building</p>
          </Label>
        </div>
        
        <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Checkbox 
            id="esg-investor" 
            checked={formData.searchableTags.includes("esg-investor")} 
            onCheckedChange={(checked) => handleSearchableTagsChange("esg-investor", checked as boolean)}
            className="mr-3" 
          />
          <Label htmlFor="esg-investor" className="flex-1 cursor-pointer">
            <span className="font-medium text-gray-800">#ESGInvestor</span>
            <p className="text-sm text-gray-700">Environmental, social, and governance focused investing</p>
          </Label>
        </div>
      </div>

      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextStep} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 5: Risk Profile
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

      <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
        <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextStep} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );

  // Step 6: Recommended Experts
  const renderRecommendedExperts = () => {
    const recommendedExperts = [
      {
        id: "expert1",
        name: "Rajesh Kumar",
        title: "Value Investor | 10Y Exp | NISM Certified",
        followers: "8.5K",
        successRate: "86%",
        avgReturn: "+20.20%",
        avatar: null,
        specialization: "Technology & Financial Stocks"
      },
      {
        id: "expert2", 
        name: "Priya Sharma",
        title: "Growth Investor | Energy Specialist",
        followers: "14.6K",
        successRate: "82%",
        avgReturn: "+40.30%",
        avatar: null,
        specialization: "Energy & Renewable Sector"
      },
      {
        id: "expert3",
        name: "Vikram Patel", 
        title: "Technical Analyst | Options Trading",
        followers: "10.9K",
        successRate: "78%",
        avgReturn: "+21.00%",
        avatar: null,
        specialization: "Options & Derivatives"
      },
      {
        id: "expert4",
        name: "Anita Desai",
        title: "Sector Rotation Expert | Corporate Insider",
        followers: "11.4K", 
        successRate: "74%",
        avgReturn: "+29.20%",
        avatar: null,
        specialization: "Technology & Corporate Analysis"
      },
      {
        id: "expert5",
        name: "Arjun Singh",
        title: "Momentum Trader | Growth Stocks",
        followers: "23.9K",
        successRate: "79%", 
        avgReturn: "+31.00%",
        avatar: null,
        specialization: "Growth & Momentum Trading"
      }
    ];

    return (
      <div className="px-4 py-4 flex flex-col w-full h-screen overflow-auto">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={goToPreviousStep} className="text-gray-500">
            <span className="material-icons">arrow_back</span>
          </Button>
          <h2 className="text-lg font-semibold ml-2">Recommended Experts</h2>
        </div>

        {/* Progress Bar */}
        <Progress value={getProgressPercentage()} className="h-1 mb-4" />

        <p className="text-gray-600 mb-4 text-sm">Follow these top-performing experts to get personalized investment insights:</p>

        <div className="space-y-3 mb-4 flex-1">
          {recommendedExperts.map((expert) => (
            <div key={expert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {expert.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{expert.name}</h4>
                      <p className="text-xs text-gray-600">{expert.title}</p>
                      <p className="text-xs text-blue-600 mt-1">{expert.specialization}</p>
                    </div>
                    
                    <Checkbox 
                      checked={formData.followingExperts.includes(expert.id)} 
                      onCheckedChange={(checked) => handleExpertFollowChange(expert.id, checked as boolean)}
                      data-testid={`checkbox-follow-${expert.id}`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{expert.followers} followers</span>
                    <span>{expert.successRate} success rate</span>
                    <span className="text-green-600">{expert.avgReturn} avg return</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex space-x-3 pb-6 safe-area-bottom">
          <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
            Back
          </Button>
          <Button onClick={goToNextStep} className="flex-1">
            Next
          </Button>
        </div>
      </div>
    );
  };

  // Step 7: Generated Profile
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
          <h2 className="text-lg sm:text-xl font-semibold ml-2">Your Wealth Seeker Profile</h2>
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

        <div className="mt-auto pb-6 safe-area-bottom">
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

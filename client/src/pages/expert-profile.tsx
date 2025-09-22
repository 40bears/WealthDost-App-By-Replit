import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Upload, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Portfolio Upload Component
const PortfolioUploadComponent = () => {
  const [stockName, setStockName] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");

  const handleAddStock = () => {
    if (!stockName || !entryPrice || !targetPrice) {
      alert("Please fill in all required fields");
      return;
    }
    
    console.log({
      stockName,
      entryDate,
      entryPrice,
      targetPrice,
      stopLoss,
      timeHorizon
    });
    
    setStockName("");
    setEntryDate("");
    setEntryPrice("");
    setTargetPrice("");
    setStopLoss("");
    setTimeHorizon("");
    
    alert("Stock pick added successfully!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      alert("CSV upload feature coming soon!");
    } else {
      alert("Please select a valid CSV file");
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Options */}
      <div className="space-y-3">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <Upload className="h-5 w-5 text-gray-600 mr-3" />
                <span className="font-medium">Upload CSV File</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => alert("Brokerage API connection feature coming soon!")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <div className="font-medium">Connect Brokerage API</div>
                  <div className="text-sm text-gray-500">(Zerodha, Upstox)</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Entry Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Add Tracked Call</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="stockName" className="text-sm font-medium text-gray-700">
              Stock Name
            </Label>
            <Input
              id="stockName"
              type="text"
              placeholder="Enter stock symbol (e.g., RELIANCE)"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="entryDate" className="text-sm font-medium text-gray-700">
                Entry Date & Price
              </Label>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="entryPrice" className="text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                id="entryPrice"
                type="number"
                placeholder="0.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="targetPrice" className="text-sm font-medium text-gray-700">
                Target Price & SL
              </Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="stopLoss" className="text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="0.00"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="timeHorizon" className="text-sm font-medium text-gray-700">
              Time Horizon
            </Label>
            <Input
              id="timeHorizon"
              type="text"
              placeholder="e.g., 3-6 months, 1 year"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button 
            onClick={handleAddStock}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            Add
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const ExpertProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Expert data
  const expertData = {
    name: "Rajesh Kumar",
    title: "Value Investor | 10Y Exp | NISM Certified",
    rating: 4.7,
    reviews: 120,
    followers: 8500,
    profileImage: null,
    badges: ["NISM Certified", "CFA Level 2", "Top Performer"],
    overallReturn: "+18.2%",
    niftyReturn: "+11.4%",
    accuracy: "72.3%",
    avgHolding: "14 days",
    riskProfile: "Balanced"
  };

  const trackRecord = [
    {
      date: "12 Jan 2025",
      stock: "TCS",
      callType: "Buy",
      entryPrice: 3200,
      target: 3600,
      currentPrice: 3550,
      gainLoss: "+10.9%",
      duration: "2 Months"
    },
    {
      date: "08 Jan 2025",
      stock: "HDFC Bank",
      callType: "Buy",
      entryPrice: 1450,
      target: 1650,
      currentPrice: 1580,
      gainLoss: "+8.9%",
      duration: "1 Month"
    },
    {
      date: "20 Dec 2024",
      stock: "Infosys",
      callType: "Sell",
      entryPrice: 1890,
      target: 1700,
      currentPrice: 1750,
      gainLoss: "+7.4%",
      duration: "3 Weeks"
    },
    {
      date: "15 Dec 2024",
      stock: "Reliance",
      callType: "Buy",
      entryPrice: 2400,
      target: 2700,
      currentPrice: 2650,
      gainLoss: "+10.4%",
      duration: "1 Month"
    }
  ];

  const liveRecommendations = [
    {
      stock: "ICICI Bank",
      callType: "Buy",
      entryPrice: 1180,
      target: 1300,
      stopLoss: 1120,
      confidence: "High",
      reasoning: "Strong Q3 results expected, NII growth momentum continues"
    },
    {
      stock: "Asian Paints",
      callType: "Hold",
      entryPrice: 2850,
      target: 3200,
      stopLoss: 2700,
      confidence: "Medium",
      reasoning: "Demand recovery in rural markets, margin improvement expected"
    }
  ];

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "Free",
      duration: "month",
      features: ["Weekly market updates", "Basic stock recommendations", "Community access"],
      popular: false
    },
    {
      name: "Pro",
      price: "₹299",
      duration: "month",
      features: ["Daily recommendations", "Live alerts", "Portfolio tracking", "Priority support"],
      popular: true
    },
    {
      name: "Premium",
      price: "₹599",
      duration: "month",
      features: ["Everything in Pro", "Weekly webinars", "1-on-1 session monthly"],
      popular: false
    }
  ];

  const customSessions = [
    {
      title: "Learn My Research Workflow",
      price: "₹499",
      duration: "45 min",
      format: "Video Call",
      description: "I'll walk you through how I analyze companies, structure notes, and build conviction. Includes free research checklist template.",
      includes: ["Live screen sharing", "Q&A session", "Research template PDF", "Follow-up notes"],
      popular: true
    },
    {
      title: "Quick Portfolio Review",
      price: "₹299",
      duration: "20 min",
      format: "Chat + Voice",
      description: "Share your portfolio and get expert feedback on allocation, stock selection, and improvement suggestions.",
      includes: ["Portfolio analysis", "Improvement suggestions", "Risk evaluation", "Action items list"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Back Button */}
          <div className="flex items-center mb-3">
            <Link href="/experts">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <span className="material-icons text-lg">arrow_back</span>
              </Button>
            </Link>
            <h2 className="text-base font-medium ml-3">Expert Profile</h2>
          </div>
          
          <div className="flex items-start space-x-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
                {expertData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-lg font-semibold">{expertData.name}</h1>
                <span className="material-icons text-blue-500 text-sm">verified</span>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{expertData.title}</p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {expertData.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <span className="flex items-center">
                  <span className="material-icons text-yellow-500 text-sm mr-1">star</span>
                  {expertData.rating} ({expertData.reviews} reviews)
                </span>
                <span>{expertData.followers.toLocaleString()} followers</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                className={`text-xs ${isFollowing ? 'bg-gray-200 text-gray-700' : 'bg-purple-600 text-white'}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <span className="material-icons text-sm mr-1">share</span>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        <Tabs defaultValue="performance" className="w-full">
          <div className="sticky top-[140px] bg-gray-50 z-10 px-4 pt-2">
            <TabsList className="grid w-full grid-cols-4 mb-2">
              <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
              <TabsTrigger value="picks" className="text-xs">Live Picks</TabsTrigger>
              <TabsTrigger value="about" className="text-xs">About</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4">
            <TabsContent value="portfolio" className="space-y-4 mt-0">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Portfolio Upload</h3>
                <p className="text-gray-600 text-sm mb-4">Upload and track your stock recommendations to showcase your expertise.</p>
                <PortfolioUploadComponent />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4 mt-0">
              {/* Performance Overview Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Performance Overview</h3>
                    <div className="flex space-x-1">
                      {["1M", "3M", "6M", "1Y"].map((period) => (
                        <Button
                          key={period}
                          variant={selectedTimeframe === period ? "default" : "outline"}
                          size="sm"
                          className="text-xs px-2 py-1 h-6"
                          onClick={() => setSelectedTimeframe(period)}
                        >
                          {period}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-base font-semibold text-green-600">{expertData.overallReturn}</div>
                      <div className="text-xs text-gray-500">Overall Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold text-blue-600">{expertData.niftyReturn}</div>
                      <div className="text-xs text-gray-500">vs Nifty 50</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold text-purple-600">{expertData.accuracy}</div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold text-orange-600">{expertData.avgHolding}</div>
                      <div className="text-xs text-gray-500">Avg Holding</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Track Record */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold">Recent Track Record</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {trackRecord.map((record, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{record.stock}</span>
                              <Badge 
                                variant={record.callType === "Buy" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {record.callType}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{record.date}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold text-sm ${record.gainLoss.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {record.gainLoss}
                            </div>
                            <div className="text-xs text-gray-500">{record.duration}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Entry: </span>
                            <span className="font-medium">₹{record.entryPrice}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Target: </span>
                            <span className="font-medium">₹{record.target}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Current: </span>
                            <span className="font-medium">₹{record.currentPrice}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="picks" className="space-y-4 mt-0">
              {/* Live Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold">Live Recommendations</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {liveRecommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{rec.stock}</span>
                              <Badge 
                                variant={rec.callType === "Buy" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {rec.callType}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {rec.confidence}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-500">Entry: </span>
                            <span className="font-medium">₹{rec.entryPrice}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Target: </span>
                            <span className="font-medium">₹{rec.target}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">SL: </span>
                            <span className="font-medium">₹{rec.stopLoss}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                          <strong>Reasoning:</strong> {rec.reasoning}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about" className="space-y-4 mt-0">
              {/* About Expert */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold">About {expertData.name}</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      Rajesh Kumar is a seasoned value investor with over 10 years of experience in the Indian stock market. 
                      He specializes in identifying undervalued stocks with strong fundamentals and long-term growth potential.
                    </p>
                    
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Investment Philosophy</h4>
                      <ul className="text-xs space-y-1 text-gray-600">
                        <li>• Focus on fundamentally strong companies</li>
                        <li>• Long-term value creation approach</li>
                        <li>• Risk-adjusted returns prioritized</li>
                        <li>• Sector rotation based on market cycles</li>
                      </ul>
                    </div>
                    
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Banking & Finance</Badge>
                        <Badge variant="outline" className="text-xs">Technology</Badge>
                        <Badge variant="outline" className="text-xs">Healthcare</Badge>
                        <Badge variant="outline" className="text-xs">Consumer Goods</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Fixed Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-purple-600 text-white text-sm" 
              size="sm"
              onClick={() => setShowSubscriptionPlans(true)}
            >
              Subscribe
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-sm" 
              size="sm"
              onClick={() => setShowBookingModal(true)}
            >
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Plans Modal */}
      {showSubscriptionPlans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSubscriptionPlans(false)}
                >
                  <span className="material-icons">close</span>
                </Button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto">
              <div className="space-y-3">
                {subscriptionPlans.map((plan, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${plan.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{plan.name}</h4>
                        {plan.popular && (
                          <Badge className="text-xs mt-1 bg-purple-600 text-white">Most Popular</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{plan.price}</span>
                        {plan.price !== "Free" && <span className="text-xs text-gray-500">/{plan.duration}</span>}
                      </div>
                    </div>
                    
                    <ul className="text-xs text-gray-600 space-y-1 mb-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="material-icons text-green-500 text-sm mr-1">check</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full text-xs ${plan.popular ? 'bg-purple-600 text-white' : ''}`} 
                      variant={plan.popular ? "default" : "outline"}
                      size="sm"
                    >
                      {plan.price === "Free" ? "Get Started" : "Subscribe Now"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Sessions Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Book a Session</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBookingModal(false)}
                >
                  <span className="material-icons">close</span>
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Choose from {expertData.name}'s custom sessions</p>
            </div>
            
            <div className="p-4">
              {/* Compact Session Options */}
              <div className="space-y-3 mb-4">
                {customSessions.map((session, index) => (
                  <div key={index} className={`border rounded-lg p-3 ${session.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{session.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                          <span>{session.duration}</span>
                          <span>•</span>
                          <span>{session.format}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600">{session.price}</span>
                        {session.popular && (
                          <div className="text-xs text-purple-600 font-medium">Popular</div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full text-xs bg-purple-600 text-white" 
                      size="sm"
                    >
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>

              {/* Create Custom Session Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <span className="material-icons text-gray-400 text-2xl mb-2">add_circle_outline</span>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Create Custom Session</h4>
                <p className="text-xs text-gray-500 mb-3">Define your own session with custom pricing, duration and format</p>
                <Button variant="outline" size="sm" className="text-xs">
                  + Create Session
                </Button>
              </div>
              
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 text-center">
                Sessions are scheduled based on mutual availability
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertProfile;
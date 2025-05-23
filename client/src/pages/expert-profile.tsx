import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExpertProfile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1Y");

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
      stock: "Reliance",
      callType: "Sell",
      entryPrice: 2850,
      target: 2650,
      currentPrice: 2680,
      gainLoss: "+6.0%",
      duration: "3 Weeks"
    }
  ];

  const liveRecommendations = [
    {
      stock: "Infosys",
      buyPrice: 1420,
      target: 1580,
      stopLoss: 1350,
      reason: "Strong Q3 results expected"
    },
    {
      stock: "Asian Paints",
      buyPrice: 2890,
      target: 3200,
      stopLoss: 2750,
      reason: "Rural demand recovery"
    }
  ];

  const subscriptionPlans = [
    {
      name: "Free Plan",
      price: 0,
      features: ["Limited posts access", "1 monthly pick", "Basic insights"],
      popular: false
    },
    {
      name: "Pro Plan",
      price: 199,
      features: ["Full live recommendations", "Performance insights", "Priority support"],
      popular: true
    },
    {
      name: "VIP Plan",
      price: 499,
      features: ["Everything in Pro", "Weekly webinars", "1-on-1 session monthly"],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto p-4">
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
          
          <div className="flex space-x-2 mt-3">
            <Button className="flex-1 bg-purple-600 text-white text-xs" size="sm">
              Subscribe
            </Button>
            <Button variant="outline" className="flex-1 text-xs" size="sm">
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto pb-20">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4 sticky top-32 bg-white z-10 border-b">
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="track-record" className="text-xs">Track Record</TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs">Live Picks</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
          </TabsList>

          {/* Performance Overview Tab */}
          <TabsContent value="performance" className="p-4 space-y-4">
            {/* Overall Return Card */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Performance Overview</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{expertData.overallReturn}</div>
                    <div className="text-xs text-gray-500">Expert Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">{expertData.niftyReturn}</div>
                    <div className="text-xs text-gray-500">Nifty Return</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{expertData.accuracy}</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{expertData.avgHolding}</div>
                    <div className="text-xs text-gray-500">Avg Holding</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{expertData.riskProfile}</div>
                    <div className="text-xs text-gray-500">Risk Profile</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Winning Picks */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Top Winning Picks</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">TCS</span>
                    <span className="text-sm text-green-600 font-semibold">+24.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">HDFC Bank</span>
                    <span className="text-sm text-green-600 font-semibold">+18.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Infosys</span>
                    <span className="text-sm text-green-600 font-semibold">+15.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sector Strengths */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Sector Strengths</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>IT Services</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Banking</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>FMCG</span>
                      <span>20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Record Tab */}
          <TabsContent value="track-record" className="p-4 space-y-4">
            <div className="flex space-x-2 mb-4">
              {['1M', '3M', '6M', '1Y'].map((period) => (
                <Button
                  key={period}
                  variant={selectedTimeframe === period ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedTimeframe(period)}
                >
                  {period}
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Call History</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trackRecord.map((record, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{record.stock}</h4>
                          <p className="text-xs text-gray-500">{record.date}</p>
                        </div>
                        <Badge className={`text-xs ${record.callType === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {record.callType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Entry: </span>
                          <span>₹{record.entryPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Current: </span>
                          <span>₹{record.currentPrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Target: </span>
                          <span>₹{record.target.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Return: </span>
                          <span className="font-semibold text-green-600">{record.gainLoss}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Recommendations Tab */}
          <TabsContent value="recommendations" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Latest Picks</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveRecommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{rec.stock}</h4>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Live</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div>
                          <span className="text-gray-500">Buy @ </span>
                          <span className="font-semibold">₹{rec.buyPrice}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Target </span>
                          <span className="font-semibold">₹{rec.target}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">SL </span>
                          <span className="font-semibold">₹{rec.stopLoss}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{rec.reason}</p>
                      <Button size="sm" className="w-full mt-2 bg-purple-600 text-white text-xs">
                        Read Analysis
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Subscription Plans</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscriptionPlans.map((plan, index) => (
                    <div key={index} className={`border rounded-lg p-3 ${plan.popular ? 'border-purple-300 bg-purple-50' : ''}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{plan.name}</h4>
                          {plan.popular && <Badge className="bg-purple-600 text-white text-xs">Popular</Badge>}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">₹{plan.price}</span>
                          {plan.price > 0 && <span className="text-xs text-gray-500">/month</span>}
                        </div>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1 mb-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="material-icons text-green-500 text-sm mr-2">check</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" className={`w-full text-xs ${plan.popular ? 'bg-purple-600 text-white' : ''}`}>
                        {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Recent Insights</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">Bullish</Badge>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Q3 Results Season Outlook</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Banking sector showing strong fundamentals ahead of Q3 results. 
                      Expect HDFC Bank and ICICI to outperform...
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Read More
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Neutral</Badge>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Market Consolidation Phase</h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Markets likely to remain sideways in the near term. 
                      Focus on stock-specific opportunities...
                    </p>
                    <Button size="sm" variant="outline" className="text-xs">
                      Read More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Feedback */}
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-sm">Recent Reviews</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-200 text-xs">A</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">Amit S.</span>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map((star) => (
                          <span key={star} className="material-icons text-xs">star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      "Excellent stock picks! Made 15% return in just 2 months following his recommendations."
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gray-200 text-xs">P</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">Priya M.</span>
                      <div className="flex text-yellow-400">
                        {[1,2,3,4].map((star) => (
                          <span key={star} className="material-icons text-xs">star</span>
                        ))}
                        <span className="material-icons text-gray-300 text-xs">star</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      "Very detailed analysis and good track record. Worth subscribing to Pro plan."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating CTA Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="max-w-md mx-auto flex space-x-2">
          <Button className="flex-1 bg-purple-600 text-white text-sm">
            Subscribe ₹199/mo
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            Book Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MarketOverview from "@/components/dashboard/MarketOverview";
import FeatureNavigation from "@/components/dashboard/FeatureNavigation";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ContentFeed from "@/components/dashboard/ContentFeed";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define feature types for our top navigation
type FeatureType = "watchlist" | "analytics" | "debate" | "quiz" | "news";

// Define bottom tab types
type Tab = "home" | "experts" | "explore" | "top-analyst" | "invroom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeFeature, setActiveFeature] = useState<FeatureType>("watchlist");

  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Fetch feed posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
  });

  // Function to handle feature selection
  const handleFeatureSelect = (feature: FeatureType) => {
    setActiveFeature(feature);
  };

  // Render content based on selected feature
  const renderFeatureContent = () => {
    switch (activeFeature) {
      case "analytics":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">User-level financial behavior insights.</p>
            <MarketOverview data={typedMarketData} isLoading={isLoadingMarketData} />
            
            <div className="mt-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3">Risk Assessment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Risk Score</span>
                      <span className="text-sm font-medium">Medium (65/100)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-yellow-500 h-2 rounded-lg" style={{width: "65%"}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Diversification</span>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-lg" style={{width: "75%"}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Knowledge Score</span>
                      <span className="text-sm font-medium">Improving</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-lg" style={{width: "45%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3">Activity Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="material-icons text-primary mr-1 text-sm">quiz</span>
                      <span className="text-sm">Quizzes Completed</span>
                    </div>
                    <p className="text-xl font-medium">3</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="material-icons text-primary mr-1 text-sm">forum</span>
                      <span className="text-sm">Debates Joined</span>
                    </div>
                    <p className="text-xl font-medium">7</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="material-icons text-primary mr-1 text-sm">visibility</span>
                      <span className="text-sm">Watchlist Items</span>
                    </div>
                    <p className="text-xl font-medium">0</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <span className="material-icons text-primary mr-1 text-sm">psychology</span>
                      <span className="text-sm">Expert Queries</span>
                    </div>
                    <p className="text-xl font-medium">2</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-3">Personalized Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="material-icons text-blue-500 mr-2">lightbulb</span>
                    <p className="text-sm text-gray-700">Your quiz results show you might benefit from reading more about basic investment principles.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="material-icons text-blue-500 mr-2">lightbulb</span>
                    <p className="text-sm text-gray-700">Consider adding items to your watchlist to track market movements in areas of interest.</p>
                  </div>
                  <div className="flex items-start">
                    <span className="material-icons text-blue-500 mr-2">lightbulb</span>
                    <p className="text-sm text-gray-700">Join a Tribe to connect with investors who share your interests and risk profile.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "watchlist":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
            <p className="text-gray-600 mb-4">Track, monitor, and analyze investment interests.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <span className="material-icons text-4xl text-gray-400 mb-2">visibility</span>
                <h3 className="font-medium mb-1">Add stocks, crypto, or funds</h3>
                <p className="text-sm text-gray-500">Your watchlist is empty. Start adding assets to track.</p>
                <Button className="mt-4">Add Assets</Button>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <h3 className="font-medium">Features:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Live prices and percentage changes</li>
                <li>Set alerts on price, news, and volume</li>
                <li>Categorize by themes (e.g., Green Energy, Tech)</li>
                <li>Track sentiment metrics</li>
                <li>"Watch by Tribe" to see what others are tracking</li>
              </ul>
            </div>
          </div>
        );
      case "debate":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Financial Debates</h2>
            <p className="text-gray-600 mb-4">Community-sourced opinion battles and polls.</p>
            
            <Card>
              <CardHeader className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">forum</span>
                  <h3 className="font-semibold">Hot Debate</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Is AI overvalued in the current market?</h3>
                
                <div className="flex mb-4">
                  <div className="flex-1 pr-2">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <h4 className="text-green-800 font-medium text-sm mb-1">Bull Case</h4>
                      <p className="text-gray-700 text-sm">AI is transforming every industry and we're just at the beginning of its potential.</p>
                    </div>
                  </div>
                  <div className="flex-1 pl-2">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <h4 className="text-red-800 font-medium text-sm mb-1">Bear Case</h4>
                      <p className="text-gray-700 text-sm">Current valuations are based on hype rather than proven business models.</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-100 rounded-lg mb-3 overflow-hidden flex">
                  <div className="bg-primary rounded-l-lg transition-all" style={{width: "63%"}}></div>
                  <div className="bg-gray-300 rounded-r-lg transition-all" style={{width: "37%"}}></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <div>63% Bull</div>
                  <div>37% Bear</div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1">Vote Bull</Button>
                  <Button variant="secondary" className="flex-1">Vote Bear</Button>
                </div>
              </CardContent>
            </Card>
            
            <Button className="w-full mt-4">Start New Debate</Button>
          </div>
        );
      case "quiz":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Financial Quizzes</h2>
            <p className="text-gray-600 mb-4">Gamified learning for financial literacy.</p>
            
            <Card>
              <CardHeader className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">quiz</span>
                  <h3 className="font-semibold">Daily Quiz</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Test your knowledge!</h3>
                <p className="text-gray-700 text-sm mb-4">Complete today's quiz to earn XP and climb the leaderboard.</p>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-sm mb-2">What is the primary goal of value investing?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <input type="radio" name="investing" id="short-term" className="mr-3" />
                      <label htmlFor="short-term" className="cursor-pointer text-sm">Quick short-term profits</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <input type="radio" name="investing" id="undervalued" className="mr-3" />
                      <label htmlFor="undervalued" className="cursor-pointer text-sm">Finding undervalued stocks with long-term potential</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <input type="radio" name="investing" id="timing" className="mr-3" />
                      <label htmlFor="timing" className="cursor-pointer text-sm">Timing market movements precisely</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer">
                      <input type="radio" name="investing" id="diversifying" className="mr-3" />
                      <label htmlFor="diversifying" className="cursor-pointer text-sm">Diversifying across all sectors equally</label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Submit Answer</Button>
              </CardContent>
            </Card>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your Quiz Stats</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">XP Level:</span>
                <span className="font-medium">Novice</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Quizzes Completed:</span>
                <span className="font-medium">0/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Badge:</span>
                <span className="font-medium">Analyst (50 XP needed)</span>
              </div>
            </div>
          </div>
        );
      case "news":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">News Pulse</h2>
            <p className="text-gray-600 mb-4">Smart, personalized financial news hub.</p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">trending_up</span>
                  <h3 className="font-medium">Market Movers</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Top Stories</span>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-medium text-sm mb-1">Fed signals possible rate cuts later this year</h4>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-green-600 text-xs font-medium bg-green-50 px-1.5 py-0.5 rounded mr-2">Bullish</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <span className="text-xs text-blue-600">3 from your watchlist</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <p><span className="font-medium">What happened:</span> Federal Reserve Chair Powell indicated the central bank is preparing for interest rate cuts.</p>
                    <p className="mt-1"><span className="font-medium">Why it matters:</span> Lower rates could boost equities, particularly growth stocks that benefit from cheaper borrowing.</p>
                  </div>
                  <div className="flex text-xs">
                    <button className="text-primary flex items-center mr-3">
                      <span className="material-icons text-xs mr-1">add_circle</span>
                      Add to Watchlist
                    </button>
                    <button className="text-primary flex items-center mr-3">
                      <span className="material-icons text-xs mr-1">forum</span>
                      Debate
                    </button>
                    <button className="text-primary flex items-center">
                      <span className="material-icons text-xs mr-1">share</span>
                      Share
                    </button>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-medium text-sm mb-1">Tech giants face new AI regulations in EU</h4>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-red-600 text-xs font-medium bg-red-50 px-1.5 py-0.5 rounded mr-2">Bearish</span>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <span className="text-xs text-blue-600">Tech sector</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <p><span className="font-medium">What happened:</span> EU parliament approved stricter regulations on AI development and deployment.</p>
                    <p className="mt-1"><span className="font-medium">Why it matters:</span> Could increase compliance costs for tech companies leading AI development.</p>
                  </div>
                  <div className="flex text-xs">
                    <button className="text-primary flex items-center mr-3">
                      <span className="material-icons text-xs mr-1">add_circle</span>
                      Add to Watchlist
                    </button>
                    <button className="text-primary flex items-center mr-3">
                      <span className="material-icons text-xs mr-1">forum</span>
                      Debate
                    </button>
                    <button className="text-primary flex items-center">
                      <span className="material-icons text-xs mr-1">share</span>
                      Share
                    </button>
                  </div>
                </div>
              </div>
              
              <button className="w-full text-center text-primary text-sm mt-4">
                View more market news
              </button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">psychology</span>
                  <h3 className="font-medium">Think Like a Pro</h3>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Expert Analysis</span>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <h4 className="font-medium text-sm mb-1">Why commodities might outperform in H2 2025</h4>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-1">
                        <span className="material-icons text-blue-600 text-[10px]">verified</span>
                      </div>
                      <span className="text-xs text-gray-500">Ravi Mehta, CFA</span>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Global supply constraints combined with increasing industrial demand could create a perfect storm for commodity prices in the second half of the year.
                  </p>
                  <button className="text-primary text-xs">
                    Read full analysis
                  </button>
                </div>
              </div>
              
              <button className="w-full text-center text-primary text-sm mt-4">
                View more expert insights
              </button>
            </div>
          </div>
        );
      case "ask-expert":
        return (
          <div className="px-4 py-6">
            <h2 className="text-xl font-semibold mb-4">Ask an Expert</h2>
            <p className="text-gray-600 mb-4">Get answers from verified financial experts.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-3">Ask Your Question</h3>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg mb-3" 
                rows={3}
                placeholder="What would you like to ask our experts?"
              />
              <div className="flex mb-3">
                <Button className="w-full">Submit Question</Button>
              </div>
              <p className="text-xs text-gray-500">Our verified experts typically respond within 24 hours</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Popular Questions</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-1">How to start investing with ₹10,000?</h4>
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <span>Answered by</span>
                  <span className="font-medium ml-1">Priya Shah, CFA</span>
                  <div className="ml-1 bg-blue-100 text-blue-800 text-xs py-0.5 px-1 rounded inline-flex items-center">
                    <span className="material-icons text-xs mr-0.5">verified</span>
                    Expert
                  </div>
                </div>
                <p className="text-sm text-gray-600">Start with a mix of liquid funds, index funds, and maybe 1-2 blue-chip stocks. Focus on learning the basics of diversification while...</p>
                <Button variant="ghost" size="sm" className="mt-2 text-primary">Read full answer</Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <>
            <WelcomeCard />
            <MarketOverview data={typedMarketData} isLoading={isLoadingMarketData} />
            <ContentFeed posts={typedPosts} isLoading={isLoadingPosts} />
          </>
        );
    }
  };

  // Type assertions for data to fix typescript issues
  const typedMarketData = marketData as any[];
  const typedPosts = posts as any[];

  return (
    <div className="flex flex-col h-full relative">
      {/* Top App Bar */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">WealthDost</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <span className="material-icons">notifications_none</span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-200">
              <span className="material-icons text-gray-500">person</span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-auto pb-16">
        {/* Quick Nav Tabs */}
        <FeatureNavigation activeFeature={activeFeature} onFeatureSelect={handleFeatureSelect} />

        {/* Dynamic Content Area based on selected feature */}
        {renderFeatureContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Dashboard;

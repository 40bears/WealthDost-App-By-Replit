import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "wouter";
import MarketOverview from "@/components/dashboard/MarketOverview";
import FeatureNavigation from "@/components/dashboard/FeatureNavigation";
import BottomNavigation from "@/components/dashboard/BottomNavigation";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ContentFeed from "@/components/dashboard/ContentFeed";
import CreatePostModal from "@/components/dashboard/CreatePostModal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Upload, Link as LinkIcon, User, Settings, HelpCircle, LogOut, FileText, Heart, Activity, Bell, Shield, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Define feature types for our top navigation with empty string for default home feed
type FeatureType = "home_feed" | "watchlist" | "analytics" | "debate" | "quiz" | "news";

// Define bottom tab types
type Tab = "home" | "experts" | "explore" | "invroom" | "create";

// Define experts section tabs
type ExpertsTabType = "topAnalysts" | "ask" | "myPicks";

// Stock Pick Form Component
const StockPickFormComponent = () => {
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
    
    // Clear form after adding
    setStockName("");
    setEntryDate("");
    setEntryPrice("");
    setTargetPrice("");
    setStopLoss("");
    setTimeHorizon("");
    
    alert("Stock pick added successfully!");
  };

  return (
    <div className="space-y-4">
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
      >
        Add
      </Button>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeFeature, setActiveFeature] = useState<FeatureType>("home_feed");
  const [expertsTab, setExpertsTab] = useState<ExpertsTabType>("topAnalysts");
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // Fetch market data
  const { data: marketData, isLoading: isLoadingMarketData } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Fetch feed posts
  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
  });

  // Type assertions for data to fix typescript issues
  const typedMarketData = marketData as any[];
  const typedPosts = posts as any[];

  // Function to handle feature selection
  const handleFeatureSelect = (feature: FeatureType) => {
    if (feature === "watchlist") {
      // Navigate to watchlist page
      window.location.href = "/watchlist";
      return;
    }
    setActiveFeature(feature);
  };

  // Function to handle tab changes
  const handleTabChange = (tab: Tab) => {
    // Handle the create action without changing the active tab
    if (tab === "create") {
      console.log("Create post button clicked");
      setIsCreatePostModalOpen(true);
      return; // Don't change the active tab for create button
    }
    
    setActiveTab(tab);
    // When Home tab is clicked, reset to show posts feed
    if (tab === "home") {
      setActiveFeature("home_feed");
    }
  };

  // Function to render posts feed
  const renderPostsFeed = () => {
    // Mock posts data when API returns empty
    const mockPosts = [
      {
        id: 1,
        userId: 101,
        author: "Rahul Sharma",
        profileImageUrl: null,
        content: "Just added Tesla to my watchlist. Their new energy storage solutions look promising for long-term growth.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        likes: 24,
        comments: 7,
        tags: ["tech", "stocks", "renewable"]
      },
      {
        id: 2,
        userId: 102,
        author: "Priya Mehta",
        profileImageUrl: null,
        content: "What are your thoughts on investing in small-cap funds in the current market? Looking for some expert opinions.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likes: 15,
        comments: 12,
        tags: ["mutualfunds", "smallcap"]
      },
      {
        id: 3,
        userId: 103,
        author: "Vikram Patel",
        profileImageUrl: null,
        content: "Attended a great webinar on sustainable investing today. The green energy transition is creating some interesting opportunities in the market.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        likes: 32,
        comments: 8,
        tags: ["sustainable", "greeninvesting"]
      }
    ];

    // User profile with interests
    const userInterests = ["Tech Stocks", "Renewable Energy", "Mutual Funds", "Real Estate"];

    return (
      <div className="px-4 py-6">
        
        {/* Market Highlights Section */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Market Highlights</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">NIFTY</span>
                <span className="text-purple-600 text-xs font-medium">+0.8%</span>
              </div>
              <div className="text-sm font-semibold my-0.5">24,305</div>
              <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden">
                <div className="bg-purple-600 h-full" style={{width: '70%'}}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">SENSEX</span>
                <span className="text-purple-600 text-xs font-medium">+0.6%</span>
              </div>
              <div className="text-sm font-semibold my-0.5">80,245</div>
              <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden">
                <div className="bg-purple-600 h-full" style={{width: '65%'}}></div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">BNKNIFTY</span>
                <span className="text-purple-600 text-xs font-medium">-0.2%</span>
              </div>
              <div className="text-sm font-semibold my-0.5">52,187</div>
              <div className="w-full h-1 bg-gray-100 rounded-sm overflow-hidden">
                <div className="bg-purple-600 h-full" style={{width: '40%'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Posts Section */}
        <div className="relative">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Community Feed</h3>
            <Button variant="ghost" size="sm" className="text-xs flex items-center">
              <span className="material-icons text-sm mr-1">filter_list</span>
              Filter
            </Button>
          </div>
          
          {/* Show API posts if available, otherwise show mock posts */}
          {typedPosts && typedPosts.length > 0 ? (
            <ContentFeed posts={typedPosts} isLoading={isLoadingPosts} />
          ) : (
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {post.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{post.author}</h4>
                      <p className="text-xs text-gray-500">{post.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {post.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex text-xs text-gray-500">
                    <button className="flex items-center mr-4 click-bounce">
                      <span className="material-icons text-sm mr-1">thumb_up</span>
                      {post.likes}
                    </button>
                    <button className="flex items-center mr-4 click-bounce">
                      <span className="material-icons text-sm mr-1">comment</span>
                      {post.comments}
                    </button>
                    <button className="flex items-center click-bounce">
                      <span className="material-icons text-sm mr-1">share</span>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* No floating button needed since we have it in the bottom navigation */}
        </div>
      </div>
    );
  };

  // Render content based on selected feature
  const renderFeatureContent = () => {
    // If home feed is selected, show posts feed first
    if (activeFeature === "home_feed") {
      return renderPostsFeed();
    }
    
    switch (activeFeature) {
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
                <Button className="mt-4 btn-pulse">Add Assets</Button>
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
                  <Button className="flex-1 btn-ripple">Vote Bull</Button>
                  <Button variant="secondary" className="flex-1 btn-ripple">Vote Bear</Button>
                </div>
              </CardContent>
            </Card>
            
            <Button className="w-full mt-4 btn-pulse">Start New Debate</Button>
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
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer click-bounce">
                      <input type="radio" name="investing" id="short-term" className="mr-3" />
                      <label htmlFor="short-term" className="cursor-pointer text-sm">Quick short-term profits</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer click-bounce">
                      <input type="radio" name="investing" id="undervalued" className="mr-3" />
                      <label htmlFor="undervalued" className="cursor-pointer text-sm">Finding undervalued stocks with long-term potential</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer click-bounce">
                      <input type="radio" name="investing" id="timing" className="mr-3" />
                      <label htmlFor="timing" className="cursor-pointer text-sm">Timing market movements precisely</label>
                    </div>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer click-bounce">
                      <input type="radio" name="investing" id="diversifying" className="mr-3" />
                      <label htmlFor="diversifying" className="cursor-pointer text-sm">Diversifying across all sectors equally</label>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full btn-pulse">Submit Answer</Button>
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
                    <button className="text-primary flex items-center mr-3 click-bounce">
                      <span className="material-icons text-xs mr-1">add_circle</span>
                      Add to Watchlist
                    </button>
                    <button className="text-primary flex items-center mr-3 click-bounce">
                      <span className="material-icons text-xs mr-1">forum</span>
                      Debate
                    </button>
                    <button className="text-primary flex items-center click-bounce">
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
                    <button className="text-primary flex items-center mr-3 click-bounce">
                      <span className="material-icons text-xs mr-1">add_circle</span>
                      Add to Watchlist
                    </button>
                    <button className="text-primary flex items-center mr-3 click-bounce">
                      <span className="material-icons text-xs mr-1">forum</span>
                      Debate
                    </button>
                    <button className="text-primary flex items-center click-bounce">
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
                  <button className="text-primary text-xs click-bounce">
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
        
      default:
        return renderPostsFeed();
    }
  };

  // Render the experts tab content
  const renderExpertsContent = () => {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Experts</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setExpertsTab("topAnalysts")} 
              className={`px-3 py-1 text-sm rounded-full font-medium click-bounce ${expertsTab === "topAnalysts" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Top Analysts
            </button>
            <button 
              onClick={() => setExpertsTab("ask")} 
              className={`px-3 py-1 text-sm rounded-full font-medium click-bounce ${expertsTab === "ask" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
            >
              Ask
            </button>
            <button 
              onClick={() => setExpertsTab("myPicks")} 
              className={`px-3 py-1 text-sm rounded-full font-medium click-bounce ${expertsTab === "myPicks" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`}
            >
              My Picks
            </button>
          </div>
        </div>
        
        {expertsTab === "topAnalysts" && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Track and follow performance of community analysts.</p>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-3">Analyst Leaderboard</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg mb-3 border-l-4 border-primary">
                  <div className="flex-shrink-0 mr-3 relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">RS</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">1</div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h4 className="font-medium">Rahul Singh</h4>
                      <div className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-1 rounded inline-flex items-center">
                        <span className="material-icons text-xs mr-0.5">verified</span>
                        <span>Pro</span>
                      </div>
                      <div className="ml-auto">
                        <Button variant="outline" size="sm" className="btn-pulse">Follow</Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Technical Analysis • 94% accuracy</p>
                    <div className="flex items-center text-xs mt-1">
                      <div className="bg-green-100 text-green-800 py-0.5 px-1 rounded mr-2">
                        +32.5% YTD
                      </div>
                      <span className="text-gray-500">43K followers</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                  <div className="flex-shrink-0 mr-3 relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-500 text-white">MP</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">2</div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h4 className="font-medium">Meera Patel</h4>
                      <div className="ml-2 bg-gray-100 text-gray-800 text-xs py-0.5 px-1 rounded inline-flex items-center">
                        <span>Fundamental</span>
                      </div>
                      <div className="ml-auto">
                        <Button variant="outline" size="sm" className="btn-pulse">Follow</Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Fundamental Analysis • 87% accuracy</p>
                    <div className="flex items-center text-xs mt-1">
                      <div className="bg-green-100 text-green-800 py-0.5 px-1 rounded mr-2">
                        +27.1% YTD
                      </div>
                      <span className="text-gray-500">28K followers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/expert/1">
                <button className="w-full text-center text-primary text-sm mt-4 btn-pulse">
                  View Expert Profile
                </button>
              </Link>
            </div>
          </div>
        )}
        
        {expertsTab === "ask" && (
          <div>
            <p className="text-gray-600 mb-4">Get answers from verified financial experts.</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-3">Ask Your Question</h3>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg mb-3" 
                rows={3}
                placeholder="What would you like to ask our experts?"
              />
              <div className="flex mb-3">
                <Button className="w-full btn-pulse">Submit Question</Button>
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
                <Button variant="ghost" size="sm" className="mt-2 text-primary btn-pulse">Read full answer</Button>
              </div>
            </div>
          </div>
        )}

        {expertsTab === "myPicks" && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">Upload and track your stock recommendations to showcase your expertise.</p>
            
            <div className="space-y-4">
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
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.type === "text/csv") {
                            alert("CSV upload feature coming soon!");
                          } else {
                            alert("Please select a valid CSV file");
                          }
                        }}
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

              {/* Add Stock Pick Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-4">Add Stock Pick</h4>
                <StockPickFormComponent />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render explore tab content
  const renderExploreContent = () => {
    return (
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Explore</h2>
        <p className="text-gray-600 mb-4">Discover trending content, new users, and tools.</p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Trending Topics</h3>
            <span className="text-xs text-gray-500">This Week</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer click-bounce">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">trending_up</span>
                <span>#AIStocks</span>
              </div>
              <span className="text-xs text-gray-500">1,243 posts</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer click-bounce">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">trending_up</span>
                <span>#FedRateDecision</span>
              </div>
              <span className="text-xs text-gray-500">987 posts</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render investment room tab content
  const renderInvRoomContent = () => {
    return (
      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Investment Rooms</h2>
        <p className="text-gray-600 mb-4">Virtual portfolio-building and discussion spaces.</p>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-center p-6">
            <span className="material-icons text-4xl text-gray-400 mb-3">meeting_room</span>
            <h3 className="font-medium mb-2">Create or Join an Investment Room</h3>
            <p className="text-sm text-gray-500 mb-4">Collaborate on mock portfolios, discuss investment strategies, and learn together.</p>
            
            <div className="flex flex-col space-y-3">
              <Button className="btn-pulse">Create New Room</Button>
              <Button variant="outline" className="btn-pulse">Browse Public Rooms</Button>
              <Button variant="ghost" className="btn-pulse">Enter Room Code</Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-3">Featured Rooms</h3>
          
          <div className="space-y-3">
            <div className="border border-gray-100 rounded-lg p-3 hover:border-primary transition cursor-pointer click-bounce">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Growth Investors Club</h4>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">+18.4% YTD</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Collaborative portfolio focused on high-growth tech and renewable energy stocks.</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>42 members</span>
                <span>7 active discussions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on selected bottom tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return renderFeatureContent();
      case "experts":
        return renderExpertsContent();
      case "explore":
        return renderExploreContent();
      case "invroom":
        return renderInvRoomContent();
      default:
        return renderPostsFeed();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[800px] max-w-md mx-auto relative overflow-hidden">
      {/* Top App Bar - Fixed */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20">
        <h1 className="text-xl font-bold text-primary">WealthDost</h1>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-500 click-bounce">
            <span className="material-icons">notifications_none</span>
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 click-bounce cursor-pointer hover:ring-2 hover:ring-purple-200 transition-all">
                <AvatarFallback className="bg-gray-200">
                  <span className="material-icons text-gray-500">person</span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {/* Profile Overview */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        RK
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">Rahul Kumar</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        Smart Investor
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Navigation Options */}
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Posts</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "/watchlist"}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Activity</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              {/* Settings */}
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notification Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Globe className="mr-2 h-4 w-4" />
                  <span>Language & Region</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              {/* Support */}
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help Center</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Report Bug / Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span className="material-icons mr-2 text-base">support_agent</span>
                  <span>Contact Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* No banner here - removed as requested */}

      {/* Quick Nav Tabs (only visible on home tab) - Fixed */}
      {activeTab === "home" && (
        <div className="sticky top-[60px] z-10 bg-white">
          <FeatureNavigation activeFeature={activeFeature || ""} onFeatureSelect={handleFeatureSelect} />
        </div>
      )}

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow overflow-auto pb-16">
        {/* Dynamic Content Area based on selected tab */}
        {renderTabContent()}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
      
      {/* Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white z-20 max-w-md mx-auto">
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default Dashboard;
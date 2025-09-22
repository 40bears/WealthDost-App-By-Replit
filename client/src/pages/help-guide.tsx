import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Play, BookOpen, TrendingUp, Users, Bell, Settings } from "lucide-react";

export default function HelpGuide() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const guideSection = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      steps: [
        "Create your account and choose your role (Investor or Expert)",
        "Complete your profile with investment interests and experience level", 
        "Explore the dashboard to understand key features",
        "Start following experts and joining investment rooms",
        "Create your first post or add items to your watchlist"
      ]
    },
    {
      id: "watchlist",
      title: "Using Watchlist",
      icon: TrendingUp,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      steps: [
        "Tap the '+' button to add stocks, mutual funds, or crypto",
        "Search for assets by name or symbol",
        "Set price alerts by tapping the bell icon",
        "Organize assets into themed lists (Tech, Banking, etc.)",
        "Monitor performance and get notifications"
      ]
    },
    {
      id: "community",
      title: "Community Features",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      steps: [
        "Browse the home feed for latest posts and analysis",
        "Like, comment, and share posts you find valuable",
        "Follow experts and other users for personalized feed",
        "Join investment rooms based on your interests",
        "Participate in debates and quizzes to learn"
      ]
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      steps: [
        "Enable push notifications in your device settings",
        "Set price alerts on watchlist items",
        "Get notified when experts you follow post updates",
        "Receive market news and analysis notifications", 
        "Customize notification preferences in Settings"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/help-center">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">User Guide</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4">
        
        {/* Quick Start Video */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Play className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Start Video</h3>
                <p className="text-sm text-gray-600">3 min overview</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Watch Tutorial
            </Button>
          </CardContent>
        </Card>

        {/* Guide Sections */}
        {guideSection.map((section) => {
          const IconComponent = section.icon;
          const isExpanded = activeSection === section.id;
          
          return (
            <Card key={section.id}>
              <CardContent className="p-4">
                <button
                  onClick={() => setActiveSection(isExpanded ? null : section.id)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${section.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${section.color}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{section.title}</h3>
                        <p className="text-sm text-gray-600">Step by step guide</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ol className="space-y-3">
                      {section.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <p className="text-sm text-gray-700">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Settings Guide</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Investment Basics</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Still Need Help */}
        <Card>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-sm text-gray-600 mb-3">Our support team is here to assist you</p>
            <Link href="/help/contact">
              <Button className="w-full">Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
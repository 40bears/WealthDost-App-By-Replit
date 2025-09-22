import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, MessageCircle, Heart, Star } from "lucide-react";
import { Link } from "wouter";

const Activity = () => {
  const [activeTab, setActiveTab] = useState("all");

  const activities = [
    {
      id: 1,
      type: "like",
      title: "Liked your post about Tesla stock analysis",
      user: "Priya Sharma",
      time: "2 hours ago",
      details: "Your insights on Tesla's Q4 earnings were spot on!",
      icon: Heart,
      color: "text-red-500"
    },
    {
      id: 2,
      type: "comment",
      title: "Commented on your Reliance Industries post",
      user: "Amit Patel",
      time: "4 hours ago",
      details: "Great analysis! What's your view on their renewable energy investments?",
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 3,
      type: "follow",
      title: "Started following you",
      user: "Neha Gupta",
      time: "1 day ago",
      details: "Looking forward to your investment insights!",
      icon: Star,
      color: "text-yellow-500"
    },
    {
      id: 4,
      type: "quiz",
      title: "Completed Financial Literacy Quiz",
      user: "You",
      time: "2 days ago",
      details: "Scored 85% on Advanced Options Trading quiz",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      id: 5,
      type: "like",
      title: "Liked your comment on HDFC Bank discussion",
      user: "Rajesh Kumar",
      time: "3 days ago",
      details: "Your point about digital banking transformation was insightful",
      icon: Heart,
      color: "text-red-500"
    }
  ];

  const tabOptions = [
    { value: "all", label: "All" },
    { value: "likes", label: "Likes" },
    { value: "comments", label: "Comments" },
    { value: "achievements", label: "Achievements" }
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    if (activeTab === "likes") return activity.type === "like";
    if (activeTab === "comments") return activity.type === "comment";
    if (activeTab === "achievements") return activity.type === "quiz" || activity.type === "follow";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-1 text-gray-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Activity</h1>
            <div className="w-8"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveTab(option.value)}
                className={`flex-1 text-xs py-2 px-3 rounded-md transition-colors ${
                  activeTab === option.value
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {/* Activity Summary */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <h3 className="font-semibold">This Week's Summary</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-red-500">12</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-500">8</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-500">3</div>
                <div className="text-xs text-gray-500">Quiz Scores</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-500">5</div>
                <div className="text-xs text-gray-500">New Followers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-50 ${activity.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {activity.user !== "You" && (
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                              {activity.user.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.user !== "You" && (
                              <span className="text-purple-600">{activity.user} </span>
                            )}
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      
                      {activity.details && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded p-2">
                          {activity.details}
                        </p>
                      )}
                      
                      {activity.type === "quiz" && (
                        <Badge variant="secondary" className="mt-2">
                          Achievement Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-gray-400 text-2xl">notifications_none</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-500 text-sm">Start engaging with the community to see your activity here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, BarChart3, ArrowLeft } from "lucide-react";

const TribeDetail = () => {
  const { id } = useParams({ from: '/_auth/tribe/$id' });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discussion");

  // Mock data - would be fetched from API based on tribe ID
  const tribe = {
    id: Number(id),
    name: "Value Investing Masters",
    createdDate: "March 2024",
    description: "Deep dive into fundamental analysis and long-term value investing strategies. Learn from experienced investors and\nshare your insights.",
    creator: "Rajesh Kumar",
    creatorAvatar: "",
    creatorUsername: "rajesh.kumar",
    category: "Value Investing",
    memberCount: 1250,
    isPremium: false,
    premiumPrice: "299",
    tipsHits: 1250,
    weeklyFeeds: 15,
    badges: ["Expert Verified", "High Activity"],
    coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    rules: [
      "Keep discussions relevant to value investing",
      "No spam or promotional content",
      "Respect all members and their opinions",
      "Share quality research and insights"
    ],
    stats: {
      totalMembers: 1250,
      tipsHits: 1250,
      category: "Value Investing",
      weeklyEngagement: "89%"
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab("discussion")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "discussion"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Discussion
            {activeTab === "discussion" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "about"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-24">
        {activeTab === "discussion" && (
          <div className="space-y-4">
            {/* Tribe Card */}
            <Card className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {/* Cover Image */}
              <div className="relative">
                {tribe.coverImage && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={tribe.coverImage}
                      alt={tribe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Avatar - Overlapping */}
                <div className="absolute -bottom-12 left-5">
                  <Avatar className="h-16 w-16 flex-shrink-0 border-4 border-white shadow-md">
                    {tribe.creatorAvatar ? (
                      <AvatarImage src={tribe.creatorAvatar} alt={tribe.creator} />
                    ) : null}
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-lg">
                      {getInitials(tribe.creator)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="p-5 pt-2">
                {/* Header Section with Avatar space, Name and Price */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Space for overlapping avatar */}
                  <div className="w-16 flex-shrink-0"></div>

                  {/* Title and Date */}
                  <div className="flex-1 min-w-0 -mt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-0.5">
                          {tribe.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created in {tribe.createdDate}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-purple-600">
                          ₹{tribe.isPremium ? tribe.premiumPrice : "0"}
                        </div>
                        <div className="text-xs text-gray-500">/month</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {tribe.description}
                </p>

                {/* Creator Info */}
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    {tribe.creatorAvatar ? (
                      <AvatarImage src={tribe.creatorAvatar} alt={tribe.creator} />
                    ) : null}
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold text-xs">
                      {getInitials(tribe.creator)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">
                    Created by {tribe.creator} (@{tribe.creatorUsername})
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{tribe.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    <span>{tribe.tipsHits} hits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4" />
                    <span>{tribe.weeklyFeeds} feeds weekly</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tribe.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-3 py-1 border-gray-300 bg-white font-medium"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Leave Tribe Button */}
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200"
                >
                  Leave Tribe
                </Button>
              </div>
            </Card>

            {/* Tribe Rules */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-base text-gray-900 mb-4">Tribe Rules</h3>
              <ol className="space-y-3">
                {tribe.rules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-purple-600 font-medium">{index + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Tribe Stats */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-base text-gray-900 mb-4">Tribe Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Members</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.totalMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tips Hits</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.tipsHits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Weekly Engagement</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.weeklyEngagement}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            {/* Tribe Rules */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-base text-gray-900 mb-4">Tribe Rules</h3>
              <ol className="space-y-3">
                {tribe.rules.map((rule, index) => (
                  <li key={index} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-purple-600 font-medium">{index + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Tribe Stats */}
            <Card className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-base text-gray-900 mb-4">Tribe Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Members</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.totalMembers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tips Hits</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.tipsHits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Weekly Engagement</p>
                  <p className="text-base font-bold text-gray-900">{tribe.stats.weeklyEngagement}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TribeDetail;

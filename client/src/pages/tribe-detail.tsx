import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, BarChart3, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import type { Tribe } from "@/types";

const TribeDetail = () => {
  const { id } = useParams({ from: '/_auth/tribe/$id' });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discussion");

  const fixMinioUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.replace('http://minio:', 'http://localhost:');
  };
  const { data: tribeData, isLoading, error } = useQuery({
    queryKey: ['tribe', id],
    queryFn: async () => {
      const response = await apiClient.tribes._id(Number(id)).$get();
      return response;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tribe...</p>
        </div>
      </div>
    );
  }

  if (error || !tribeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading tribe</p>
          <Button onClick={() => navigate({ to: '/investment-rooms' })}>
            Back to Tribes
          </Button>
        </div>
      </div>
    );
  }

  const creatorName = tribeData.user ? `${tribeData.user.firstName} ${tribeData.user.lastName}`.trim() : "Expert User";
  const creatorUsername = tribeData.user?.username || `user${tribeData.userId}`;
  const coverImageUrl = fixMinioUrl(tribeData.coverImage?.publicUrl);

  const tribe = {
    id: tribeData.id,
    name: tribeData.name,
    createdDate: new Date(tribeData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    description: tribeData.description || "No description available",
    creator: creatorName || "Expert User",
    creatorAvatar: "",
    creatorUsername: creatorUsername,
    category: tribeData.category || "General",
    memberCount: 0,
    isPremium: tribeData.isPremium,
    premiumPrice: tribeData.price || "0",
    tipsHits: 0,
    weeklyFeeds: 0,
    badges: [],
    coverImage: coverImageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    rules: [
      "Keep discussions relevant to the tribe's topic",
      "No spam or promotional content",
      "Respect all members and their opinions",
      "Share quality research and insights"
    ],
    stats: {
      totalMembers: 0,
      tipsHits: 0,
      category: tribeData.category || "General",
      weeklyEngagement: "N/A"
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

      <div className="px-4 py-4 pb-24">
        {activeTab === "discussion" && (
          <div className="space-y-4">
            <Card className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
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
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 flex-shrink-0"></div>
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

                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-purple-600">
                          ₹{tribe.isPremium ? tribe.premiumPrice : "0"}
                        </div>
                        <div className="text-xs text-gray-500">/month</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {tribe.description}
                </p>

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

                {tribeData.features && tribeData.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tribeData.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-3 py-1 border-purple-300 bg-purple-50 text-purple-700 font-medium"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tribe.badges.length > 0 && (
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
                )}

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200"
                  onClick={() => {}}
                >
                  {tribe.isPremium ? `Subscribe for ₹${tribe.premiumPrice}/month` : "Join Tribe"}
                </Button>
              </div>
            </Card>

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

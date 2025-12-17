import type { TribeRule } from "@/api/tribes/_id@number/rules/index";
import { PostCard } from "@/components/dashboard/PostCard";
import { TipCard } from "@/components/dashboard/TipCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useIsMemberOfTribe, useJoinTribe, useLeaveTribe, useTribePosts, useTribeStockTips } from "@/hooks/graphql";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { GET_TRIBE } from "@/graphql/tribes/queries";
import { useMutation, useQueryClient, useQuery as useTanstackQuery } from "@tanstack/react-query";
import { useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { BarChart3, Check, Edit2, Loader2, TrendingUp, Users, X } from "lucide-react";
import { useState } from "react";

const TribeDetail = () => {
  const { id } = useParams({ from: '/_auth/tribe/$id' });
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discussion");
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [editedRules, setEditedRules] = useState<string[]>([]);
  const [originalRules, setOriginalRules] = useState<TribeRule[]>([]);

  const { data, loading: isLoading, error } = useQuery(GET_TRIBE, {
    variables: { id },
    skip: !id,
  });

  const tribeData = data?.tribe;

  // Tribe membership hooks
  const { data: isMemberData, loading: membershipLoading } = useIsMemberOfTribe(id);
  const [joinTribe, { loading: joining }] = useJoinTribe();
  const [leaveTribe, { loading: leaving }] = useLeaveTribe();

  const isMember = isMemberData?.isMemberOfTribe || false;
  const isMembershipLoading = joining || leaving || membershipLoading;

  // Fetch tribe posts and stock tips (only if user is a member or owner)
  const { data: tribePostsData, loading: loadingPosts } = useTribePosts(id);
  const { data: tribeStockTipsData, loading: loadingTips } = useTribeStockTips(id);

  const tribePosts = (tribePostsData as { tribePosts: any[] })?.tribePosts || [];
  const tribeStockTips = (tribeStockTipsData as { tribeStockTips: any[] })?.tribeStockTips || [];

  const updateRulesMutation = useMutation({
    mutationFn: async (rules: string[]) => {
      const operations = [];

      // Update existing rules and create new ones
      for (let i = 0; i < rules.length; i++) {
        const ruleContent = rules[i].trim();
        if (!ruleContent) continue;

        const originalRule = originalRules[i];

        if (originalRule) {
          // Update existing rule if content changed
          if (originalRule.content !== ruleContent) {
            operations.push(
              apiClient.tribes._id(Number(id)).rules._ruleId(originalRule.id).$patch({
                body: { content: ruleContent }
              })
            );
          }
        } else {
          // Create new rule
          operations.push(
            apiClient.tribes._id(Number(id)).rules.$post({
              body: { content: ruleContent }
            })
          );
        }
      }

      // Delete removed rules
      for (let i = rules.length; i < originalRules.length; i++) {
        operations.push(
          apiClient.tribes._id(Number(id)).rules._ruleId(originalRules[i].id).$delete()
        );
      }

      // Execute all operations
      await Promise.all(operations);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tribe', id] });
      toast({
        title: "Rules updated successfully",
        description: "Your tribe rules have been updated.",
      });
      setIsEditingRules(false);
      setEditedRules([]);
      setOriginalRules([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating rules",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const fixMinioUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.replace('http://minio:', 'http://localhost:');
  };

  const parseFeatures = (features: string[]): Record<string, boolean> => {
    if (!features || features.length === 0) return {};
    try {
      // The API returns a malformed JSON split into array elements
      // Example: ["{\"discussionPosts\":true", "\"stockTips\":true", ...]
      let joinedString = features.join(',');

      // Ensure it's properly wrapped
      if (!joinedString.startsWith('{')) {
        joinedString = '{' + joinedString;
      }
      if (!joinedString.endsWith('}')) {
        joinedString = joinedString + '}';
      }

      // Remove escaped quotes - replace \" with "
      joinedString = joinedString.replace(/\\"/g, '"');

      return JSON.parse(joinedString);
    } catch (error) {
      console.error('Error parsing features:', error);
      return {};
    }
  };

  const getFeatureLabel = (key: string): string => {
    const labels: Record<string, string> = {
      discussionPosts: "Discussion Posts",
      stockTips: "Stock Tips",
      liveEvents: "Live Events",
      premiumPolls: "Premium Polls"
    };
    return labels[key] || key;
  };

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
  const isOwner = currentUser?.id === tribeData.userId;

  const parsedFeatures = parseFeatures(tribeData.features || []);
  const activeFeatures = Object.entries(parsedFeatures)
    .filter(([_, value]) => value === true)
    .map(([key]) => getFeatureLabel(key));

  // Parse rules from API - sort by displayOrder
  const apiRulesData = [...(tribeData.rules || [])]
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  const apiRules = apiRulesData.map((rule: any) => rule.content);

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
    rules: apiRules,
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

  const handleEditRules = () => {
    setEditedRules([...tribe.rules]);
    setOriginalRules(apiRulesData as unknown as TribeRule[]);
    setIsEditingRules(true);
  };

  const handleSaveRules = () => {
    const filteredRules = editedRules.filter(rule => rule.trim() !== "");
    if (filteredRules.length === 0) {
      toast({
        title: "No rules to save",
        description: "Please add at least one rule.",
        variant: "destructive",
      });
      return;
    }
    updateRulesMutation.mutate(filteredRules);
  };

  const handleCancelEdit = () => {
    setIsEditingRules(false);
    setEditedRules([]);
    setOriginalRules([]);
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...editedRules];
    newRules[index] = value;
    setEditedRules(newRules);
  };

  const handleAddRule = () => {
    setEditedRules([...editedRules, ""]);
  };

  const handleRemoveRule = (index: number) => {
    const newRules = editedRules.filter((_, i) => i !== index);
    setEditedRules(newRules);
  };

  const handleJoin = async () => {
    try {
      await joinTribe({ variables: { tribeId: id } });
      toast({
        title: "Success!",
        description: "You've joined the tribe successfully.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Failed to join tribe";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLeave = async () => {
    try {
      await leaveTribe({ variables: { tribeId: id } });
      toast({
        title: "Left tribe",
        description: "You've left the tribe successfully.",
      });
    } catch (error: any) {
      if (error.message?.includes("owner")) {
        toast({
          title: "Cannot leave",
          description: "As the owner, you can't leave. Delete the tribe instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to leave tribe",
          variant: "destructive",
        });
      }
    }
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
            {loadingPosts || loadingTips ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : tribePosts.length === 0 && tribeStockTips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center max-w-sm">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isMember
                      ? "Be the first to share your insights with the tribe."
                      : "Join this tribe to start engaging with other members and share your insights."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Render Posts */}
                {tribePosts.map((post: any) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    author={{
                      id: post.user.id,
                      name: `${post.user.firstName} ${post.user.lastName}`,
                      username: post.user.username || `@user${post.user.id}`,
                      avatar: '',
                      initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
                      uuid: post.user.id // Assuming id is the uuid
                    }}
                    content={post.content}
                    tags={[]}
                    likes={post.likeCount || 0}
                    comments={post.commentCount || 0}
                    timestamp={formatDate(post.createdAt)}
                    image={post.image?.path}
                    isLikedByMe={post.isLikedByMe || false}
                    tribe={post.tribe ? { id: post.tribe.id, name: post.tribe.name } : undefined}
                  />
                ))}

                {/* Render Stock Tips */}
                {tribeStockTips.map((tip: any) => {
                  const entryPrice = typeof tip.entryPrice === 'string' ? parseFloat(tip.entryPrice) : tip.entryPrice;
                  const targetPrice = typeof tip.targetPrice === 'string' ? parseFloat(tip.targetPrice) : tip.targetPrice;

                  return (
                    <TipCard
                      key={tip.id}
                      id={tip.id}
                      author={{
                        id: tip.user?.id || tip.userId,
                        name: tip.user ? `${tip.user.firstName} ${tip.user.lastName}`.trim() : 'User',
                        username: tip.user?.username ? `@${tip.user.username}` : `@user${tip.userId}`,
                        avatar: '',
                        initials: tip.user ? `${tip.user.firstName?.[0] || ''}${tip.user.lastName?.[0] || ''}` : 'U',
                      }}
                      stock={{
                        name: tip.stockName,
                        symbol: tip.symbol,
                        change: `${((targetPrice - entryPrice) / entryPrice * 100).toFixed(1)}%`,
                      }}
                      entryPrice={`₹${entryPrice.toFixed(2)}`}
                      targetPrice={`₹${targetPrice.toFixed(2)}`}
                      buyDate={new Date(tip.entryDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                      sellDate={tip.exitDate ? new Date(tip.exitDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }) : 'N/A'}
                      reasoning={tip.reason || ''}
                      chartImage={tip.chartImage?.publicUrl?.replace('http://minio:', 'http://localhost:')}
                      likes={tip.likeCount || 0}
                      comments={tip.commentCount || 0}
                      isFollowing={false}
                      isLikedByMe={tip.isLikedByMe || false}
                      tribe={tip.tribe ? { id: tip.tribe.id, name: tip.tribe.name } : undefined}
                    />
                  );
                })}
              </>
            )}
          </div>
        )}

        {activeTab === "about" && (
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

                {activeFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeFeatures.map((feature, index) => (
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

                {!isOwner && (
                  <Button
                    onClick={isMember ? handleLeave : handleJoin}
                    disabled={isMembershipLoading}
                    className={`w-full font-medium transition-all duration-200 ${
                      isMember
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isMembershipLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isMember
                      ? "Leave Tribe"
                      : tribe.isPremium
                      ? "Subscribe Now"
                      : "Join for Free"}
                  </Button>
                )}
                {isOwner && (
                  <Button
                    disabled
                    className="w-full bg-purple-100 text-purple-600 font-medium cursor-default"
                  >
                    Your Tribe
                  </Button>
                )}
              </div>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900">Tribe Rules</h3>
                {isOwner && !isEditingRules && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditRules}
                    className="flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit
                  </Button>
                )}
                {isEditingRules && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveRules}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Check className="h-3 w-3" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isEditingRules ? (
                <div className="space-y-3">
                  {editedRules.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="text-purple-600 font-medium text-sm mt-2">{index + 1}.</span>
                      <Input
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        className="flex-1"
                        placeholder="Enter rule"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddRule}
                    className="w-full mt-2"
                  >
                    + Add Rule
                  </Button>
                </div>
              ) : (
                <ol className="space-y-3">
                  {tribe.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-purple-600 font-medium">{index + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              )}
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

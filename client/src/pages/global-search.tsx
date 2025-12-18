import { useState, useEffect, useMemo } from "react";
import { User, MessageSquare, Search, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import SearchHeader from "@/components/dashboard/SearchHeader";
import UserCard from "@/components/dashboard/UserCard";
import { PostCard } from "@/components/dashboard/PostCard";
import { useInteraction } from "@/lib/interactionContext";
import { useExplore, ExploreType } from "@/hooks/graphql";
import { formatDate } from "@/lib/utils";

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const [location] = useLocation();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Determine the explore type based on active tab
  const exploreType = useMemo(() => {
    if (activeTab === 'users') return ExploreType.USER;
    if (activeTab === 'posts') return ExploreType.POST;
    return undefined; // 'all' searches both
  }, [activeTab]);

  // Use the explore API with debounced query
  const { data, loading, error } = useExplore(debouncedQuery, exploreType, 20);

  // Check for URL parameters and populate search on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  // Separate results by type
  const { users, posts } = useMemo(() => {
    if (!data?.explore) {
      return { users: [], posts: [] };
    }

    const userResults = data.explore
      .filter((result): result is { _type: 'USER'; user: any } => result._type === 'USER')
      .map(result => result.user);

    const postResults = data.explore
      .filter((result): result is { _type: 'POST'; post: any } => result._type === 'POST')
      .map(result => result.post);

    return { users: userResults, posts: postResults };
  }, [data]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const renderSearchResults = () => {
    // Show loading state
    if (loading) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl text-center py-12">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Searching...</h3>
          <p className="text-gray-500">Finding the best results for you</p>
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-red-200 shadow-lg rounded-2xl text-center py-12">
          <Search className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-500">Failed to load search results. Please try again.</p>
        </div>
      );
    }

    // Show empty state when no search query
    if (!searchQuery.trim()) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-2xl text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Start Searching</h3>
          <p className="text-gray-500">Enter a search term to find users and posts</p>
        </div>
      );
    }

    // Show no results state
    const hasResults = users.length > 0 || posts.length > 0;
    if (!hasResults) {
      return (
        <div className="bg-white/70 backdrop-blur-md border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Users Section */}
        {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Users</h3>
              <Badge variant="secondary">{users.length}</Badge>
            </div>
            <div className="space-y-3">
              {users.map((user: any) => (
                <UserCard
                  key={user.id}
                  name={`${user.firstName} ${user.lastName}`}
                  username={`@${user.username}`}
                  avatar=""
                  expertise={user.roles?.[0] || 'Investor'}
                  userUuid={user.id} // Assuming id is the uuid
                />
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Posts</h3>
              <Badge variant="secondary">{posts.length}</Badge>
            </div>
            <div className="space-y-3">
              {posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    id: post.user.id,
                    name: `${post.user.firstName} ${post.user.lastName}`.trim(),
                    username: `@${post.user.username}`,
                    avatar: '',
                    initials: post.user.firstName[0] + (post.user.lastName?.[0] || ''),
                    uuid: post.user.id // Assuming id is the uuid
                  }}
                  content={post.content}
                  tags={[]}
                  likes={post.likeCount}
                  comments={post.commentCount}
                  timestamp={formatTimestamp(post.createdAt)}
                  image={post.image?.publicUrl}
                  isLikedByMe={post.isLikedByMe}
                  tribe={post.tribe}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      {/* Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search Results */}
      <div className="p-4 pb-24">
        {renderSearchResults()}
      </div>
    </div>
  );
}

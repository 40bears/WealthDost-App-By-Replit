import { useState, useEffect } from "react";
import { User, MessageSquare, Search } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import SearchHeader from "@/components/dashboard/SearchHeader";
import UserCard from "@/components/dashboard/UserCard";
import { PostCard } from "@/components/dashboard/PostCard";
import { useInteraction } from "@/lib/interactionContext";

// Demo data for search results
const demoUsers = [
  {
    id: '1',
    name: 'CA Mukul Wadwani',
    username: '@ca_ankit',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mukul',
    expertise: 'Tech Analyst',
    followers: 43200,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    username: '@priya_investing',
    avatar: '',
    expertise: 'Investment Advisor',
    followers: 28100,
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    username: '@rajesh_stocks',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    expertise: 'Market Analyst',
    followers: 15800,
  },
  {
    id: '4',
    name: 'Anita Desai',
    username: '@anita_finance',
    avatar: '',
    expertise: 'Financial Planner',
    followers: 9500,
  }
];

const demoHashtags = [
  {
    id: '1',
    tag: 'TechStocks',
    postCount: 15420,
    trending: true
  },
  {
    id: '2',
    tag: 'InvestmentTips',
    postCount: 8930,
    trending: false
  },
  {
    id: '3',
    tag: 'MarketAnalysis',
    postCount: 12650,
    trending: true
  }
];

const demoPosts = [
  {
    id: '1',
    content: 'Apple stock showing strong momentum after Q1 earnings beat. Revenue up 8% YoY with services segment driving growth.',
    author: {
      name: 'Sarah Chen',
      username: '@sarahc_trades',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      initials: 'SC'
    },
    timestamp: '2h ago',
    likes: 234,
    comments: 45,
    tags: ['#AAPL', '#TechStocks']
  },
  {
    id: '2',
    content: 'Tesla Model Y refresh announcement could be a catalyst for the stock. Watching for entry around $185-190 range.',
    author: {
      name: 'Alex Kumar',
      username: '@alex_investing',
      avatar: '',
      initials: 'AK'
    },
    timestamp: '5h ago',
    likes: 187,
    comments: 32,
    tags: ['#TSLA', '#EVStocks']
  }
];

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const [location] = useLocation();
  
  const { toggleFollow, isFollowing } = useInteraction();

  // Check for URL parameters and populate search on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  const filteredUsers = demoUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHashtags = demoHashtags.filter(hashtag => 
    hashtag.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = demoPosts.filter(post =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const renderSearchResults = () => {
    // Show all users and posts when search is empty
    const usersToShow = searchQuery.trim() ? filteredUsers : demoUsers;
    const postsToShow = searchQuery.trim() ? filteredPosts : demoPosts;
    
    const hasResults = usersToShow.length > 0 || postsToShow.length > 0;

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
        {(activeTab === 'all' || activeTab === 'users') && usersToShow.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Users</h3>
              <Badge variant="secondary">{usersToShow.length}</Badge>
            </div>
            <div className="space-y-3">
              {usersToShow.map((user) => (
                <UserCard
                  key={user.id}
                  name={user.name}
                  username={user.username}
                  avatar={user.avatar}
                  expertise={user.expertise}
                  followers={user.followers}
                  isFollowing={isFollowing(user.username)}
                  onFollowToggle={() => toggleFollow(user.username)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {(activeTab === 'all' || activeTab === 'posts') && postsToShow.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-lg">Posts</h3>
              <Badge variant="secondary">{postsToShow.length}</Badge>
            </div>
            <div className="space-y-3">
              {postsToShow.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  tags={post.tags}
                  likes={post.likes}
                  comments={post.comments}
                  timestamp={post.timestamp}
                  isFollowing={isFollowing(post.author.username)}
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
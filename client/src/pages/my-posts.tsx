import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreHorizontal, Edit, Trash2, Eye, Heart, MessageCircle, Share } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInteraction } from "@/lib/interactionContext";
import { CommentModal } from "@/components/ui/comment-modal";

const MyPosts = () => {
  const [filter, setFilter] = useState("all");
  const [, setLocation] = useLocation();
  
  const { 
    toggleLike, 
    sharePost, 
    addComment, 
    isLiked, 
    getCommentCount 
  } = useInteraction();

  // Fetch user's posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/posts"],
  });

  const typedPosts = posts as any[];

  const filterOptions = [
    { value: "all", label: "All Posts" },
    { value: "analysis", label: "Analysis" },
    { value: "question", label: "Questions" },
    { value: "discussion", label: "Discussions" },
  ];

  // Filter posts based on selected filter
  const filteredPosts = typedPosts?.filter((post) => {
    if (filter === "all") return true;
    return post.type === filter;
  }) || [];

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      console.log("Deleting post:", postId);
      // Implement delete functionality
    }
  };

  const handleEditPost = (postId: number) => {
    console.log("Editing post:", postId);
    // Navigate to edit page or open modal
  };

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
            <h1 className="text-lg font-semibold">My Posts</h1>
            <div className="w-8"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex-1 text-xs py-2 px-3 rounded-md transition-colors ${
                  filter === option.value
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

      {/* Posts Content */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {/* Stats Overview */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-purple-600">24</div>
                <div className="text-xs text-gray-500">Total Posts</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600">156</div>
                <div className="text-xs text-gray-500">Total Likes</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">89</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading your posts...</p>
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                          RK
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">You</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditPost(post.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>

                  {post.type && (
                    <Badge variant="outline" className="mb-3">
                      {post.type}
                    </Badge>
                  )}

                  <div className="flex items-center justify-between text-xs border-t-2 border-gray-100 pt-3 mt-3">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center space-x-1 text-xs border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-red-50/70 hover:backdrop-blur-sm p-1 h-auto ${
                          isLiked(post.id) ? 'text-red-600 bg-red-50/70 backdrop-blur-sm border-red-200' : 'text-gray-500'
                        }`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart size={12} className={`transition-all duration-300 ${isLiked(post.id) ? 'fill-current' : ''}`} />
                        <span className="font-medium">{(post.likes || 0) + (isLiked(post.id) ? 1 : 0)}</span>
                      </Button>
                      
                      <CommentModal postId={post.id} onAddComment={addComment}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-blue-50/70 hover:backdrop-blur-sm hover:text-blue-600 p-1 h-auto"
                        >
                          <MessageCircle size={12} className="transition-all duration-300" />
                          <span className="font-medium">{(post.comments || 0) + getCommentCount(post.id)}</span>
                        </Button>
                      </CommentModal>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-1 text-xs text-gray-500 border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95 hover:bg-gray-50/70 hover:backdrop-blur-sm hover:text-gray-600 p-1 h-auto"
                        onClick={() => sharePost(post.id)}
                      >
                        <Share size={12} className="transition-all duration-300" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-gray-400 text-2xl">post_add</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 text-sm mb-4">Start sharing your investment insights with the community!</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  setLocation("/dashboard");
                  // Trigger post creation modal after redirect
                  setTimeout(() => {
                    const createButton = document.querySelector('[data-create-post]');
                    if (createButton) {
                      (createButton as HTMLElement).click();
                    }
                  }, 100);
                }}
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
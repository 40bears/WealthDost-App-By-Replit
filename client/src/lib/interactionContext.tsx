import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface InteractionState {
  likes: Record<string, boolean>;
  follows: Record<string, boolean>;
  shares: Record<string, number>;
  comments: Record<string, number>;
}

interface InteractionContextType {
  state: InteractionState;
  toggleLike: (postId: string) => void;
  toggleFollow: (userId: string) => void;
  sharePost: (postId: string) => void;
  addComment: (postId: string) => void;
  isLiked: (postId: string) => boolean;
  isFollowing: (userId: string) => boolean;
  getShareCount: (postId: string) => number;
  getCommentCount: (postId: string) => number;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [state, setState] = useState<InteractionState>({
    likes: {},
    follows: {},
    shares: {},
    comments: {}
  });

  const toggleLike = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      likes: {
        ...prev.likes,
        [postId]: !prev.likes[postId]
      }
    }));

    toast({
      title: state.likes[postId] ? "Unliked" : "Liked",
      description: state.likes[postId] ? "Removed from liked posts" : "Added to liked posts",
      duration: 2000
    });
  }, [state.likes, toast]);

  const toggleFollow = useCallback((userId: string) => {
    setState(prev => ({
      ...prev,
      follows: {
        ...prev.follows,
        [userId]: !prev.follows[userId]
      }
    }));

    toast({
      title: state.follows[userId] ? "Unfollowed" : "Following",
      description: state.follows[userId] ? "User unfollowed" : "Now following user",
      duration: 2000
    });
  }, [state.follows, toast]);

  const sharePost = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      shares: {
        ...prev.shares,
        [postId]: (prev.shares[postId] || 0) + 1
      }
    }));

    // Share functionality with fallback
    const shareContent = {
      title: 'WealthDost Post',
      text: 'Check out this investment insight on WealthDost!',
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareContent).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Post Shared",
          description: "Link copied to clipboard",
          duration: 2000
        });
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Post Shared",
        description: "Link copied to clipboard",
        duration: 2000
      });
    }
  }, [toast]);

  const addComment = useCallback((postId: string) => {
    setState(prev => ({
      ...prev,
      comments: {
        ...prev.comments,
        [postId]: (prev.comments[postId] || 0) + 1
      }
    }));

    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
      duration: 2000
    });
  }, [toast]);

  const isLiked = useCallback((postId: string) => {
    return state.likes[postId] || false;
  }, [state.likes]);

  const isFollowing = useCallback((userId: string) => {
    return state.follows[userId] || false;
  }, [state.follows]);

  const getShareCount = useCallback((postId: string) => {
    return state.shares[postId] || 0;
  }, [state.shares]);

  const getCommentCount = useCallback((postId: string) => {
    return state.comments[postId] || 0;
  }, [state.comments]);

  return (
    <InteractionContext.Provider
      value={{
        state,
        toggleLike,
        toggleFollow,
        sharePost,
        addComment,
        isLiked,
        isFollowing,
        getShareCount,
        getCommentCount
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
}
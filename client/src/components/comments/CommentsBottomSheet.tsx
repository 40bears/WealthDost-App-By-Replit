import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useComments,
  useReplies,
  useCreateComment,
  useLikeComment,
  useUnlikeComment,
  useDeleteComment,
} from '@/hooks/graphql';
import { useAuth } from '@/hooks/useAuth';

interface CommentsBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: number;
  entityType: 'POST' | 'STOCK_TIP';
}

interface CommentItemProps {
  comment: any;
  depth?: number;
  entityType: 'POST' | 'STOCK_TIP';
  entityId: number;
}

function CommentItem({ comment, depth = 0, entityType, entityId }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const { user } = useAuth();
  const { data: repliesData, refetch: refetchReplies } = useReplies(String(comment.id), 'oldest', !showReplies);
  const [createComment] = useCreateComment();
  const [likeComment] = useLikeComment();
  const [unlikeComment] = useUnlikeComment();
  const [deleteCommentMutation] = useDeleteComment();

  const isOwner = user?.id === comment.user?.id;
  const handleLike = async () => {
    try {
      if (comment.isLikedByMe) {
        await unlikeComment({ variables: { commentId: String(comment.id) } });
      } else {
        await likeComment({ variables: { commentId: String(comment.id) } });
      }
      // Note: We don't refetch here because the backend updates are reflected via cache
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      await createComment({
        variables: {
          input: {
            content: replyText.trim(),
            commentableType: entityType,
            commentableId: String(entityId),
            parentId: String(comment.id),
          },
        },
      });
      setReplyText('');
      setIsReplying(false);
      setShowReplies(true); // Automatically show replies after posting
      // Manually refetch only the replies for this comment
      refetchReplies();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      console.error('Only the comment owner can delete this comment');
      return;
    }

    if (!confirm('Are you sure you want to delete this comment? This will also delete all replies.')) {
      return;
    }

    try {
      await deleteCommentMutation({
        variables: { commentId: String(comment.id) }
      });

      // Mark as deleted locally for immediate UI update
      setIsDeleted(true);
    } catch (error: any) {
      console.error('Error deleting comment:', error);

      // Handle specific errors
      if (error.message?.includes('403') || error.message?.includes('forbidden')) {
        alert('You do not have permission to delete this comment.');
      } else if (error.message?.includes('404') || error.message?.includes('not found')) {
        alert('Comment not found.');
      } else {
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

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
    return date.toLocaleDateString();
  };

  const replies = repliesData?.replies || [];

  // Don't render if deleted
  if (isDeleted) {
    return null;
  }

  return (
    <div className={cn('', depth > 0 && 'ml-8 border-l-2 border-gray-100 pl-4')}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user?.avatar} />
          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
            {comment.user?.firstName?.[0] || ''}{comment.user?.lastName?.[0] || ''}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {comment.user?.firstName} {comment.user?.lastName}
            </span>
            {comment.user?.username && (
              <span className="text-gray-500 text-xs">@{comment.user.username}</span>
            )}
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-500 text-xs">{formatTimestamp(comment.createdAt)}</span>
          </div>

          {/* Comment Content */}
          <p className="text-sm text-gray-700 mb-2 break-words">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 transition-colors',
                comment.isLikedByMe ? 'text-red-600 font-medium' : 'text-gray-500 hover:text-red-600'
              )}
            >
              <Heart className={cn('h-3.5 w-3.5', comment.isLikedByMe && 'fill-current')} />
              {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
            >
              Reply
            </button>

            {comment.replyCount > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                {showReplies ? 'Hide' : 'View'} {comment.replyCount}{' '}
                {comment.replyCount === 1 ? 'reply' : 'replies'}
              </button>
            )}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-auto text-gray-400 hover:text-gray-600 p-1">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Comment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-3 flex gap-2 items-center">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2 items-center">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[48px] text-sm resize-none flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="h-[48px] w-[48px] flex-shrink-0 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-1">
          {replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              entityType={entityType}
              entityId={entityId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentsBottomSheet({
  open,
  onOpenChange,
  entityId,
  entityType,
}: CommentsBottomSheetProps) {
  const [commentText, setCommentText] = useState('');
  const { data, loading, refetch } = useComments(entityType, String(entityId), 'newest', !open);
  const [createComment] = useCreateComment();

  const comments = data?.comments || [];

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      await createComment({
        variables: {
          input: {
            content: commentText.trim(),
            commentableType: entityType,
            commentableId: String(entityId),
          },
        },
      });
      setCommentText('');
      // Manually refetch only this specific query
      refetch();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Calculate total comment count (including replies)
  const totalComments = comments.reduce(
    (acc: number, c: any) => acc + 1 + (c.replyCount || 0),
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] flex flex-col p-0 rounded-t-2xl"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="text-lg font-semibold">
              Comments ({comments.length})
            </SheetTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
              <MessageCircle className="h-4 w-4" />
              <span>{totalComments} total</span>
            </div>
          </div>
        </SheetHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading comments...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  entityType={entityType}
                  entityId={entityId}
                />
              ))}
            </div>
          )}

          {!loading && comments.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex gap-3 items-center">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                You
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-3 items-center">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[56px] resize-none flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (commentText.trim()) {
                      handleSubmitComment();
                    }
                  }
                }}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="h-[56px] w-[56px] flex-shrink-0 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

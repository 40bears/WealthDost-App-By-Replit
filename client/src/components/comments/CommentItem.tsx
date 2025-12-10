import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MoreVertical, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useLikeComment, useUnlikeComment, useReplies, useDeleteComment } from '@/hooks/graphql'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import CommentInput from './CommentInput'

interface Comment {
  id: number
  content: string
  createdAt: string
  isLikedByMe?: boolean
  likeCount: number
  replyCount?: number
  user: {
    id: string
    firstName: string
    lastName: string
    username: string
    profilePicture?: {
      publicUrl: string
    }
  }
  replies?: Comment[]
}

interface CommentItemProps {
  comment: Comment
  entityId: number | string
  entityType: 'POST' | 'STOCK_TIP'
  onReplySubmit?: () => void
  depth?: number
}

export default function CommentItem({
  comment,
  entityId,
  entityType,
  onReplySubmit,
  depth = 0
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.isLikedByMe || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0)
  const [isDeleted, setIsDeleted] = useState(false)

  const { user } = useAuth()
  const { data: repliesData, refetch: refetchReplies } = useReplies(String(comment.id), 'oldest', !showReplies)
  const [likeCommentMutation] = useLikeComment()
  const [unlikeCommentMutation] = useUnlikeComment()
  const [deleteCommentMutation] = useDeleteComment()

  const userInitials = `${comment.user.firstName[0]}${comment.user.lastName?.[0] || ''}`
  const userName = `${comment.user.firstName} ${comment.user.lastName}`

  const replies = repliesData?.replies || []
  const isOwner = user?.id === comment.user.id

  // Debug logging
  console.log('CommentItem Debug:', {
    currentUserId: user?.id,
    currentUserType: typeof user?.id,
    commentUserId: comment.user.id,
    commentUserIdType: typeof comment.user.id,
    isOwner,
    comment
  })

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeCommentMutation({ variables: { commentId: String(comment.id) } })
        setLikeCount(prev => prev - 1)
      } else {
        await likeCommentMutation({ variables: { commentId: String(comment.id) } })
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput)
  }

  const handleReplySuccess = () => {
    setShowReplyInput(false)
    setShowReplies(true)
    refetchReplies()
    onReplySubmit?.()
  }

  const handleDelete = async () => {
    if (!isOwner) {
      console.error('Only the comment owner can delete this comment')
      return
    }

    if (!confirm('Are you sure you want to delete this comment? This will also delete all replies.')) {
      return
    }

    try {
      await deleteCommentMutation({
        variables: { commentId: String(comment.id) }
      })

      // Mark as deleted locally for immediate UI update
      setIsDeleted(true)

      // Notify parent to refresh
      onReplySubmit?.()
    } catch (error: any) {
      console.error('Error deleting comment:', error)

      // Handle specific errors
      if (error.message?.includes('403') || error.message?.includes('forbidden')) {
        alert('You do not have permission to delete this comment.')
      } else if (error.message?.includes('404') || error.message?.includes('not found')) {
        alert('Comment not found.')
      } else {
        alert('Failed to delete comment. Please try again.')
      }
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        .replace('about ', '')
        .replace('less than a minute ago', 'just now')
    } catch {
      return 'just now'
    }
  }

  // Don't render if deleted
  if (isDeleted) {
    return null
  }

  return (
    <div className={cn('', depth > 0 && 'ml-8 border-l-2 border-gray-100 pl-4')}>
      <div className="flex gap-3 py-3 px-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
            {userInitials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {/* Comment Header */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{userName}</span>
                {comment.user?.username && (
                  <span className="text-gray-500 text-xs">@{comment.user.username}</span>
                )}
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs">{formatTime(comment.createdAt)}</span>
              </div>

              {/* Comment Content */}
              <p className="text-sm text-gray-700 mb-2 break-words">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 text-xs">
                <button
                  onClick={handleLike}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    isLiked ? 'text-red-600 font-medium' : 'text-gray-500 hover:text-red-600'
                  )}
                >
                  <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-current')} />
                  {likeCount > 0 && <span>{likeCount}</span>}
                </button>

                <button
                  onClick={handleReplyClick}
                  className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
                >
                  Reply
                </button>

                {(comment.replyCount || 0) > 0 && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                  >
                    {showReplies ? 'Hide' : 'View'} {comment.replyCount}{' '}
                    {comment.replyCount === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>
            </div>

            {/* More Actions Dropdown - Only show for comment owner */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
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
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                entityId={entityId}
                entityType={entityType}
                parentCommentId={comment.id}
                onSuccess={handleReplySuccess}
                onCancel={() => setShowReplyInput(false)}
                placeholder={`Reply to ${comment.user.firstName}...`}
                autoFocus
              />
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
              entityId={entityId}
              entityType={entityType}
              onReplySubmit={onReplySubmit}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

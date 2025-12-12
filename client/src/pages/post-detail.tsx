import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import { usePost, useComments, useLikePost, useUnlikePost } from '@/hooks/graphql'
import CommentItem from '@/components/comments/CommentItem'
import CommentInput from '@/components/comments/CommentInput'
import { formatDistanceToNow } from 'date-fns'

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/_auth/posts/$postId' })
  const navigate = useNavigate()

  const { data: postData, loading: postLoading, refetch: refetchPost } = usePost(postId)
  const { data: commentsData, loading: commentsLoading, refetch: refetchComments } = useComments(
    'POST',
    postId,
    'NEWEST'
  )

  const post = (postData as any)?.post
  const comments = (commentsData as any)?.comments || []

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const [likePostMutation] = useLikePost()
  const [unlikePostMutation] = useUnlikePost()

  useEffect(() => {
    if (post) {
      setIsLiked(post.isLikedByMe || false)
      setLikeCount(post.likeCount || 0)
    }
  }, [post])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePostMutation({ variables: { postId: postId } })
        setLikeCount(prev => prev - 1)
      } else {
        await likePostMutation({ variables: { postId: postId } })
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`
    try {
      await navigator.share({
        title: `Post by ${post?.user.firstName} ${post?.user.lastName}`,
        text: post?.content,
        url: url
      })
    } catch (error) {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const handleCommentSuccess = () => {
    refetchComments()
    refetchPost()
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'recently'
    }
  }

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This post may have been deleted or doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/dashboard' })}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const userInitials = `${post.user.firstName[0]}${post.user.lastName?.[0] || ''}`
  const userName = `${post.user.firstName} ${post.user.lastName}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Post Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          {/* Post Header */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <Avatar
                  className="h-10 w-10 cursor-pointer"
                  onClick={() => navigate({ to: `/user/${post.user.id}` })}
                >
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-gray-900 cursor-pointer hover:underline"
                      onClick={() => navigate({ to: `/user/${post.user.id}` })}
                    >
                      {userName}
                    </span>
                    <span className="text-gray-500 text-sm">@{post.user.username}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{formatTime(post.createdAt)}</span>
                  </div>
                  {post.tribe && (
                    <span className="text-xs text-gray-500 mt-1">
                      🔒 {post.tribe.name}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </Button>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">{post.content}</p>

            {/* Post Image */}
            {post.image?.publicUrl && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={post.image.publicUrl}
                  alt="Post content"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-100 p-4">
            <CommentInput
              entityId={postId}
              entityType="POST"
              onSuccess={handleCommentSuccess}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Comments ({post.commentCount})</h3>
          </div>
          {commentsLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading comments...</p>
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {comments.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  entityId={postId}
                  entityType="POST"
                  onReplySubmit={handleCommentSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-gray-400 text-sm mt-1">Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

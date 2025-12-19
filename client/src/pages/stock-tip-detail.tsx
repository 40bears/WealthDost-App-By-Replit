import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { useStockTip, useComments, useLikeStockTip, useUnlikeStockTip } from '@/hooks/graphql'
import CommentItem from '@/components/comments/CommentItem'
import CommentInput from '@/components/comments/CommentInput'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

export default function StockTipDetailPage() {
  const { tipId } = useParams({ from: '/_auth/stock-tips/$tipId' })
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: tipData, loading: tipLoading, refetch: refetchTip } = useStockTip(tipId)
  const { data: commentsData, loading: commentsLoading, refetch: refetchComments } = useComments(
    'STOCK_TIP',
    tipId,
    'NEWEST'
  )

  const tip = (tipData as any)?.stockTip
  const comments = (commentsData as any)?.comments || []

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showChart, setShowChart] = useState(true)

  const [likeStockTipMutation] = useLikeStockTip()
  const [unlikeStockTipMutation] = useUnlikeStockTip()

  useEffect(() => {
    if (tip) {
      setIsLiked(tip.isLikedByMe || false)
      setLikeCount(tip.likeCount || 0)
    }
  }, [tip])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeStockTipMutation({ variables: { stockTipId: tipId } })
        setLikeCount(prev => prev - 1)
      } else {
        await likeStockTipMutation({ variables: { stockTipId: tipId } })
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/stock-tips/${tipId}`
    try {
      await navigator.share({
        title: `Stock Tip: ${tip?.symbol}`,
        text: `${tip?.stockName} - ${tip?.reason}`,
        url: url
      })
    } catch (error) {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Copied!",
        description: "Stock tip link copied to clipboard.",
      })
    }
  }

  const handleCommentSuccess = () => {
    refetchComments()
    refetchTip()
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return 'recently'
    }
  }

  if (tipLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading stock tip...</p>
        </div>
      </div>
    )
  }

  if (!tip) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stock tip not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This stock tip may have been deleted or doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/dashboard' })}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const userInitials = `${tip.user?.firstName?.[0] || ''}${tip.user?.lastName?.[0] || ''}`
  const userName = tip.user ? `${tip.user.firstName} ${tip.user.lastName}` : 'Unknown User'

  const entryPrice = parseFloat(tip.entryPrice)
  const targetPrice = parseFloat(tip.targetPrice)
  const priceChange = ((targetPrice - entryPrice) / entryPrice * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Stock Tip Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
          {/* Author Header */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-5">
              <div className="flex gap-3">
                <Avatar
                  className="h-10 w-10 cursor-pointer"
                  onClick={() => tip.user && navigate({ to: `/user/${tip.user.id}` })}
                >
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-gray-900 cursor-pointer hover:underline"
                      onClick={() => tip.user && navigate({ to: `/user/${tip.user.id}` })}
                    >
                      {userName}
                    </span>
                    <span className="text-gray-500 text-sm">@{tip.user?.username}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{formatTime(tip.createdAt)}</span>
                  </div>
                  {tip.tribe && (
                    <span className="text-xs text-gray-500 mt-1">
                      🔒 {tip.tribe.name}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Stock Header */}
          <div className="flex items-center justify-between mb-5 px-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {tip.stockLogo ? (
                  <img src={tip.stockLogo} alt={tip.stockName} className="h-8 w-8" />
                ) : (
                  <span className="text-blue-600 font-bold text-sm">
                    {tip.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{tip.symbol}</h3>
                <p className="text-xs text-gray-500">{tip.stockName}</p>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {priceChange}%
            </div>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-3 gap-4 mb-5 px-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Entry Price</p>
              <p className="font-semibold text-gray-900">₹{entryPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Target Price</p>
              <p className="font-semibold text-gray-900">₹{targetPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Buy/Sell Date</p>
              <p className="font-semibold text-gray-900 text-sm">
                {new Date(tip.entryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {tip.exitDate && ` - ${new Date(tip.exitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </p>
            </div>
          </div>

          {/* Reasoning */}
          {(tip.reason || tip.chartImage?.publicUrl) && (
            <div className="relative bg-[#BFDBFE]/30 rounded-lg p-3 pt-5 mb-5 mx-4">
              <span className="absolute -top-2.5 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                REASONING
              </span>
              {tip.reason && (
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{tip.reason}</p>
              )}

              {tip.chartImage?.publicUrl && (
                <div className="mt-2">
                  <button
                    onClick={() => setShowChart(!showChart)}
                    className="text-blue-600 text-xs font-medium flex items-center gap-1 mb-2"
                  >
                    {showChart ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    {showChart ? 'Hide' : 'Show'} Chart
                  </button>
                  {showChart && (
                    <img
                      src={tip.chartImage.publicUrl}
                      alt="Stock chart"
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          )}

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
              entityId={tipId}
              entityType="STOCK_TIP"
              onSuccess={handleCommentSuccess}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Comments ({tip.commentCount})</h3>
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
                  entityId={tipId}
                  entityType="STOCK_TIP"
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

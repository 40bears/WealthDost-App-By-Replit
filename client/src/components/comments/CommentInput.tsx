import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useCreateComment } from '@/hooks/graphql'

interface CommentInputProps {
  entityId: number | string
  entityType: 'POST' | 'STOCK_TIP'
  parentCommentId?: number
  onSuccess?: () => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function CommentInput({
  entityId,
  entityType,
  parentCommentId,
  onSuccess,
  onCancel,
  placeholder = 'Write a comment...',
  autoFocus = false
}: CommentInputProps) {
  const [comment, setComment] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [createComment] = useCreateComment()

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      await createComment({
        variables: {
          input: {
            content: comment.trim(),
            commentableType: entityType,
            commentableId: String(entityId),
            parentId: parentCommentId ? String(parentCommentId) : undefined
          }
        }
      })

      setComment('')
      onSuccess?.()
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      {/* User Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
          You
        </AvatarFallback>
      </Avatar>

      {/* Comment Input Container */}
      <div className="flex-1 flex gap-2 items-center">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none outline-none min-h-[48px] max-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={1}
        />

        {comment.trim() && (
          <Button
            type="submit"
            size="sm"
            className="h-[48px] w-[48px] flex-shrink-0 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Cancel button for replies */}
      {onCancel && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </form>
  )
}

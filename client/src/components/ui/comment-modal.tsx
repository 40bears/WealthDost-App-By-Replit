import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
}

interface CommentModalProps {
  postId: string;
  onAddComment: (postId: string) => void;
  children: React.ReactNode;
}

export function CommentModal({ postId, onAddComment, children }: CommentModalProps) {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      content: "Great analysis! Thanks for sharing.",
      author: "InvestorPro",
      timestamp: "2 min ago",
      likes: 3
    },
    {
      id: "2", 
      content: "I agree with your technical analysis. The support level is holding strong.",
      author: "TechTrader",
      timestamp: "5 min ago",
      likes: 7
    }
  ]);
  const { toast } = useToast();

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: "You",
        timestamp: "now",
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      onAddComment(postId);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
        duration: 2000
      });
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] flex flex-col bg-white/90 backdrop-blur-md border-2 border-gray-200" aria-describedby="comment-modal-description">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <MessageCircle size={20} className="text-blue-600" />
            <span>Comments</span>
          </DialogTitle>
          <div id="comment-modal-description" className="sr-only">
            Add and view comments on this post
          </div>
        </DialogHeader>
        
        {/* Comment Input */}
        <div className="flex-shrink-0 space-y-3 p-4 bg-gray-50/70 backdrop-blur-sm rounded-xl border-2 border-gray-200">
          <Textarea
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] border-2 border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm"
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-200 rounded-xl transition-all duration-300 active:scale-95"
            >
              <Send size={16} className="mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white/70 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-3 transition-all duration-300 active:scale-[0.98]">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-100/70 backdrop-blur-sm text-purple-600 text-xs">
                    {comment.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500 hover:text-red-600 p-1 h-auto border-2 border-transparent rounded-lg transition-all duration-300 active:scale-95"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart size={12} className="mr-1" />
                    {comment.likes > 0 ? comment.likes : ''}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
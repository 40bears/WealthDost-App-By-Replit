import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; tags: string[]; userId: number }) => {
      return apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      // Invalidate and refetch posts to show the new post
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created successfully!",
        description: "Your post is now visible in the community feed.",
      });
      onClose();
      setPostContent("");
      setTags("");
    },
    onError: (error: any) => {
      toast({
        title: "Error creating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!postContent.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content: postContent.trim(),
      tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
      userId: 1, // Mock user ID for now
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share your idea</DialogTitle>
          <DialogDescription>
            Share your investment insights and ideas with the community
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea 
            placeholder="What's on your mind about investing today?" 
            className="min-h-[120px]"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Add tags (comma separated)</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="stocks, investing, analysis"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={createPostMutation.isPending || !postContent.trim()} 
            onClick={handleSubmit}
            className="btn-pulse"
          >
            {createPostMutation.isPending ? "Posting..." : "Share Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
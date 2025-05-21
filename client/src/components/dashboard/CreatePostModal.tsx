import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    console.log("Submitting post:", { content: postContent, tags: tags.split(",") });
    // Here you would submit the post to your API
    onClose();
    setPostContent("");
    setTags("");
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
            disabled={!postContent.trim()} 
            onClick={handleSubmit}
            className="btn-pulse"
          >
            Share Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
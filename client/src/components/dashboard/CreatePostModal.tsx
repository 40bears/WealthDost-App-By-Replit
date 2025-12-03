import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-context";
import { useCreatePost, useMyTribes } from "@/hooks/graphql";
import { Loader2 } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [selectedTribe, setSelectedTribe] = useState<string>("public");
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch tribes owned by the current user
  const { data: myTribesData } = useMyTribes();
  const [createPost, { loading: creating }] = useCreatePost();

  // Filter tribes to show only those owned by the current user
  const ownedTribes = (myTribesData as any)?.myTribes?.filter(
    (tribe: any) => tribe.user.id === user?.id
  ) || [];

  console.log('Owned tribes:', ownedTribes);
  console.log('Current selected tribe:', selectedTribe);

  useEffect(() => {
    console.log('Selected tribe changed to:', selectedTribe);
  }, [selectedTribe]);

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tribeId = selectedTribe === "public" ? null : Number(selectedTribe);

      console.log('=== CREATE POST DEBUG ===');
      console.log('selectedTribe:', selectedTribe);
      console.log('tribeId:', tribeId);
      console.log('tribeId !== null:', tribeId !== null);

      const inputData = {
        content: postContent.trim(),
        ...(tribeId !== null && { tribeId }),
      };
      console.log('Input data being sent:', inputData);
      console.log('Input data keys:', Object.keys(inputData));
      console.log('Input data stringified:', JSON.stringify(inputData, null, 2));

      const mutationVariables = {
        variables: {
          input: inputData,
        },
      };
      console.log('Full mutation variables:', JSON.stringify(mutationVariables, null, 2));

      await createPost(mutationVariables);

      toast({
        title: "Post created successfully!",
        description: selectedTribe === "public"
          ? "Your post is now visible in the public feed."
          : "Your post is now visible in the tribe feed.",
      });

      onClose();
      setPostContent("");
      setSelectedTribe("public");
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
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
            <label className="text-sm font-medium mb-2 block">Post to</label>
            <Select value={selectedTribe} onValueChange={setSelectedTribe}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select where to post" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">🌍 Public (Everyone)</SelectItem>
                {ownedTribes.map((tribe: any) => (
                  <SelectItem key={tribe.id} value={String(tribe.id)}>
                    🔒 {tribe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTribe !== "public" && (
              <p className="text-xs text-gray-500 mt-1">
                Only tribe members can see this post
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={creating || !postContent.trim()}
            onClick={handleSubmit}
            className="btn-pulse"
          >
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {creating ? "Posting..." : "Share Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import type { Tribe } from "@/types";
import { X, Send, Image as ImageIcon, ChevronDown, Globe, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface ShareThoughtsFormData {
  content: string;
  visibility: string;
  tribeId?: number;
}

interface ShareThoughtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const ShareThoughtsModal = ({ isOpen, onClose, onPostCreated }: ShareThoughtsModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [selectedVisibility, setSelectedVisibility] = useState<string>("public");
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<ShareThoughtsFormData>({
    defaultValues: {
      content: "",
      visibility: "public",
    },
  });

  // Fetch user's tribes
  const { data: allTribes = [] } = useQuery({
    queryKey: ['tribes'],
    queryFn: async () => {
      const response = await apiClient.tribes.$get();
      return response;
    },
    enabled: isOpen
  });

  const userTribes = allTribes.filter(tribe => tribe.userId === currentUser?.id);

  const createPostMutation = useMutation({
    mutationFn: async (data: ShareThoughtsFormData) => {
      // TODO: Implement actual post creation API call
      console.log("Creating post:", data);
      // Example: const response = await apiClient.posts.$post({ body: data });
      // return response;
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your thoughts have been shared!",
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      setSelectedVisibility("public");
      setSelectedTribe(null);
      onPostCreated?.();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to share your thoughts",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShareThoughtsFormData) => {
    // Add tribe ID if a tribe is selected
    if (selectedVisibility.startsWith("tribe-") && selectedTribe) {
      data.tribeId = selectedTribe.id;
    }
    createPostMutation.mutate(data);
  };

  const handleVisibilitySelect = (value: string, tribe?: Tribe) => {
    setSelectedVisibility(value);
    setValue("visibility", value);

    if (tribe) {
      setSelectedTribe(tribe);
    } else {
      setSelectedTribe(null);
    }
  };

  const getVisibilityLabel = () => {
    if (selectedVisibility === "public") return "Public";
    if (selectedTribe) return selectedTribe.name;
    return "Public";
  };

  const getVisibilityIcon = () => {
    if (selectedVisibility === "public") return <Globe className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Share your thoughts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 flex-1 overflow-y-auto">
          {/* Textarea */}
          <Textarea
            {...register("content", { required: true })}
            placeholder="eg. Deep dive into fundamental analysis and long-term value investing strategies"
            className="min-h-[200px] resize-none text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between px-6 pb-6 pt-4 shrink-0 border-t border-gray-200">
            {/* Image Icon */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Visibility Dropdown and Post Button */}
            <div className="flex items-center gap-3">
              {/* Visibility Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 min-w-[140px] justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon()}
                      <span className="truncate">{getVisibilityLabel()}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
                  <DropdownMenuItem onClick={() => handleVisibilitySelect("public")}>
                    <Globe className="h-4 w-4 mr-2" />
                    Public
                  </DropdownMenuItem>

                  {userTribes.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                        Your Tribes
                      </div>
                      {userTribes.map((tribe) => (
                        <DropdownMenuItem
                          key={tribe.id}
                          onClick={() => handleVisibilitySelect(`tribe-${tribe.id}`, tribe)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          <span className="truncate">{tribe.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Post Button */}
              <Button
                type="submit"
                disabled={createPostMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2 px-6"
              >
                <Send className="h-4 w-4" />
                Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareThoughtsModal;

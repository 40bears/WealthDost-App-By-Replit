import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, TrendingUp, Image, X } from "lucide-react";

// Simple form data types for demo
interface TweetPostFormData {
  content: string;
  imageUrl?: string;
}

interface StockTipFormData {
  stockName: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  targetDate: string;
  tipType: 'buy' | 'sell';
  reasoning?: string;
}

interface EnhancedCreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const EnhancedCreatePostModal = ({ isOpen, onClose, onPostCreated }: EnhancedCreatePostModalProps) => {
  const [activeTab, setActiveTab] = useState<"tweet" | "stock_tip">("tweet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const tweetForm = useForm<TweetPostFormData>({
    defaultValues: {
      content: "",
      imageUrl: ""
    }
  });

  const stockTipForm = useForm<StockTipFormData>({
    defaultValues: {
      stockName: "",
      symbol: "",
      entryPrice: 0,
      exitPrice: 0,
      targetDate: "",
      tipType: "buy",
      reasoning: ""
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const onTweetSubmit = async (data: TweetPostFormData) => {
    setIsSubmitting(true);
    
    // Simple validation for demo
    if (!data.content || data.content.length > 600) {
      toast({
        title: "Validation Error",
        description: "Content is required and must be under 600 characters.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with image upload
    setTimeout(() => {
      toast({
        title: "Post Created",
        description: selectedImage 
          ? "Your post with image has been shared successfully!" 
          : "Your post has been shared successfully!"
      });
      tweetForm.reset();
      removeImage();
      onPostCreated?.();
      onClose();
      setIsSubmitting(false);
    }, 1000);
  };

  const onStockTipSubmit = async (data: StockTipFormData) => {
    setIsSubmitting(true);
    
    // Simple validation for demo
    if (!data.stockName || !data.symbol || !data.entryPrice || !data.exitPrice || !data.targetDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Stock Tip Created",
        description: "Your stock tip has been shared with the community!"
      });
      stockTipForm.reset();
      onPostCreated?.();
      onClose();
      setIsSubmitting(false);
    }, 1000);
  };

  const handleClose = () => {
    tweetForm.reset();
    stockTipForm.reset();
    removeImage();
    setActiveTab("tweet");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Create New Post
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="ml-auto h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tweet" | "stock_tip")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tweet" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Post
            </TabsTrigger>
            <TabsTrigger value="stock_tip" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Stock Tip
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tweet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Share Your Thoughts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...tweetForm}>
                  <form onSubmit={tweetForm.handleSubmit(onTweetSubmit)} className="space-y-4">
                    <FormField
                      control={tweetForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's on your mind?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your thoughts about the market, investment ideas, or financial insights..."
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{field.value?.length || 0}/600 characters</span>
                            <Badge variant="outline" className="text-xs">
                              Max 600 chars
                            </Badge>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Image Upload Section */}
                    <div className="space-y-3">
                      <FormLabel>Add Image (Optional)</FormLabel>
                      
                      {!imagePreview ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Image className="h-8 w-8 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-blue-600 hover:text-blue-500">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </div>
                            <div className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {selectedImage?.name}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Posting..." : "Share Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock_tip" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Share a Stock Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...stockTipForm}>
                  <form onSubmit={stockTipForm.handleSubmit(onStockTipSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={stockTipForm.control}
                        name="stockName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Apple Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={stockTipForm.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                              <Input placeholder="AAPL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={stockTipForm.control}
                      name="tipType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="buy">Buy</SelectItem>
                              <SelectItem value="sell">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={stockTipForm.control}
                        name="entryPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="150.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={stockTipForm.control}
                        name="exitPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="165.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={stockTipForm.control}
                      name="targetDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={stockTipForm.control}
                      name="reasoning"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Why this tip? (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your analysis or reasoning for this stock tip..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{field.value?.length || 0}/500 characters</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sharing..." : "Share Tip"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedCreatePostModal;
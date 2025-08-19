import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, TrendingUp, Image, X } from "lucide-react";

// Tweet-like post schema
const tweetPostSchema = z.object({
  content: z.string().min(1, "Content is required").max(600, "Content must be under 600 characters"),
  imageUrl: z.string().optional(),
});

// Stock tip schema
const stockTipSchema = z.object({
  stockName: z.string().min(1, "Stock name is required"),
  symbol: z.string().min(1, "Stock symbol is required").max(10, "Symbol too long"),
  entryPrice: z.number().min(0.01, "Entry price must be positive"),
  exitPrice: z.number().min(0.01, "Exit price must be positive"),
  targetDate: z.string().min(1, "Target date is required"),
  tipType: z.enum(['buy', 'sell']),
  reasoning: z.string().max(500, "Reasoning must be under 500 characters").optional(),
});

type TweetPostFormData = z.infer<typeof tweetPostSchema>;
type StockTipFormData = z.infer<typeof stockTipSchema>;

interface EnhancedCreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const EnhancedCreatePostModal = ({ isOpen, onClose, onPostCreated }: EnhancedCreatePostModalProps) => {
  const [activeTab, setActiveTab] = useState<"tweet" | "stock_tip">("tweet");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const tweetForm = useForm<TweetPostFormData>({
    resolver: zodResolver(tweetPostSchema),
    defaultValues: {
      content: "",
      imageUrl: ""
    }
  });

  const stockTipForm = useForm<StockTipFormData>({
    resolver: zodResolver(stockTipSchema),
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

  const onTweetSubmit = async (data: TweetPostFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          postType: 'tweet',
          userId: 'demo-user' // In a real app, this would come from authentication
        })
      });

      if (response.ok) {
        toast({
          title: "Post Created",
          description: "Your post has been shared successfully!"
        });
        tweetForm.reset();
        onPostCreated?.();
        onClose();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStockTipSubmit = async (data: StockTipFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/stock-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId: 'demo-user' // In a real app, this would come from authentication
        })
      });

      if (response.ok) {
        toast({
          title: "Stock Tip Created",
          description: "Your stock tip has been shared with the community!"
        });
        stockTipForm.reset();
        onPostCreated?.();
        onClose();
      } else {
        throw new Error('Failed to create stock tip');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create stock tip. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    tweetForm.reset();
    stockTipForm.reset();
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

                    <FormField
                      control={tweetForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                              />
                            </div>
                          </FormControl>
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface StockTip {
  _id: string;
  stockName: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  targetDate: string;
  type: 'buy' | 'sell';
  reasoning: string;
  author: string;
  createdAt: string;
  status: 'active' | 'completed' | 'expired';
  performance?: number;
}

const stockTipSchema = z.object({
  stockName: z.string().min(1, "Stock name is required"),
  symbol: z.string().min(1, "Stock symbol is required").max(10, "Symbol too long"),
  entryPrice: z.number().min(0.01, "Entry price must be positive"),
  exitPrice: z.number().min(0.01, "Exit price must be positive"),
  targetDate: z.string().min(1, "Target date is required"),
  type: z.enum(['buy', 'sell']),
  reasoning: z.string().max(500, "Reasoning must be under 500 characters")
});

type StockTipFormData = z.infer<typeof stockTipSchema>;

const StockTips = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: stockTips, isLoading } = useQuery<StockTip[]>({
    queryKey: ['/api/stock-tips'],
  });

  const form = useForm<StockTipFormData>({
    resolver: zodResolver(stockTipSchema),
    defaultValues: {
      stockName: "",
      symbol: "",
      entryPrice: 0,
      exitPrice: 0,
      targetDate: "",
      type: "buy",
      reasoning: ""
    }
  });

  const onSubmit = async (data: StockTipFormData) => {
    try {
      const response = await fetch('/api/stock-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast({
          title: "Stock Tip Created",
          description: "Your stock tip has been shared with the community!"
        });
        setIsCreateModalOpen(false);
        form.reset();
        // Invalidate query to refresh the list
        window.location.reload();
      } else {
        throw new Error('Failed to create stock tip');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create stock tip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculatePerformance = (tip: StockTip) => {
    const performance = ((tip.exitPrice - tip.entryPrice) / tip.entryPrice) * 100;
    return tip.type === 'buy' ? performance : -performance;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Stock Tips</h1>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                Share Tip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Share a Stock Tip</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
                    name="type"
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
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="reasoning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why this tip? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your analysis or reasoning..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Share Tip
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-20">
        {!stockTips || stockTips.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Stock Tips Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share a stock tip with the community!</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Share Your First Tip
            </Button>
          </div>
        ) : (
          stockTips.map((tip) => {
            const performance = calculatePerformance(tip);
            const isPositive = performance > 0;
            
            return (
              <Card key={tip._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {tip.stockName}
                        <Badge variant="secondary" className="text-xs">
                          {tip.symbol}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">by {tip.author}</p>
                    </div>
                    <Badge 
                      variant={tip.type === 'buy' ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {tip.type === 'buy' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {tip.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Entry</p>
                        <p className="font-medium">${tip.entryPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Target</p>
                        <p className="font-medium">${tip.exitPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Target: {formatDate(tip.targetDate)}
                      </span>
                    </div>
                    
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{performance.toFixed(1)}%
                    </div>
                  </div>

                  {tip.reasoning && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-gray-700">{tip.reasoning}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {formatDate(tip.createdAt)}
                    </span>
                    <Badge 
                      variant={tip.status === 'active' ? 'default' : tip.status === 'completed' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {tip.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StockTips;
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient, axiosInstance } from "@/lib/api";
import type { FileResponse, CreateStockTipInput, Tribe } from "@/types";
import { TrendingUp, Upload, X, Send, Image as ImageIcon, ChevronDown, Globe, Lock, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface StockTipFormData {
  stockName: string;
  symbol: string;
  entryPrice: string;
  targetPrice: string;
  entryDate: string;
  exitDate: string;
  reasoning?: string;
  chartImageId?: number;
  visibility: string;
}

interface Stock {
  name: string;
  symbol: string;
  currentPrice?: number;
}

interface CreateStockTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTipCreated?: () => void;
}

const CreateStockTipModal = ({ isOpen, onClose, onTipCreated }: CreateStockTipModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showStockResults, setShowStockResults] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<string>("public");
  const [selectedTribe, setSelectedTribe] = useState<Tribe | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Fetch user's tribes
  const { data: allTribes = [] } = useQuery({
    queryKey: ['tribes'],
    queryFn: async () => {
      const response = await apiClient.tribes.$get();
      return response;
    },
    enabled: isOpen // Only fetch when modal is open
  });

  // Filter tribes created by the current user
  const userTribes = allTribes.filter(tribe => tribe.userId === currentUser?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<StockTipFormData>({
    defaultValues: {
      stockName: "",
      symbol: "",
      entryPrice: "",
      targetPrice: "",
      entryDate: "",
      exitDate: "",
      reasoning: "",
      chartImageId: undefined,
      visibility: "public"
    }
  });

  const reasoning = watch("reasoning");

  // TanStack Query mutation for creating stock tip
  const createStockTipMutation = useMutation({
    mutationFn: async (data: CreateStockTipInput) => {
      const response = await apiClient.stock_tips.$post({
        body: data
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate stock tips query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['stock-tips'] });

      toast({
        title: "Success!",
        description: "Your stock tip has been shared with the community.",
      });

      reset();
      setImagePreview(null);
      setUploadedFileId(null);
      onTipCreated?.();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error?.message || "Failed to share stock tip. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      const { data: response } = await axiosInstance.post<FileResponse>('/files/upload', formData);
      setUploadedFileId(response.id);
      setValue('chartImageId', response.id);

      toast({
        title: "Image uploaded",
        description: "Chart image uploaded successfully"
      });
    } catch (error: any) {
      setImagePreview(null);

      const errorMessage = error?.response?.data?.message || error?.message || "Failed to upload image. Please try again.";
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedFileId(null);
    setValue('chartImageId', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: StockTipFormData) => {
    // Validation
    if (!data.stockName || !data.symbol) {
      toast({
        title: "Validation Error",
        description: "Stock name and symbol are required.",
        variant: "destructive"
      });
      return;
    }

    const entryPrice = parseFloat(data.entryPrice);
    const targetPrice = parseFloat(data.targetPrice);

    if (isNaN(entryPrice) || entryPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Entry price must be a valid number greater than 0.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(targetPrice) || targetPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Target price must be a valid number greater than 0.",
        variant: "destructive"
      });
      return;
    }

    // Prepare data for API
    const stockTipData: CreateStockTipInput = {
      stockName: data.stockName,
      symbol: data.symbol,
      entryPrice: entryPrice,
      targetPrice: targetPrice,
      entryDate: data.entryDate,
      exitDate: data.exitDate || undefined,
      reason: data.reasoning || undefined,
      chartImageId: data.chartImageId || undefined
    };

    // Call mutation
    createStockTipMutation.mutate(stockTipData);
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setUploadedFileId(null);
    setSelectedStock(null);
    setSearchQuery("");
    setShowStockResults(false);
    setSelectedVisibility("public");
    setSelectedTribe(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleVisibilitySelect = (value: string, tribe?: Tribe) => {
    setSelectedVisibility(value);
    if (tribe) {
      setSelectedTribe(tribe);
    } else {
      setSelectedTribe(null);
    }
  };

  const getVisibilityLabel = () => {
    if (selectedVisibility === "public") return "Public";
    if (selectedVisibility === "private") return "Private";
    if (selectedTribe) return selectedTribe.name;
    return "Public";
  };

  const getVisibilityIcon = () => {
    if (selectedVisibility === "public") return <Globe className="h-5 w-5 text-gray-600" />;
    if (selectedVisibility === "private") return <Lock className="h-5 w-5 text-gray-600" />;
    if (selectedTribe) return <Users className="h-5 w-5 text-gray-600" />;
    return <Globe className="h-5 w-5 text-gray-600" />;
  };

  // Mock stock data - replace with actual API call later
  const mockStocks: Stock[] = [
    { name: "Tata Power", symbol: "TTPL", currentPrice: 393.53 },
    { name: "Tata Motors", symbol: "TATAMOTORS", currentPrice: 775.40 },
    { name: "Tata Steel", symbol: "TATASTEEL", currentPrice: 140.25 },
  ];

  const filteredStocks = searchQuery
    ? mockStocks.filter(stock =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setValue("stockName", stock.name);
    setValue("symbol", stock.symbol);
    setSearchQuery("");
    setShowStockResults(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Share a Stock Tip
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
          <div className="px-5 py-4 overflow-y-auto flex-1">
            <div className="space-y-4">
              {/* Stock Search */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search by
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedStock ? `${selectedStock.name} (${selectedStock.symbol})` : searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowStockResults(true);
                      setSelectedStock(null);
                    }}
                    onFocus={() => setShowStockResults(true)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Stock name or Symbol"
                  />

                  {/* Stock Search Results */}
                  {showStockResults && filteredStocks.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredStocks.map((stock) => (
                        <button
                          key={stock.symbol}
                          type="button"
                          onClick={() => handleStockSelect(stock)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xs">
                                {stock.symbol.slice(0, 2)}
                              </span>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-sm text-gray-900">{stock.name}</p>
                              <p className="text-xs text-gray-500">{stock.symbol}</p>
                            </div>
                          </div>
                          {stock.currentPrice && (
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Current Price</p>
                              <p className="font-semibold text-sm text-gray-900">{stock.currentPrice}</p>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {selectedStock && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">
                          {selectedStock.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{selectedStock.name}</p>
                        <p className="text-xs text-gray-500">{selectedStock.symbol}</p>
                      </div>
                    </div>
                    {selectedStock.currentPrice && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Current Price</p>
                        <p className="font-semibold text-sm text-gray-900">{selectedStock.currentPrice}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Entry Price and Buy Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("entryPrice", { required: "Entry price is required" })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 200"
                  />
                  {errors.entryPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.entryPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Buy Date
                  </label>
                  <input
                    type="date"
                    {...register("entryDate", { required: "Buy date is required" })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 10/09/2026"
                  />
                  {errors.entryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.entryDate.message}</p>
                  )}
                </div>
              </div>

              {/* Target Price and Exit Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Target Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("targetPrice", { required: "Target price is required" })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 300"
                  />
                  {errors.targetPrice && (
                    <p className="text-red-500 text-xs mt-1">{errors.targetPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Exit Date
                  </label>
                  <input
                    type="date"
                    {...register("exitDate", { required: "Exit date is required" })}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g. 10/09/2026"
                  />
                  {errors.exitDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.exitDate.message}</p>
                  )}
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Reasoning
                </label>
                <textarea
                  {...register("reasoning")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                  placeholder="e.g. Strong Q1 earnings expected, iPhone 16 sales momentum, and AI integration driving growth."
                />
              </div>

              {/* Add Chart */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add Chart
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Chart preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      disabled={isUploadingImage}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <div className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Upload className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {isUploadingImage ? 'Uploading...' : 'Upload chart image'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section with Visibility and Post Button */}
          <div className="px-5 py-4 border-t border-gray-200 bg-white shrink-0">
            <div className="flex items-center justify-between gap-3">
              {/* Visibility Dropdown */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getVisibilityIcon()}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <span className="max-w-[150px] truncate">{getVisibilityLabel()}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
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
              </div>

              {/* Post Button */}
              <Button
                type="submit"
                className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm"
                disabled={createStockTipMutation.isPending}
              >
                <Send className="h-4 w-4" />
                {createStockTipMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStockTipModal;

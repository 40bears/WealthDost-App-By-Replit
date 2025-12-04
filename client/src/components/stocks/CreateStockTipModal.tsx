import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREATE_STOCK_TIP } from "@/graphql/stock-tips/mutations";
import { GET_STOCK_TIPS, GET_MY_STOCK_TIPS } from "@/graphql/stock-tips/queries";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMyTribes } from "@/hooks/graphql";
import { apiClient, axiosInstance } from "@/lib/api";
import type { StockSearchResult, StockSearchResponse } from "@/api/market/stocks/search";
import type { FileResponse } from "@/types";
import { useMutation } from "@apollo/client/react";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import { ChevronDown, Globe, Send, TrendingUp, Upload, Users, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface StockTipFormData {
  type: 'STOCKS' | 'FUTURES' | 'OPTIONS' | 'COMMODITIES';
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
  exchange?: string;
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showStockResults, setShowStockResults] = useState(false);
  const [selectedTribeId, setSelectedTribeId] = useState<string>("public");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Fetch tribes the current user is a member of using GraphQL
  const { data: myTribesData } = useMyTribes();

  // Show all tribes the user is a member of (not just owned ones)
  const memberTribes = (myTribesData as any)?.myTribes || [];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search stocks API
  const { data: searchResponse, isLoading: isSearching } = useTanStackQuery({
    queryKey: ['stock-search', debouncedSearchQuery],
    queryFn: async () => {
      if (debouncedSearchQuery.length < 2) return null;
      const response = await apiClient.market.stocks.search.$get({
        query: { q: debouncedSearchQuery }
      });
      return response;
    },
    enabled: isOpen && debouncedSearchQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract stocks array from response
  const searchResults = searchResponse?.stocks || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<StockTipFormData>({
    defaultValues: {
      type: "STOCKS",
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

  // GraphQL mutation for creating stock tip
  const [createStockTipMutation, { loading: isCreating }] = useMutation(CREATE_STOCK_TIP, {
    update: (cache, { data }) => {
      if (data?.createStockTip) {
        // Update GET_STOCK_TIPS query
        try {
          const existingData = cache.readQuery({
            query: GET_STOCK_TIPS,
          });

          if (existingData) {
            cache.writeQuery({
              query: GET_STOCK_TIPS,
              data: {
                stockTips: [data.createStockTip, ...existingData.stockTips],
              },
            });
          }
        } catch (error) {
          // Query might not be in cache, that's okay
        }

        // Update GET_MY_STOCK_TIPS query
        try {
          const existingMyData = cache.readQuery({
            query: GET_MY_STOCK_TIPS,
          });

          if (existingMyData) {
            cache.writeQuery({
              query: GET_MY_STOCK_TIPS,
              data: {
                myStockTips: [data.createStockTip, ...existingMyData.myStockTips],
              },
            });
          }
        } catch (error) {
          // Query might not be in cache, that's okay
        }
      }
    },
    onCompleted: (data) => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to share stock tip. Please try again.",
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
    console.log('Form data:', data);
    console.log('Selected stock:', selectedStock);

    // Validation
    if (!selectedStock) {
      toast({
        title: "Validation Error",
        description: "Please select a stock from the search results.",
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

    // Prepare data for GraphQL mutation
    const tribeId = selectedTribeId === "public" ? null : selectedTribeId;

    console.log('=== CREATE STOCK TIP DEBUG ===');
    console.log('selectedTribeId:', selectedTribeId);
    console.log('tribeId:', tribeId);
    console.log('tribeId !== null:', tribeId !== null);

    const stockTipData: any = {
      type: data.type,
      stockName: selectedStock.name,
      symbol: selectedStock.symbol,
      entryPrice: entryPrice,
      targetPrice: targetPrice,
      entryDate: data.entryDate,
      exitDate: data.exitDate || undefined,
      reason: data.reasoning || undefined,
      chartImageId: data.chartImageId || undefined,
      ...(tribeId !== null && { tribeId }),
    };

    console.log('Stock tip data being sent:', stockTipData);
    console.log('Stock tip data keys:', Object.keys(stockTipData));
    console.log('Stock tip data stringified:', JSON.stringify(stockTipData, null, 2));

    const mutationVariables = {
      variables: {
        input: stockTipData
      }
    };
    console.log('Full mutation variables:', JSON.stringify(mutationVariables, null, 2));

    // Call GraphQL mutation
    createStockTipMutation(mutationVariables);
  };

  const handleClose = () => {
    reset({
      type: "STOCKS",
      entryPrice: "",
      targetPrice: "",
      entryDate: "",
      exitDate: "",
      reasoning: "",
      chartImageId: undefined,
      visibility: "public"
    });
    setImagePreview(null);
    setUploadedFileId(null);
    setSelectedStock(null);
    setSearchQuery("");
    setShowStockResults(false);
    setSelectedTribeId("public");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getVisibilityLabel = () => {
    if (selectedTribeId === "public") return "Public";
    const tribe = memberTribes.find((t: any) => String(t.id) === selectedTribeId);
    return tribe ? tribe.name : "Public";
  };

  const getVisibilityIcon = () => {
    if (selectedTribeId === "public") return <Globe className="h-5 w-5 text-gray-600" />;
    return <Users className="h-5 w-5 text-gray-600" />;
  };

  // Use API search results
  const filteredStocks = searchResults;

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
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
              {/* Type Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Type
                </label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <SelectValue placeholder="Select investment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="STOCKS">Stocks</SelectItem>
                            <SelectItem value="FUTURES">Futures</SelectItem>
                            <SelectItem value="OPTIONS">Options</SelectItem>
                            <SelectItem value="COMMODITIES">Commodities</SelectItem>
                          </SelectContent>
                        </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                )}
              </div>

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
                  {showStockResults && searchQuery.length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {isSearching ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          Searching...
                        </div>
                      ) : filteredStocks.length > 0 ? (
                        filteredStocks.map((stock) => (
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
                                <p className="text-xs text-gray-500">{stock.symbol} • {stock.exchange}</p>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No stocks found
                        </div>
                      )}
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
                        <p className="text-xs text-gray-500">{selectedStock.symbol} • {selectedStock.exchange}</p>
                      </div>
                    </div>
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
                    <DropdownMenuItem onClick={() => setSelectedTribeId("public")}>
                      <Globe className="h-4 w-4 mr-2" />
                      Public
                    </DropdownMenuItem>

                    {memberTribes.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                          Your Tribes
                        </div>
                        {memberTribes.map((tribe: any) => (
                          <DropdownMenuItem
                            key={tribe.id}
                            onClick={() => setSelectedTribeId(String(tribe.id))}
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
                disabled={isCreating}
              >
                <Send className="h-4 w-4" />
                {isCreating ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStockTipModal;

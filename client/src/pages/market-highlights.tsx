import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Volume2, Activity } from "lucide-react";
import { Link } from "wouter";

const MarketHighlights = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  // Sample stocks data with Indian market focus
  const stocksData = [
    {
      id: 1,
      symbol: "RELIANCE",
      name: "Reliance Industries",
      price: "2,847.65",
      change: "+42.30",
      changePercent: "+1.51%",
      volume: "12.5M",
      marketCap: "19.2L Cr",
      high: "2,862.40",
      low: "2,805.20",
      sector: "Energy"
    },
    {
      id: 2,
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: "4,156.80",
      change: "-38.45",
      changePercent: "-0.92%",
      volume: "8.7M",
      marketCap: "15.1L Cr",
      high: "4,198.25",
      low: "4,142.30",
      sector: "IT"
    },
    {
      id: 3,
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      price: "1,742.90",
      change: "+12.85",
      changePercent: "+0.74%",
      volume: "15.3M",
      marketCap: "13.2L Cr",
      high: "1,755.60",
      low: "1,728.45",
      sector: "Banking"
    },
    {
      id: 4,
      symbol: "INFY",
      name: "Infosys Limited",
      price: "1,923.40",
      change: "-25.60",
      changePercent: "-1.31%",
      volume: "6.8M",
      marketCap: "8.1L Cr",
      high: "1,952.80",
      low: "1,915.70",
      sector: "IT"
    },
    {
      id: 5,
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      price: "1,287.35",
      change: "+18.25",
      changePercent: "+1.44%",
      volume: "11.2M",
      marketCap: "9.0L Cr",
      high: "1,295.80",
      low: "1,269.10",
      sector: "Banking"
    },
    {
      id: 6,
      symbol: "BHARTIARTL",
      name: "Bharti Airtel",
      price: "1,654.70",
      change: "+31.45",
      changePercent: "+1.94%",
      volume: "9.1M",
      marketCap: "9.9L Cr",
      high: "1,668.30",
      low: "1,623.25",
      sector: "Telecom"
    },
    {
      id: 7,
      symbol: "ITC",
      name: "ITC Limited",
      price: "456.80",
      change: "-4.20",
      changePercent: "-0.91%",
      volume: "18.5M",
      marketCap: "5.7L Cr",
      high: "463.40",
      low: "454.60",
      sector: "FMCG"
    },
    {
      id: 8,
      symbol: "LT",
      name: "Larsen & Toubro",
      price: "3,847.25",
      change: "+67.90",
      changePercent: "+1.80%",
      volume: "2.3M",
      marketCap: "5.4L Cr",
      high: "3,862.15",
      low: "3,779.35",
      sector: "Infrastructure"
    },
    {
      id: 9,
      symbol: "SBIN",
      name: "State Bank of India",
      price: "819.45",
      change: "+9.65",
      changePercent: "+1.19%",
      volume: "24.7M",
      marketCap: "7.3L Cr",
      high: "825.30",
      low: "809.80",
      sector: "Banking"
    },
    {
      id: 10,
      symbol: "HCLTECH",
      name: "HCL Technologies",
      price: "1,892.60",
      change: "-15.30",
      changePercent: "-0.80%",
      volume: "4.2M",
      marketCap: "5.1L Cr",
      high: "1,912.45",
      low: "1,885.20",
      sector: "IT"
    }
  ];

  // Filter stocks based on search query and filter selection
  const filteredStocks = stocksData.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterBy === "gainers") {
      return matchesSearch && parseFloat(stock.changePercent) > 0;
    } else if (filterBy === "losers") {
      return matchesSearch && parseFloat(stock.changePercent) < 0;
    } else if (filterBy === "sector" && searchQuery) {
      return stock.sector.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return matchesSearch;
  });

  const getChangeColor = (changePercent: string) => {
    return parseFloat(changePercent) >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (changePercent: string) => {
    return parseFloat(changePercent) >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2 text-gray-600 hover:text-gray-800 transition-all duration-300 active:scale-95">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Market Highlights</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Market Summary Cards */}
      <div className="max-w-md mx-auto px-4 pb-24 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">NIFTY 50</div>
              <div className="font-semibold text-sm">22,474.05</div>
              <div className="text-green-600 text-xs">+0.89%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-xl">
            <CardContent className="p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">SENSEX</div>
              <div className="font-semibold text-sm">73,876.44</div>
              <div className="text-green-600 text-xs">+0.67%</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search stocks or sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-xl"
            />
          </div>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="bg-white/70 backdrop-blur-md border-2 border-gray-200 rounded-xl">
              <SelectValue placeholder="Filter stocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stocks</SelectItem>
              <SelectItem value="gainers">Top Gainers</SelectItem>
              <SelectItem value="losers">Top Losers</SelectItem>
              <SelectItem value="volume">High Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stocks List */}
        <div className="space-y-3">
          {filteredStocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No stocks found matching your criteria</p>
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const ChangeIcon = getChangeIcon(stock.changePercent);
              
              return (
                <Card key={stock.id} className="bg-white/70 backdrop-blur-md border-2 border-gray-200 shadow-lg rounded-xl transition-all duration-300 active:scale-[0.98]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-sm">{stock.symbol}</h3>
                            <p className="text-xs text-gray-600">{stock.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">₹{stock.price}</div>
                            <div className={`text-xs flex items-center justify-end ${getChangeColor(stock.changePercent)}`}>
                              <ChangeIcon size={12} className="mr-1" />
                              {stock.change} ({stock.changePercent})
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <div className="flex items-center">
                            <Volume2 size={10} className="mr-1 text-gray-400" />
                            <span>{stock.volume}</span>
                          </div>
                          <div className="flex items-center">
                            <Activity size={10} className="mr-1 text-gray-400" />
                            <span>{stock.marketCap}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-purple-600 font-medium">{stock.sector}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>High: ₹{stock.high}</span>
                          <span>Low: ₹{stock.low}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Market Status */}
        <Card className="bg-green-50/70 backdrop-blur-md border-2 border-green-200 shadow-lg rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-700">Market Open</span>
            </div>
            <p className="text-xs text-green-600">Trading hours: 9:15 AM - 3:30 PM IST</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketHighlights;
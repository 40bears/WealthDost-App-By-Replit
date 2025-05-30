import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Upload, Link, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PortfolioUpload() {
  const [, setLocation] = useLocation();
  const [stockName, setStockName] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");

  const handleAddStock = () => {
    if (!stockName || !entryPrice || !targetPrice) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Here you would typically save to your backend
    console.log({
      stockName,
      entryDate,
      entryPrice,
      targetPrice,
      stopLoss,
      timeHorizon
    });
    
    // Clear form after adding
    setStockName("");
    setEntryDate("");
    setEntryPrice("");
    setTargetPrice("");
    setStopLoss("");
    setTimeHorizon("");
    
    alert("Stock pick added successfully!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      console.log("CSV file selected:", file.name);
      // Handle CSV upload logic here
      alert("CSV upload feature coming soon!");
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleBrokerageConnect = () => {
    alert("Brokerage API connection feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => setLocation("/dashboard")}
            className="mr-3 p-1"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Portfolio/</h1>
            <h2 className="text-xl font-semibold text-gray-900">Performance Upload</h2>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Upload Options */}
        <div className="space-y-3">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium">Upload CSV File</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={handleBrokerageConnect}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Link className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <div className="font-medium">Connect Brokerage API</div>
                    <div className="text-sm text-gray-500">(Zerodha, Upstox)</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manual Entry Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Tracked Call</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="stockName" className="text-sm font-medium text-gray-700">
                Stock Name
              </Label>
              <Input
                id="stockName"
                type="text"
                placeholder="Enter stock symbol (e.g., RELIANCE)"
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="entryDate" className="text-sm font-medium text-gray-700">
                  Entry Date & Price
                </Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="entryPrice" className="text-sm font-medium text-gray-700">
                  &nbsp;
                </Label>
                <Input
                  id="entryPrice"
                  type="number"
                  placeholder="0.00"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="targetPrice" className="text-sm font-medium text-gray-700">
                  Target Price & SL
                </Label>
                <Input
                  id="targetPrice"
                  type="number"
                  placeholder="0.00"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stopLoss" className="text-sm font-medium text-gray-700">
                  &nbsp;
                </Label>
                <Input
                  id="stopLoss"
                  type="number"
                  placeholder="0.00"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="timeHorizon" className="text-sm font-medium text-gray-700">
                Time Horizon
              </Label>
              <Input
                id="timeHorizon"
                type="text"
                placeholder="e.g., 3-6 months, 1 year"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleAddStock}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
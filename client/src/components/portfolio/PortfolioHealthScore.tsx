import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle, Target, PieChart, BarChart3, Lightbulb } from "lucide-react";

interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: string;
}

interface HealthAnalysis {
  overallScore: number;
  riskLevel: "Low" | "Medium" | "High";
  diversificationScore: number;
  performanceScore: number;
  riskScore: number;
  recommendations: string[];
  strengths: string[];
  concerns: string[];
  sectorAllocation: { [key: string]: number };
}

interface PortfolioHealthScoreProps {
  portfolio: PortfolioStock[];
}

const PortfolioHealthScore = ({ portfolio }: PortfolioHealthScoreProps) => {
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzePortfolioWithAI = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/portfolio/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze portfolio');
      }

      const analysisResult = await response.json();
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      calculatePortfolioHealth();
    }
    
    setIsLoading(false);
  };

  const calculatePortfolioHealth = () => {
    const sectorAllocation: { [key: string]: number } = {};
    let totalValue = 0;
    let totalGainLoss = 0;
    
    portfolio.forEach(stock => {
      const value = stock.quantity * stock.currentPrice;
      totalValue += value;
      totalGainLoss += (stock.currentPrice - stock.entryPrice) * stock.quantity;
      
      sectorAllocation[stock.sector] = (sectorAllocation[stock.sector] || 0) + value;
    });

    Object.keys(sectorAllocation).forEach(sector => {
      sectorAllocation[sector] = (sectorAllocation[sector] / totalValue) * 100;
    });

    const diversificationScore = Math.min(95, Object.keys(sectorAllocation).length * 15 + 25);
    const performanceScore = Math.max(10, Math.min(95, 50 + (totalGainLoss / totalValue) * 200));
    const riskScore = 100 - Math.max(...Object.values(sectorAllocation));
    const overallScore = Math.round((diversificationScore + performanceScore + riskScore) / 3);

    const riskLevel: "Low" | "Medium" | "High" = 
      overallScore >= 75 ? "Low" : overallScore >= 50 ? "Medium" : "High";

    const recommendations = [];
    const strengths = [];
    const concerns = [];

    if (Object.keys(sectorAllocation).length < 4) {
      recommendations.push("Consider diversifying across more sectors to reduce concentration risk");
    }

    if (Math.max(...Object.values(sectorAllocation)) > 40) {
      concerns.push("High concentration in one sector - consider rebalancing");
    }

    if (diversificationScore > 70) {
      strengths.push("Well-diversified portfolio across multiple sectors");
    }

    if (performanceScore > 60) {
      strengths.push("Portfolio showing positive performance trends");
    } else {
      recommendations.push("Review underperforming positions and consider rebalancing");
    }

    setAnalysis({
      overallScore,
      riskLevel,
      diversificationScore,
      performanceScore,
      riskScore,
      recommendations: recommendations.length > 0 ? recommendations : ["Portfolio appears well-balanced - continue monitoring market conditions"],
      strengths: strengths.length > 0 ? strengths : ["Stable portfolio composition"],
      concerns: concerns.length > 0 ? concerns : ["No major concerns identified"],
      sectorAllocation
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (portfolio.length === 0) {
    return (
      <Card className="border border-gray-200">
        <CardContent className="p-6 text-center">
          <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Portfolio Health Analysis</h3>
          <p className="text-gray-500 text-sm mb-4">
            Add stocks to your portfolio to get AI-powered health score and recommendations
          </p>
          <Button variant="outline" disabled>
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze Portfolio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!analysis ? (
        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-purple-900 mb-2">AI Portfolio Analysis Ready</h3>
            <p className="text-purple-700 text-sm mb-4">
              Get personalized insights and recommendations for your {portfolio.length} stock portfolio
            </p>
            <Button 
              onClick={analyzePortfolioWithAI}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Analyze My Portfolio
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className={`border-2 ${getScoreBgColor(analysis.overallScore)} border-opacity-20`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Portfolio Health Score</h3>
                <Badge variant={analysis.riskLevel === "Low" ? "default" : analysis.riskLevel === "Medium" ? "secondary" : "destructive"}>
                  {analysis.riskLevel} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
                <div className="flex-1">
                  <Progress value={analysis.overallScore} className="h-3" />
                  <p className="text-sm text-gray-600 mt-1">
                    {analysis.overallScore >= 80 ? "Excellent" : 
                     analysis.overallScore >= 60 ? "Good" : "Needs Improvement"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.diversificationScore)}`}>
                    {Math.round(analysis.diversificationScore)}
                  </div>
                  <div className="text-xs text-gray-500">Diversification</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibold ${getScoreColor(analysis.performanceScore)}`}>
                    {Math.round(analysis.performanceScore)}
                  </div>
                  <div className="text-xs text-gray-500">Performance</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-semibant ${getScoreColor(analysis.riskScore)}`}>
                    {Math.round(analysis.riskScore)}
                  </div>
                  <div className="text-xs text-gray-500">Risk Mgmt</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">AI Recommendations</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{rec}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Portfolio Strengths</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-sm text-gray-700">{strength}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold">Areas to Monitor</h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.concerns.map((concern, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <p className="text-sm text-gray-700">{concern}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Sector Allocation</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analysis.sectorAllocation).map(([sector, percentage]) => (
                  <div key={sector}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{sector}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={analyzePortfolioWithAI}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2" />
                Re-analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Re-analyze Portfolio
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default PortfolioHealthScore;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketData } from "@shared/schema";

interface MarketOverviewProps {
  data?: MarketData[];
  isLoading?: boolean;
}

const MarketOverview = ({ data, isLoading = false }: MarketOverviewProps) => {
  return (
    <div className="mx-4 my-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Today's Markets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex divide-x divide-gray-200">
            {isLoading ? (
              // Skeleton loading state
              <>
                <div className="flex-1 p-3 text-center">
                  <div className="text-xs text-gray-500">NIFTY 50</div>
                  <Skeleton className="h-5 w-24 mx-auto mt-1 mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
                <div className="flex-1 p-3 text-center">
                  <div className="text-xs text-gray-500">SENSEX</div>
                  <Skeleton className="h-5 w-24 mx-auto mt-1 mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
                <div className="flex-1 p-3 text-center">
                  <div className="text-xs text-gray-500">BTC/INR</div>
                  <Skeleton className="h-5 w-24 mx-auto mt-1 mb-1" />
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
              </>
            ) : (
              // Real data or fallback
              (data || [
                {
                  id: 1,
                  symbol: "NIFTY50",
                  name: "NIFTY 50",
                  price: "22,474.05",
                  change: "+197.30",
                  changePercent: "+0.89%",
                  updatedAt: new Date(),
                },
                {
                  id: 2,
                  symbol: "SENSEX",
                  name: "SENSEX",
                  price: "73,876.44",
                  change: "+489.57",
                  changePercent: "+0.67%",
                  updatedAt: new Date(),
                },
                {
                  id: 3,
                  symbol: "BTC/INR",
                  name: "BTC/INR",
                  price: "52,84,490",
                  change: "-1,16,000",
                  changePercent: "-2.14%",
                  updatedAt: new Date(),
                },
              ]).map((item, index) => (
                <div key={item.id || index} className="flex-1 p-3 text-center">
                  <div className="text-xs text-gray-500">{item.name}</div>
                  <div className="font-semibold">{item.price}</div>
                  <div className={`text-xs ${item.changePercent.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.changePercent}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;

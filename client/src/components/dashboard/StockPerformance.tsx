const StockPerformance = () => {
  const stocks = [
    { name: "Tata Power", price: 310, change: "+11%" },
    { name: "Reliance", price: 2845, change: "+2.3%" },
    { name: "HDFC Bank", price: 1650, change: "-0.8%" },
    { name: "Infosys", price: 1420, change: "+3.5%" },
    { name: "TCS", price: 3890, change: "+1.2%" },
    { name: "Wipro", price: 445, change: "-1.5%" },
    { name: "ITC", price: 465, change: "+0.9%" },
    { name: "Bharti Airtel", price: 1285, change: "+4.2%" },
  ];

  return (
    <div className="w-full h-[30px] bg-[#E7E5E4] overflow-hidden relative">
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {/* Duplicate the stocks array for seamless loop */}
        {[...stocks, ...stocks].map((stock, index) => (
          <div key={index} className="inline-flex items-center mx-6">
            <span className="text-sm text-gray-800">{stock.name}</span>
            <span className="text-sm font-semibold text-gray-900 mx-2">{stock.price}</span>
            <span 
              className="text-sm font-medium"
              style={{ color: stock.change.startsWith('+') ? '#16803C' : '#DC2626' }}
            >
              {stock.change}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default StockPerformance;
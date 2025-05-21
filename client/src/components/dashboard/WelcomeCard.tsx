import { Button } from "@/components/ui/button";

const WelcomeCard = () => {
  return (
    <div className="mx-4 my-4">
      <div className="bg-primary rounded-xl p-5 text-white">
        <h2 className="text-xl font-semibold mb-2">Welcome to WealthDost, there! 👋</h2>
        <p className="text-sm mb-4">Start exploring financial insights from the community</p>
        <Button className="bg-white text-primary hover:bg-white/90 font-medium py-2 px-4 rounded-lg text-sm">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default WelcomeCard;

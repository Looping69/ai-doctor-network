import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Removed useAuth as it's not needed for static links/buttons here

const CTASection = () => {
  return (
    // Updated styles: light bg, padding, text center
    <section className="bg-gray-100 py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto"> {/* Max width container */}
        {/* Updated heading */}
        <h2 className="text-3xl font-bold mb-4 leading-tight text-gray-900">
          Ready to transform your healthcare experience?
        </h2>
        {/* Updated paragraph */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Our AI specialists are available 24/7 to assist with your medical questions and needs.
        </p>
        {/* Updated buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-lg px-7 py-3.5"> {/* btn-large equivalent */}
              Get Started
            </Button>
          </Link>
          <Link to="/features">
            <Button variant="outline" className="text-base font-semibold rounded-lg px-7 py-3.5 text-gray-700 border-gray-300 hover:bg-gray-50"> {/* btn-outline btn-large equivalent */}
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

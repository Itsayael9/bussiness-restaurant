import { motion } from "framer-motion";
import Header from "@/components/customer/Header";
import HeroSlider from "@/components/customer/HeroSlider";
import SearchBar from "@/components/customer/SearchBar";
import CategoryGrid from "@/components/customer/CategoryGrid";
import LocationMapSection from "@/components/customer/LocationMapSection";
import FloatingActions from "@/components/customer/FloatingActions";
import Footer from "@/components/customer/Footer";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Header />
      <main>
        <HeroSlider />
        <div className="container -mt-8 sm:-mt-10 relative z-10 px-4">
          <SearchBar />
        </div>
        <CategoryGrid />
        <LocationMapSection />
      </main>
      <Footer />
      <FloatingActions />
    </motion.div>
  );
};

export default Home;

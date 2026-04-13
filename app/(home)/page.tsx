
import Carousel from "@/components/homePageElements/banner";
import ProfessionalSearch from "@/components/homePageElements/searchBox";
import TopDestinations from "@/components/homePageElements/topDestination";

export default function Home() {
  return (
    <>
      <div className="mt-16 mb-8">
        <Carousel />
        <ProfessionalSearch />
        {/* <TopDestinations /> */}
      </div>
    </>
  );
}

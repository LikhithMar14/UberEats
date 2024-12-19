import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import FilterPage from "./FilterPage";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import HeroImage from "@/assets/hero_pizza.png";

const SkeletonCard = () => (
  <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden animate-pulse">
    <div className="relative">
      <AspectRatio ratio={16 / 6}>
        <div className="w-full h-full bg-gray-300 dark:bg-gray-700" />
      </AspectRatio>
    </div>
    <CardContent className="p-4">
      <div className="w-1/2 h-6 bg-gray-300 dark:bg-gray-700 mb-2" />
      <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-700 mb-2" />
      <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-700 mb-4" />
      <div className="flex gap-2 mt-4 flex-wrap">
        <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="w-20 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>
    </CardContent>
    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
      <div className="w-32 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
    </CardFooter>
  </Card>
);

const SearchPage = () => {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds (or after fetching data)
    }, 2000);
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <FilterPage />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search by Restaurant & cuisines"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="bg-orange hover:bg-orangeHover">Search</Button>
          </div>
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 my-3">
              <h1 className="font-medium text-lg">(2) Search result found</h1>
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                {["Noodles", "Momos", "Desserts"].map(
                  (selectedFilter: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative inline-flex items-center max-w-full"
                    >
                      <Badge
                        className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                        variant="outline"
                      >
                        {selectedFilter}
                      </Badge>
                      <X
                        className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                        size={16}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 ">
              {loading
                ? [1, 2, 3].map((item: number, idx: number) => (
                    <SkeletonCard key={idx} />
                  ))
                : [1, 2, 3].map((item: number, idx: number) => (
                    <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                      <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                          <img
                            src={HeroImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>

                        <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg py-1 px-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Featured
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Pizza Hunt
                        </h1>
                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin size={16} />
                          <p className="text-sm">
                            City: <span className="font-medium">Delhi</span>
                          </p>
                        </div>
                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                          <Globe size={16} />
                          <p className="text-sm">
                            Country: <span className="font-medium">India</span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {["Noodles", "Momos", "Desserts"].map(
                            (cuisine: string, idx: number) => (
                              <Badge
                                key={idx}
                                className="font-medium px-2 py-1 rounded-full shadow-sm"
                              >
                                {cuisine}
                              </Badge>
                            )
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                        <Link to={`/restaurant/${1234}`}>
                          <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                            View Menus
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          No results found
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          We couldn't find any results for "{searchText}". <br /> Try searching
          with a different term.
        </p>
        <Link to="/">
          <Button className="mt-4 bg-orange hover:bg-orangeHover">
            Go Back to Home
          </Button>
        </Link>
      </div>
    );
  };

export default SearchPage;

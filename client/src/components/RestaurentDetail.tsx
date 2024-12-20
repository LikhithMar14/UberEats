import { useParams } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Timer } from "lucide-react";
import AvailabeMenu from "./AvailableMenu";

const RestaurentDetail = () => {
  const params = useParams();

  return (
    <div className="flex max-w-7xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 md:64 lg:h-72 ">
          <img
            src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">Pizza Hunt</h1>
            <div className="flex gap-2 my-2">
              {["Pizza", "Momos", "Deserts"].map(
                (cuisine: string, idx: number) => (
                  <Badge key={idx}>{cuisine}</Badge>
                )
              )}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 " />
                <h1 className="flex items-center gap-2 font-medium">
                  Delivery Time: <span className="text-[#D19254]">35 mins</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <AvailabeMenu/>
      </div>
    </div>
  );
};
export default RestaurentDetail;

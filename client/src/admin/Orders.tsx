import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Orders = () => {
    
    return (
        <div className="max-w-7xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:white mb-10">Orders Overview</h1>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:pd-8  dark:border-gray-700">
                     <div className="flx-1 mb-6 sm:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800  dark:text-gray-100">Lorem</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 ">
                            <span className="font-semibold">Address:</span>
                            Lorem ipsum dolor sit.
                            
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Total Amount:</span>
                                160
                            </p>


                     </div>
                     <div className="w-full sm:w-1/3">

                     <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Status</Label>
                     <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[
                      "Pending",
                      "Confirmed",
                      "Preparing",
                      "Out For Delivery",
                      "Delivered",
                    ].map((status: string, index: number) => (
                      <SelectItem key={index} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

                     </div>

                </div>

            </div>
        </div>
    )
}
export default Orders

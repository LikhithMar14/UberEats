import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  restaurentFormSchema,
  restaurentFormState,
} from "@/schema/restaurentSchema";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

const Restaurant = () => {
  const loading = false;
  const restaurant = true;
  const [input, setInput] = useState<restaurentFormState>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined, 
  });
  const [errors, setErrors] = useState<Partial<restaurentFormState>>({});

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files ? e.target.files[0] : undefined;
      setInput({ ...input, [name]: file });
    } else {
      setInput({
        ...input,
        [name]: type === "number" && value === "" ? "" : type === "number" ? Number(value) : value,
      });
    }
  };

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = restaurentFormSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<restaurentFormState>);
      return;
    }
    setErrors({})
    console.log(input);
  };

  return (
    <div className="amx-w-7xl mx-auto md:mx-14 my-10">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurents</h1>
          <form onSubmit={onSubmitHandler}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              <div className="md:space-y-1">
                <Label>Restuarent Name</Label>
                <Input
                  type="text"
                  name="restaurantName"
                  value={input.restaurantName}
                  onChange={changeEventHandler}
                  placeholder="Enter your restaurant name"
                />
                {errors.restaurantName && (
                  <span className="text-xs text-red-600">
                    {errors.restaurantName}
                  </span>
                )}
              </div>
              <div className="md:space-y-1">
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  placeholder="Enter City"
                />
                {errors.city && (
                  <span className="text-xs text-red-600">
                    {errors.city}
                  </span>
                )}
              </div>
              <div className="md:space-y-1">
                <Label>Country</Label>
                <Input
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  placeholder="Enter your Country name"
                />
                {errors.country && (
                  <span className="text-xs text-red-600">
                    {errors.country}
                  </span>
                )}
              </div>
              <div className="md:space-y-1">
                <Label >Expected Delivery Time (minutes)</Label>
                <Input
                  type="number"
                  name="deliveryTime"
                  value={input.deliveryTime}
                  onChange={changeEventHandler}
                  placeholder="Enter Delivery Time"
                />
                {errors.deliveryTime && (
                  <span className="text-xs text-red-600">
                    {errors.deliveryTime}
                  </span>
                )}
              </div>
              <div className="md:space-y-1">
                <Label >Cuisines</Label>
                <Input
                  type="text"
                  name="cuisines"
                  value={input.cuisines.join(",")}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  placeholder="e.g. Momos, Noodles"
                />
                {errors.cuisines && (
                  <span className="text-xs text-red-600">
                    {errors.cuisines}
                  </span>
                )}
              </div>
            </div>
            <div>
              <FileUpload
                onChange={(files) => {
                  setInput({ ...input, imageFile: files[0] });
                }}
              />
              {errors.imageFile && (
                <span className="text-xs text-red-600">
                  {errors.imageFile.toString()}
                </span>
              )}
            </div>

            <div className="my-5 w-full sm:w-fit text-center">
              {loading ? (
                <Button className="bg-orange hover:bg-orangeHover disabled">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="bg-orange hover:bg-orangeHover">
                  {restaurant
                    ? "Update Your Restaurant"
                    : "Add Your Restaurant"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;

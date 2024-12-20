import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { menuSchema, menuState } from "@/schema/restaurentSchema";
import { Loader2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";

const AddMenu = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<menuState>({
    name: "",
    description: "",
    price: 0,
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Partial<menuState>>({});

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<menuState>);
      return;
    }
    setErrors({});
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Submitted Data:", input);
      setLoading(false);
      setOpen(false); // Close dialog after submission
    }, 2000);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setInput({ ...input, imageFile: files ? files[0] : undefined });
    } else {
      setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-orangeHover">
              <Plus />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              Add a New Menu
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmitHandler}>
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={onChangeHandler}
                  placeholder="Enter menu name"
                />
                {errors.name && (
                  <span className="text-xs text-red-600">{errors.name}</span>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={onChangeHandler}
                  placeholder="Enter menu description"
                />
                {errors.description && (
                  <span className="text-xs text-red-600">
                    {errors.description}
                  </span>
                )}
              </div>
              <div>
                <Label>Price in (INR)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={onChangeHandler}
                  placeholder="Enter menu price"
                />
                {errors.price && (
                  <span className="text-xs text-red-600">{errors.price}</span>
                )}
              </div>
              <div>
                <Label>Upload Menu Image</Label>
                <Input
                  type="file"
                  name="imageFile"
                  onChange={onChangeHandler}
                />
                {errors.imageFile && (
                  <span className="text-xs text-red-600">
                    {errors.imageFile.toString()}
                  </span>
                )}
              </div>

              <DialogFooter className="mt-5">
                {loading ? (
                  <Button disabled className="bg-orange hover:bg-orangeHover">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button className="bg-orange hover:bg-orangeHover">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-6 space-y-4"></div>
    </div>
  );
};

export default AddMenu;

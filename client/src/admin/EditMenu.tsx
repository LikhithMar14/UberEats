import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { menuSchema } from "@/schema/restaurentSchema"; // Assuming you already have a schema defined

const EditMenu = ({
  selectedMenu,
  editOpen,
  setEditOpen,
}: {
  selectedMenu: any;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: 0,
    imageFile: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMenu) {
      setInput({
        name: selectedMenu.name || "",
        description: selectedMenu.description || "",
        price: selectedMenu.price || 0,
        imageFile: undefined,
      });
    }
  }, [selectedMenu]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));
  };

  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs using zod schema
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || "Invalid input"])
        )
      );
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Edited Menu Data:", input);
      setLoading(false);
      setEditOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <h2>Edit Menu</h2>
          <DialogDescription>
            Update your menu to keep your offerings fresh and exciting!
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
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={input.description}
              onChange={onChangeHandler}
              placeholder="Enter menu description"
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <span className="text-xs text-red-600">{errors.description}</span>}
          </div>
          <div>
            <Label>Price in (INR)</Label>
            <Input
              type="number"
              name="price"
              value={input.price}
              onChange={onChangeHandler}
              placeholder="Enter menu price"
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && <span className="text-xs text-red-600">{errors.price}</span>}
          </div>
          <div>
            <Label>Upload Menu Image</Label>
            <Input
              type="file"
              name="imageFile"
              onChange={onChangeHandler}
              className={errors.imageFile ? "border-red-500" : ""}
            />
            {errors.imageFile && <span className="text-xs text-red-600">{errors.imageFile}</span>}
          </div>
          <DialogFooter className="mt-5">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-orangeHover">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-orange hover:bg-orangeHover">Submit</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;

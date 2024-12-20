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
  const loading = false
  const [input,setInput] = useState<menuState>({
    name:"",
    description:"",
    price:0,
    imageFile:undefined
    
  })
  const [errors,setErrors] =useState<Partial<menuState>>({});

  const onSubmitHandler = (e:FormEvent) =>{
    e.preventDefault();
    const result = menuSchema.safeParse(input)
    if(!result.success){
        const fieldErrors = result.error.formErrors.fieldErrors;
        setErrors(fieldErrors as Partial<menuState>)
        return;
    }
  }

  const onChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  }
  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl ">
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
              Create a menu that will make your restaurent stand out.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmitHandler}>
            <div>
                <Label>Name</Label>
                <Input
                type="text"
                name="name"
                onChange={onChangeHandler}

                placeholder="Enter menu name"
                />
            </div>
            <div>
                <Label>Description</Label>
                <Input
                type="text"
                name="description"
                onChange={onChangeHandler}

                placeholder="Enter menu description"
                />
            </div>
            <div>
                <Label>Prince in (INR)</Label>
                <Input
                type="text"
                name="price"
                onChange={onChangeHandler}

                placeholder="Enter menu price"
                />
            </div>
            <div>
                <Label>Upload Menu Image</Label>
                <Input
                type="file"
                name="image"
                onChange={onChangeHandler}


                />
            </div>

            <DialogFooter className="mt-5">
                {
                    loading ? (
                        <Button  disabled className="bg-orange hover:bg-orangeHover"><Loader2 className="h-4 w-4 animate-spin"/>Please wait</Button>

                    ):(<Button className="bg-orange hover:bg-orangeHover">Submit</Button>)
                }
                
            </DialogFooter>

            
          </form>
        </DialogContent>
      </Dialog>
      </div>
      <div className="mt-6 space-y-4">

      </div>
    </div>
  );
};

export default AddMenu;

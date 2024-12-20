import { z } from "zod";

export const restaurentFormSchema = z.object({
  restaurantName: z.string().nonempty({ message: "Restaurant name is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  country: z.string().nonempty({ message: "Country is required" }),
  deliveryTime: z.number().min(0, { message: "Delivery time cannot be negative" }),
  cuisines: z.array(z.string()).min(1, { message: "At least one cuisine is required" }),
  imageFile: z.instanceof(File).optional().refine((file) => file?.size !== 0, {
    message: "Image file is required",
  }),
});
export const menuSchema = z.object({
    name: z.string().min(3, "Menu name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    price: z
    .number()
    .positive("Price must be a positive number")
    .max(99999, "Price must be less than 100,000"),
    imageFile: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), "File must be an image")
      .optional(),
  });

export type menuState = z.infer<typeof menuSchema>;

export type restaurentFormState = z.infer<typeof restaurentFormSchema>;

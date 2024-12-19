import {z} from "zod"

export const userSignUpSchema  = z.object({
    fullname:z.string().min(2,"Full name is required"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be atlest 6 characters."),
    contact:z.string().min(10,"Contact number must be 10 digits").max(10,"Contact number must be 10 digits")
})
//zod will provide the types
export const userLoginSchema  = z.object({

    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Password must be atlest 6 characters."),

})
export type SignupInputState = z.infer<typeof userSignUpSchema>
export type LoginInputState = z.infer<typeof userLoginSchema>
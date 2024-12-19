import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";


import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";


const Login = () => {
    const [input,setInput] = useState<LoginInputState>({
        email:"",
        password:"",
    })
    const[errors,setErrors] = useState<Partial<LoginInputState>>({})
    const changeEventHandler = (e:ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target;
        setInput({...input,[name]:value})
    }
    const loginSubmitHandler = (e:FormEvent) =>{
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if(!result.success){
            const fieldErrors = result.error.formErrors.fieldErrors
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        //login api implementation

        console.log(input)
    }
    const loading  = false;
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <form className="md:p-8 w-full max-w-md rouded-lg md:border border-gray-200 mx-4 " onSubmit={loginSubmitHandler}>
        <div className="mb-4">
          <h1 className="font-bold text-2xl">Uber Eats </h1>
        </div>
        {/* This box will be full width on small screens but limited to 448px on large screens.*/}
        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              name = "email"
              placeholder="Email"
              value = {input.email}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1 "
            ></Input>
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
          </div>
        </div>
        <div className="mb-4">
            <div className="relative">
            <Input
                type="password"
                name="password"
                placeholder="Password"
                value={input.password}
                onChange={changeEventHandler}
                className="pl-10 focus-visible:ring-1 "
            ></Input>
            <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {errors && errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </div>
        </div>

        <div className="mb-10">
            {
                loading ?  <Button className = 'w-full bg-orange hover:bg-black ' disabled><Loader2 className="animate-spin mr-2 h-4 w-4 "/>Please wait</Button>
                :<Button className = 'w-full bg-orange hover:bg-orangeHover'>Login</Button>
            }
            
        </div>
        <div className="mt-2 mb-2 flex justify-center" >
          <Link to= "/forgot-password" className=" hover:text-blue-500 hover:underline">
            Forgot Password
          </Link>
        </div>
        <Separator/>
        <div className="flex justify-center">
            <p className="mt-2 ">Don't have an account?{" "}
                <Link to= "/signup" className="text-blue-500 ">Signup</Link>

            </p>
        </div>



      </form>
    </div>
  );
};
export default Login;

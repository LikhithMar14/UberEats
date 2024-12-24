import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"

import {  SignupInputState, userSignUpSchema,  } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User2 } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";




  const SignUp = () => {
    const [input, setInput] = useState<SignupInputState>({
        email: "",
        password: "",
        fullname: "",
        contact: "",
    });
    const [errors, setErrors] = useState<Partial<SignupInputState>>({});
    const { signup, loading } = useUserStore();
    const navigate = useNavigate();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const result = userSignUpSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }

        try {
            await signup(input);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };
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
              type="fullname"
              name = "fullname"
              placeholder="Full Name"
              value = {input.fullname}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1 "
            ></Input>
            <User2 className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {
                errors && errors.fullname && <span className="text-sm text-red-500">{errors.fullname}</span>
            }
          </div>
        </div>

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
            {
                errors && errors.email && <span className="text-sm text-red-500">{errors.email}</span>
            }
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
            {
                errors && errors.password && <span className="text-sm text-red-500">{errors.password}</span>
            }
            </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              name = "contact"
              placeholder="Contact"
              value = {input.contact}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1 "
            ></Input>
            <PhoneOutgoing className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
            {
                errors && errors.contact && <span className="text-sm text-red-500">{errors.contact}</span>
            }
          </div>
        </div>

        <div className="mb-10">
            {
                loading ?  <Button className = 'w-full bg-orange hover:bg-orangeHover ' disabled><Loader2 className="animate-spin mr-2 h-4 w-4 "/>Please wait</Button>
                :<Button className = 'w-full bg-orange hover:bg-orangeHover'>Signup</Button>
            }
            
        </div>
        <Separator/>
        <div className="flex justify-center">
        <p className="mt-2 ">Already  have an account?{" "}
            <Link to= "/Login" className="text-blue-500 ">Login</Link>

        </p>

        </div>

      </form>
    </div>
  );
};
export default SignUp;

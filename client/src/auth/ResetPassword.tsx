import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Loader2, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setNewPassword] = useState<string>("");
  const loading = false;
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-500">
            Enter your new password
          </p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={password}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="pl-10 focus-visible:ring-1"
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>

        {loading ? (
          <Button disabled className="bg-orange hover:bg-orangeHover">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="bg-orange hover:bg-orangeHover">
            Send Reset Link
          </Button>
        )}
        <div className="flex w-full justify-center">
          Back to{" "}
          <Link to="/login" className="text-blue-500 ml-1">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};
export default ResetPassword;

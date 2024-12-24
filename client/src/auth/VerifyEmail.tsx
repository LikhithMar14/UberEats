import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useUserStore } from "@/store/useUserStore";
import {  REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader2 } from "lucide-react";
import {  FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const {verifyEmail,loading}  = useUserStore();
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate()
  const onOtpComplete = async (e: FormEvent) => {
    e.preventDefault();
    console.log("OTP:",otp)
    try{
      await verifyEmail(otp);
      navigate('/login')

    }catch(err){
      console.log(err)
    }
    
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>

        <form onSubmit={onOtpComplete}>
          <div className="flex flex-col w-full justify-center items-center gap-8">
            <div className="flex justify-between">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                pattern= {REGEXP_ONLY_DIGITS_AND_CHARS}

              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
              {loading ? (
                <Button
                  disabled
                  className="bg-orange hover:bg-orangeHover w-full"
                >
                  <Loader2 className="animate-spin mr-1 h-4 w-4" />Verify
                </Button>
              ) : (
                <Button className="bg-orange hover:bg-orangeHover">
                  Verify
                </Button>
              )}
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;

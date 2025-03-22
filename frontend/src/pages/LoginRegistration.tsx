import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AuthPages = () => {
  const [activeTab, setActiveTab] = useState("register");
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Handle registration form submission
  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to send verification email
    setTimeout(() => {
      setIsSubmitting(false);
      setRegistrationStep(2);
    }, 1500);
  };

  // Handle OTP verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsSubmitting(false);
      if (otpCode.length === 6) {
        setOtpVerified(true);
        setTimeout(() => {
          setRegistrationStep(3);
        }, 1000);
      }
    }, 1500);
  };

  // Handle final registration step
  const handleCompleteRegistration = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate final registration
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveTab("login");
    }, 1500);
  };

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Logged in successfully!");
    }, 1500);
  };

  const renderRegistrationStep = () => {
    switch (registrationStep) {
      case 1:
        return (
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I have read and agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!termsAccepted || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent text-white rounded-full" />
                    Sending verification...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </Button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOTP}>
            <div className="space-y-4">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription className="text-sm">
                  We've sent a verification code to{" "}
                  <span className="font-medium">{email}</span>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit code"
                  required
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                    )
                  }
                  maxLength={6}
                  pattern="\d{6}"
                  className="text-center text-lg tracking-widest"
                />
              </div>

              {otpVerified && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <AlertDescription className="text-sm">
                      Email verified successfully!
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={otpCode.length !== 6 || isSubmitting || otpVerified}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent text-white rounded-full" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-500">Didn't receive a code?</span>{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    alert("New code sent!");
                    setOtpCode("");
                  }}
                >
                  Resend
                </button>
              </div>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleCompleteRegistration}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Choose a Password</Label>
                <Input id="password" type="password" required />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace Name</Label>
                <Input
                  id="workspace"
                  placeholder="Your Company Name"
                  required
                />
                <p className="text-xs text-gray-500">
                  This is where you'll collaborate with your team
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent text-white rounded-full" />
                    Creating account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 w-screen">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Handyman
                </h2>
              </div>
            </div>

            <Tabs
              defaultValue={activeTab}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="register" className="mt-4">
                <CardContent className="pt-4">
                  <CardDescription className="text-center mb-4">
                    {registrationStep === 1 &&
                      "Create your account to get started"}
                    {registrationStep === 2 && "Verify your email address"}
                    {registrationStep === 3 &&
                      "Just a few more details to complete setup"}
                  </CardDescription>
                  {renderRegistrationStep()}
                </CardContent>
              </TabsContent>

              <TabsContent value="login" className="mt-4">
                <CardContent className="pt-4">
                  <CardDescription className="text-center mb-4">
                    Welcome back! Enter your credentials to continue.
                  </CardDescription>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail">Email Address</Label>
                        <Input id="loginEmail" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loginPassword">Password</Label>
                          <a
                            href="#"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <Input id="loginPassword" type="password" required />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent text-white rounded-full" />
                            Logging in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardFooter className="border-t border-gray-100 p-4">
            <p className="text-center text-xs text-gray-500 w-full">
              By using our service, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPages;

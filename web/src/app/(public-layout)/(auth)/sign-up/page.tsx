"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleSignIn from "@/components/auth/google-auth";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AuthTitle } from "@/components/auth/auth-title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      router.push("/sign-in");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center relative">
      <AuthTitle />
      <div className="w-full max-w-xs space-y-8">
        <div className="flex flex-row justify-center items-center">
          <h2 className="text-center text-3xl font-bold ml-3">
            Create an account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            className="h-14"
            name="email"
            type="email"
            placeholder="Email address*"
            required
          />
          <Input
            className="h-14"
            name="name"
            type="text"
            placeholder="Username*"
            required
          />
          <div className="relative">
            <Input
              className="h-14"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password*"
              required
            />
            <Button
              type="button"
              variant={"ghost"}
              onClick={togglePasswordVisibility}
              className="absolute top-2.5 right-2 flex items-center rounded-full p-2.5"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-base font-normal bg-gradient-to-b from-[#0395E2] to-[#1385D2] hover:to-[#0395E2] text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#0395E2] hover:underline">
            Sign In
          </Link>
        </p>

        <div className="relative h-0">
          <Separator />
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 -mt-2 text-xs">OR</span>
          </div>
        </div>
        <GoogleSignIn />
        <div className="flex w-full"></div>
        <div className="flex items-center gap-4 text-sm justify-center h-4">
          <Link href="/sign-in" className="text-[#0395E2] hover:underline">
            Terms of Use
          </Link>
          <Separator orientation="vertical" className="text-primary" />
          <Link href="/sign-in" className="text-[#0395E2] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

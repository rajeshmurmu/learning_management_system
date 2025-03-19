import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthApiClient from "@/lib/AuthApiClient";
import { useState } from "react";
import PropTypes from "prop-types";

export function SignupForm({ setActiveTab }) {
  const [isLoading, setIsLoading] = useState(false);
  const signupFrom = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await AuthApiClient.signupUser(data);

      if (res.data.success) {
        toast.success(res.data.message || "Signup successfully");
        setActiveTab("login");
      } else {
        toast.error(res.data.error || "Signup failed");
      }
      // console.log(data);
    } catch (error) {
      console.log("onSubmit error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        <CardDescription>
          Enter your username,email and password below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...signupFrom}>
          <form
            onSubmit={signupFrom.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={signupFrom.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupFrom.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupFrom.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="#" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

SignupForm.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

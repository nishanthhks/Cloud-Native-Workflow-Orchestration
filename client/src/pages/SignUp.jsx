import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      setError(""); // Clear any previous errors
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        values
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative z-10 w-full max-w-[400px] p-8">
        <div className="relative overflow-hidden rounded-lg border border-blue-500/10 bg-gradient-to-br from-black/5 via-blue-800/20 to-blue-950 backdrop-blur-sm">
          {/* Gradient Background with Wheel */}
          <div className="absolute inset-0">
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-tr from-blue-600/40 to-blue-800/40 rounded-full blur-xl animate-spin-slow"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-bl from-blue-600/40 to-blue-800/40 rounded-full blur-xl animate-spin-slow"></div>
          </div>

          <div className="relative z-10 p-6">
            <h1 className="text-2xl font-bold text-white text-center mb-6">
              Create Account
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter username"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                  Sign Up
                </Button>

                {error && (
                  <p className="text-center text-red-400 text-sm">{error}</p>
                )}

                <div className="text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-300 hover:text-blue-200 transition-colors">
                    Login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

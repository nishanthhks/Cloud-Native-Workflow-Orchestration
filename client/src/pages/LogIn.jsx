import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUserState } from "@/context/userContext";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

function LogIn() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setUser } = useUserState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        values
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
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
              Welcome Back
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

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                  Login
                </Button>

                {error && (
                  <p className="text-center text-red-400 text-sm">{error}</p>
                )}

                <div className="text-center text-sm text-white/70">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-300 hover:text-blue-200 transition-colors">
                    Sign Up
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

export default LogIn;

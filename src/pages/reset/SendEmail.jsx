import React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";



export default function SendEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[430px]">
        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot your Password
        </h1>
        <h2 className="text-lg font-medium text-center mb-6">
          Enter email address to receive password reset link
        </h2>
        <form className="space-y-4 text-gray-800">
          <div>
            <label
              htmlFor="email"
              className="block max-w-fit text-sm text-gray-800 sm:text-base font-medium mb-2 "
            >
              Email*
            </label>
            <Input
              className="w-full"
              type="email"
              id="email"
              placeholder="Enter your email"
              
            />
          </div>
          <Button type="submit" className="w-full mt-1">
            Send Email
          </Button>
          <div className="text-center hover:underline hover:text-green-500">
            <a href="#back">Back to login</a>
          </div>
        </form>
      </div>
    </div>
  );
}

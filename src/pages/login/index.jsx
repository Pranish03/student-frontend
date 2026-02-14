import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [formVal, setFormVal] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formVal);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-[430px]">
          <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
            S.M.S
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6">
            Login to your account
          </h2>

          <form className="space-y-4 text-gray-800" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block max-w-fit text-sm text-gray-800 sm:text-base font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm sm:text-base focus:border-green-600 focus:outline-1 focus:outline-green-600"
                value={formVal.email}
                onChange={(e) =>
                  setFormVal((prev) => {
                    return {
                      ...prev,
                      email: e.target.value,
                    };
                  })
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-800 sm:text-base mb-2">
                <label
                  htmlFor="password"
                  className="block max-w-fit font-medium"
                >
                  Password
                </label>
                <Link className="text-gray-800 hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm sm:text-base focus:border-green-600 focus:outline-1 focus:outline-green-600"
                value={formVal.password}
                onChange={(e) =>
                  setFormVal((prev) => {
                    return {
                      ...prev,
                      password: e.target.value,
                    };
                  })
                }
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Login
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

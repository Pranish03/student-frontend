import { Link } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { Button } from "../../components/Button";

export const CheckEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-100">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-200 text-green-600 mb-2">
          <FiMail size={40} />
        </div>
        <h1 className="text-[28px] font-bold text-gray-900 text-center mb-2">
          Check your email
        </h1>
        <p className="text-base text-center text-gray-800 mb-4">
          If an account exists, you'll get an email with the reset password
          link.
        </p>

        <p className="text-base text-center text-gray-800 mb-4">
          Didn't receive the email? Check your spam folder.
        </p>

        <div className="text-center flex flex-col items-center mt-2 gap-4">
          <Link to="/forgot-password" className="w-full">
            <Button className="w-full">Resend email</Button>
          </Link>
          <Link to="/" className="font-medium hover:underline text-green-600">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

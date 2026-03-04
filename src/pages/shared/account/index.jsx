import { useState } from "react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import {
  LuChevronRight,
  LuUser,
  LuMail,
  LuShield,
  LuKey,
  LuLock,
} from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/Button";
import { AnimatePresence } from "framer-motion";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const Account = () => {
  const [showChangeDialog, setShowChangeDialog] = useState(false);

  const { user } = useAuth();

  const lastLogin = "Today at 10:30 AM";

  return (
    <>
      <div className="flex items-center gap-1 mb-4">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/admin"
        >
          admin
        </Link>

        <LuChevronRight />

        <span className="text-zinc-900">students</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Account Information
        </h1>
        <p className="text-zinc-600 text-base">
          View your account details and manage your password
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden sticky top-6">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <Avatar
                  name={user?.name}
                  value={user?._id}
                  size={100}
                  round
                  className="border-4 border-zinc-100 shadow-lg"
                />
              </div>
              <h2 className="text-xl font-semibold text-zinc-800 mb-1">
                {user?.name}
              </h2>
              <p className="text-zinc-500 text-sm mb-4 flex items-center justify-center gap-1">
                <LuShield className="w-4 h-4 text-green-600" />
                Administrator
              </p>

              <div className="pt-4 mt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-500">Member since</span>
                  <span className="text-zinc-800 font-medium">
                    {DateTime.fromISO(user?.createdAt).toLocaleString(
                      DateTime.DATE_MED,
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Last login</span>
                  <span className="text-zinc-800 font-medium">{lastLogin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LuUser className="w-5 h-5 text-green-600" />
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-[10px]">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <LuUser className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">Full Name</p>
                    <p className="text-zinc-800 font-medium">
                      {user?.name || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <LuMail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-500 mb-1">Email Address</p>
                    <p className="text-zinc-800 font-medium break-all">
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <LuKey className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500 mb-1">Account ID</p>
                    <p className="text-zinc-800 font-medium font-mono text-sm">
                      {user?._id || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <LuLock className="w-5 h-5 text-green-600" />
                  Change Password
                </h3>
                <Button onClick={() => setShowChangeDialog(true)}>
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <LuLock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Password
                    </p>
                    <p className="text-xs text-gray-500">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-[10px] p-6 border border-green-200">
            <h4 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <LuShield className="w-5 h-5 text-green-600" />
              Security Tips
            </h4>
            <ul className="space-y-2 pl-6.25 text-sm text-zinc-600 list-disc [&>li::marker]:text-green-600">
              <li className="list-item">
                Use a strong password that you don't use elsewhere
              </li>
              <li className="list-item">
                Change your password regularly to maintain security
              </li>
              <li className="list-item">
                Never share your password with anyone
              </li>
            </ul>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showChangeDialog && (
          <ChangePasswordDialog
            id={user?._id}
            close={() => setShowChangeDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

{
  /* <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                      Password requirements:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-700 rounded-full"></span>
                        At least 8 characters long
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-700 rounded-full"></span>
                        Contains at least one uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-700 rounded-full"></span>
                        Contains at least one number
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-700 rounded-full"></span>
                        Contains at least one special character
                      </li>
                    </ul>
                  </div> */
}

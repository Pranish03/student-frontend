/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
import {
  LuUsers,
  LuGraduationCap,
  LuChartColumnBig,
  LuEllipsisVertical,
} from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";
import { CollapsibleMenu } from "../components/CollapsibleMenu";
import { NavButton } from "../components/NavButton";
import { Button } from "../components/Button";
import { logout } from "../api/auth";

export const AdminLayout = () => {
  const [showMenu, setShowMenu] = useState(false);

  const { user, refetch } = useAuth();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data?.message || "Logged out successfully");

      queryClient.setQueryData(["me"], null);

      navigate("/", { replace: true });
    },
  });

  const handleLogout = () => {
    setShowMenu(false);
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-80 bg-white text-gray-800 p-4 border-r border-black/10">
        <div className="mb-5">
          <h1 className="text-2xl text-gray-900 font-black tracking-wide pl-3.5">
            SMS.
          </h1>
        </div>

        <div className="flex flex-col h-[calc(100vh-100px)] justify-between">
          <div className="space-y-2 text-gray-900">
            <div>
              <NavButton to="/admin">
                <span className="flex items-center gap-3">
                  <LuChartColumnBig size={20} />
                  Dashboard
                </span>
              </NavButton>
            </div>

            <CollapsibleMenu
              icon={LuGraduationCap}
              size={21}
              label="Academics"
              defaultOpen={true}
            >
              <NavButton to="/admin/manage-classes">Classes</NavButton>
              <NavButton to="/admin/manage-courses">Courses</NavButton>
            </CollapsibleMenu>

            <CollapsibleMenu
              icon={LuUsers}
              size={19}
              label="Manage Users"
              defaultOpen={true}
            >
              <NavButton to="/admin/manage-students">Students</NavButton>
              <NavButton to="/admin/manage-teachers">Teachers</NavButton>
              <NavButton to="/admin/manage-admins">Admins</NavButton>
            </CollapsibleMenu>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              className="w-full text-left flex items-center justify-between"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  name={user?.name}
                  value={user?._id}
                  size={38}
                  round={10}
                />
                <div className="flex flex-col gap-0">
                  <span className="text-base text-gray-900 font-semibold max-w-35 overflow-hidden text-ellipsis">
                    {user?.name}
                  </span>
                  <span className="text-sm text-gray-800 max-w-35 overflow-hidden text-ellipsis">
                    {user?.email}
                  </span>
                </div>
              </div>

              <LuEllipsisVertical size={19} />
            </Button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.div
                    className="absolute z-50 flex flex-col bg-white border border-black/20 rounded-[10px] shadow p-1 text-base bottom-0 -right-50"
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex items-center gap-3 pl-1 pr-1.5 pt-0 mb-4">
                      <Avatar
                        name={user?.name}
                        value={user?._id}
                        size={38}
                        round={10}
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-base text-gray-900 font-semibold">
                          {user?.name}
                        </span>
                        <span className="text-sm text-gray-800">
                          {user?.email}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="text-left text-gray-900"
                      onClick={() => setShowMenu(false)}
                    >
                      Account
                    </Button>
                    <Button
                      variant="ghost-danger"
                      className="text-left text-gray-900"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

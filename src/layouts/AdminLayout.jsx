/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
  const buttonRef = useRef(null);

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
      <aside className="fixed top-0 left-0 w-80 h-screen bg-white text-zinc-800 p-4 border-r border-zinc-200 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-2xl text-zinc-900 font-black tracking-wide pl-3.5">
            SMS.
          </h1>
        </div>
        <div className="flex flex-col h-[calc(100vh-90px)] justify-between">
          <div className="space-y-2 text-zinc-900">
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

          <div className="relative" ref={buttonRef}>
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
                  <span className="text-base text-zinc-900 font-semibold max-w-35 text-nowrap overflow-hidden text-ellipsis">
                    {user?.name}
                  </span>
                  <span className="text-sm text-zinc-800 max-w-35 overflow-hidden text-ellipsis">
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
                    className="fixed z-50 flex flex-col bg-white border border-zinc-300 rounded-[10px] shadow p-1 text-base"
                    style={{
                      bottom: "0",
                      left: "300px",
                      marginBottom: "20px",
                      minWidth: "200px",
                    }}
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-zinc-100">
                      <Avatar
                        name={user?.name}
                        value={user?._id}
                        size={38}
                        round={10}
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-base text-zinc-900 font-semibold">
                          {user?.name}
                        </span>
                        <span className="text-sm text-zinc-800">
                          {user?.email}
                        </span>
                      </div>
                    </div>

                    <Link to="/admin/account">
                      <Button
                        variant="ghost"
                        className="text-left text-zinc-900 w-full"
                        onClick={() => setShowMenu(false)}
                      >
                        Account
                      </Button>
                    </Link>

                    <Button
                      variant="ghost-danger"
                      className="text-left"
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

      <main className="flex-1 ml-80 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

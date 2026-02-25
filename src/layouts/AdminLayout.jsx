import { Link, NavLink, Outlet } from "react-router-dom";
import { LuUsers, LuGraduationCap, LuChartColumnBig } from "react-icons/lu";
import { CollapsibleMenu } from "../components/CollapsibleMenu";
import { NavButton } from "../components/NavButton";

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-70 bg-white text-gray-800 p-4 border-r border-gray-200">
        <div className="mb-5">
          <h1 className="text-2xl text-gray-900 font-black tracking-wide pl-3.5">
            SMS.
          </h1>
        </div>

        <div className="space-y-2">
          <div>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "text-green-600" : "text-gray-800"
              }
            >
              <NavButton>
                <span className="flex items-center gap-3">
                  <LuChartColumnBig size={20} />
                  Dashboard
                </span>
              </NavButton>
            </NavLink>
          </div>

          <CollapsibleMenu
            icon={LuGraduationCap}
            size={21}
            label="Academics"
            defaultOpen={false}
          >
            <NavButton>Batch</NavButton>
            <NavButton>Classes</NavButton>
            <NavButton>Courses</NavButton>
          </CollapsibleMenu>

          <CollapsibleMenu
            icon={LuUsers}
            size={19}
            label="Manage Users"
            defaultOpen={false}
          >
            <NavLink
              to="/admin/manage-student"
              end
              className={({ isActive }) =>
                isActive ? "text-green-600" : "text-gray-800"
              }
            >
              <NavButton>Students</NavButton>
            </NavLink>

            <NavLink
              to="/admin/manage-teacher"
              end
              className={({ isActive }) =>
                isActive ? "text-green-600" : "text-gray-800"
              }
            >
              <NavButton>Teachers</NavButton>
            </NavLink>

            <NavLink
              to="/admin/manage-admin"
              end
              className={({ isActive }) =>
                isActive ? "text-green-600" : "text-gray-800"
              }
            >
              <NavButton>Admins</NavButton>
            </NavLink>
          </CollapsibleMenu>
        </div>
      </aside>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

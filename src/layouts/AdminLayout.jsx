import { Link, Outlet } from "react-router-dom";
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
          <Link to="/admin">
            <NavButton>
              <span className="flex items-center gap-3">
                <LuChartColumnBig size={20} />
                Dashboard
              </span>
            </NavButton>
          </Link>

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
            <Link to="/admin/manage-student">
              <NavButton>Students</NavButton>
            </Link>
            <Link to="/admin/manage-teacher">
              <NavButton>Teachers</NavButton>
            </Link>
            <Link to="/admin/manage-admin">
              <NavButton>Admins</NavButton>
            </Link>
          </CollapsibleMenu>
        </div>
      </aside>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

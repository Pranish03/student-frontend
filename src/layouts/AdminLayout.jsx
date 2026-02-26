import { NavLink, Outlet } from "react-router-dom";
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
            defaultOpen={false}
          >
            <NavButton to="/admin/manage-batch">Batch</NavButton>
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
      </aside>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

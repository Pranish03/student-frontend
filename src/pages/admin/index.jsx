import { LuUsers, LuGraduationCap, LuChartColumnBig } from "react-icons/lu";
import { CollapsibleMenu } from "../../components/CollapsibleMenu";
import { NavButton } from "../../components/NavButton";

export const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-70 bg-white text-gray-800 p-4 border-r border-gray-200">
        <div className="mb-5">
          <h1 className="text-2xl text-gray-900 font-black tracking-wide pl-3.5">
            SMS.
          </h1>
        </div>

        <div className="space-y-2">
          <NavButton>
            <span className="flex items-center gap-3">
              <LuChartColumnBig size={20} />
              Dashboard
            </span>
          </NavButton>

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
            <NavButton>Students</NavButton>
            <NavButton>Teachers</NavButton>
            <NavButton>Admins</NavButton>
          </CollapsibleMenu>
        </div>
      </aside>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Admin Dashboard
        </h1>
      </div>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import {
  LuChevronRight,
  LuUsers,
  LuBookOpen,
  LuCalendar,
  LuBuilding,
  LuLoader,
  LuClock,
} from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { fetchClass } from "../../../../api/manageClasses";
import { Button } from "../../../../components/Button";
import { Courses } from "./Courses";
import { Students } from "./Students";
import { useState } from "react";

export const ManageClass = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("courses");

  const { data, isLoading, error } = useQuery({
    queryKey: ["class", id],
    queryFn: () => fetchClass(id),
  });

  const classData = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <LuLoader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-[10px] p-6 text-center">
        <p className="text-red-600">
          Error loading class details. Please try again.
        </p>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-6 text-center">
        <p className="text-yellow-600">Class not found</p>
      </div>
    );
  }

  const tabs = [
    { id: "courses", label: "Courses", icon: LuBookOpen },
    { id: "students", label: "Students", icon: LuUsers },
    { id: "schedule", label: "Schedule", icon: LuClock },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "courses":
        return <Courses classData={classData} />;
      case "students":
        return <Students classData={classData} />;
      case "schedule":
        return (
          <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-900">
                Class Schedule
              </h2>
              <LuClock className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">
                  Monday - Wednesday
                </span>
                <span className="text-sm font-medium text-zinc-900">
                  9:00 AM - 10:30 AM
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                <span className="text-sm text-zinc-600">
                  Tuesday - Thursday
                </span>
                <span className="text-sm font-medium text-zinc-900">
                  2:00 PM - 3:30 PM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600">Friday</span>
                <span className="text-sm font-medium text-zinc-900">
                  Lab Session
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1 mb-6 text-[15px]">
        <Link
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
          to="/admin"
        >
          Admin
        </Link>
        <LuChevronRight className="w-4 h-4 text-zinc-400" />
        <Link
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
          to="/admin/manage-classes"
        >
          Classes
        </Link>
        <LuChevronRight className="w-4 h-4 text-zinc-400" />
        <span className="text-zinc-900 font-medium">{classData.name}</span>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">
              {classData.name}
            </h1>
            <div className="flex items-center gap-4 text-zinc-600">
              <div className="flex items-center gap-1">
                <LuBuilding className="w-4 h-4" />
                <span>{classData.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuCalendar className="w-4 h-4" />
                <span>Academic Year: {classData.academicYear}</span>
              </div>
              <div className="flex items-center gap-1">
                <LuUsers className="w-4 h-4" />
                <span>Capacity: {classData.capacity} students</span>
              </div>
            </div>
          </div>

          <Button variant="secondary">Edit Class</Button>
        </div>
      </div>

      <div className="bg-zinc-100 p-1 mb-6 rounded-[14px] w-min border border-zinc-200">
        <nav className="flex gap-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer
                  ${
                    isActive
                      ? "text-green-600 bg-white border-zinc-200 shadow"
                      : "text-zinc-700 hover:text-zinc-800 hover:bg-zinc-50"
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-green-600" : "text-zinc-400"}`}
                />
                {tab.label}
                {tab.id === "students" && classData.students?.length > 0 && (
                  <span className="ml-1 text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                    {classData.students.length}
                  </span>
                )}
                {tab.id === "courses" && classData.courses?.length > 0 && (
                  <span className="ml-1 text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                    {classData.courses.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-100">{renderTabContent()}</div>
    </div>
  );
};

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
import { FaPenNib } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { fetchClass } from "../../../../api/manageClasses";
import { Button } from "../../../../components/Button";
import { Courses } from "./Courses";
import { Students } from "./Students";
import { useState } from "react";
import { Schedule } from "../schedule";
import { AnimatePresence } from "framer-motion";
import { EditClassDialog } from "../EditClassDialog";
import { Container } from "../../../../components/ui/Container";
import { Heading } from "../../../../components/ui/Heading";
import { Paragraph } from "../../../../components/ui/Paragraph";

export const ManageClass = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("courses");

  const [showEditDialog, setShowEditDialog] = useState(false);

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
        return <Schedule classData={classData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Container>
        <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
          <Link className="hover:text-zinc-900 transition-colors" to="/admin">
            Admin
          </Link>
          <LuChevronRight size={14} />
          <Link
            className="hover:text-zinc-900 transition-colors"
            to="/admin/manage-classes"
          >
            Classes
          </Link>
          <LuChevronRight size={14} />
          <span className="text-zinc-900 font-medium">{classData.name}</span>
        </div>

        <div className="mb-8">
          <Heading className="text-3xl font-bold text-zinc-900 mb-1">
            {classData.name}
          </Heading>
          <Paragraph>
            {classData.name} · {classData.department} · Capacity —{" "}
            {classData.capacity}
          </Paragraph>
        </div>

        <div className="float-end">
          <Button
            onClick={() => setShowEditDialog(true)}
            className="flex items-center gap-2"
          >
            <FaPenNib />
            Edit Class
          </Button>
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
                  flex items-center gap-2 px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer text-sm
                  ${
                    isActive
                      ? "text-green-600 bg-white border-zinc-200 shadow"
                      : "text-zinc-700 hover:text-zinc-800 hover:bg-zinc-50"
                  }
                `}
                >
                  <Icon
                    size={18}
                    className={`${isActive ? "text-green-600" : "text-zinc-400"}`}
                  />
                  {tab.label}
                  {tab.id === "students" && classData.students?.length > 0 && (
                    <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      {classData.students.length}
                    </span>
                  )}
                  {tab.id === "courses" && classData.courses?.length > 0 && (
                    <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      {classData.courses.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-h-100">{renderTabContent()}</div>
      </Container>
      <AnimatePresence>
        {showEditDialog && classData && (
          <EditClassDialog
            classData={classData}
            close={() => setShowEditDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LuChevronRight,
  LuFileText,
  LuClipboardList,
  LuLoader,
} from "react-icons/lu";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { axios } from "../../../../lib/axios";
import { Container } from "../../../../components/ui/Container";
import { Heading } from "../../../../components/ui/Heading";
import { Notes } from "./Notes";
import { Assignments } from "./Assignments";
import { Paragraph } from "../../../../components/ui/Paragraph";

const fetchCourse = async (id) => {
  const { data } = await axios.get(`/courses/${id}`);
  return data;
};

const TABS = [
  { id: "notes", label: "Notes", icon: LuFileText },
  { id: "assignments", label: "Assignments", icon: LuClipboardList },
];

export const CourseResources = () => {
  const { id: courseId } = useParams();
  const [activeTab, setActiveTab] = useState("notes");

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  const course = courseData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LuLoader size={32} className="animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex items-center gap-1 mb-6 text-sm flex-wrap">
        <Link className="text-zinc-500 hover:text-zinc-900" to="/teacher">
          Teacher
        </Link>
        <LuChevronRight size={14} className="text-zinc-400" />
        <Link
          className="text-zinc-500 hover:text-zinc-900"
          to="/teacher/manage-resources"
        >
          Resources
        </Link>
        <LuChevronRight size={14} className="text-zinc-400" />
        <span className="text-zinc-900 font-medium">
          {course?.name ?? courseId}
        </span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">{course?.name}</Heading>
        <Paragraph>Upload notes and assignments</Paragraph>
      </div>

      <div className="bg-zinc-100 p-1 mb-6 rounded-[14px] w-min border border-zinc-200">
        <nav className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer whitespace-nowrap text-sm border-0
                  ${
                    isActive
                      ? "text-green-600 bg-white border border-zinc-200 shadow"
                      : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-green-600" : "text-zinc-400"}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-60">
        {activeTab === "notes" && <Notes courseId={courseId} />}
        {activeTab === "assignments" && <Assignments courseId={courseId} />}
      </div>
    </Container>
  );
};

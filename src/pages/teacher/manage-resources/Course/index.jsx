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

const fetchResources = async (courseId, type) => {
  try {
    const { data } = await axios.get(
      `/resources/course/${courseId}?type=${type}`,
    );
    return data;
  } catch (err) {
    if (err.response?.status === 404) return { resources: [] };
    throw err;
  }
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

  const { data: notesData } = useQuery({
    queryKey: ["notes", courseId],
    queryFn: () => fetchResources(courseId, "note"),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ["assignment", courseId],
    queryFn: () => fetchResources(courseId, "assignment"),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });

  const course = courseData?.data;
  const noteCount = notesData?.resources?.length ?? 0;
  const assignmentCount = assignmentsData?.resources?.length ?? 0;

  const tabCounts = {
    notes: noteCount,
    assignments: assignmentCount,
  };

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
        <div className="flex items-center gap-4">
          <Heading className="mb-1">{course?.name}</Heading>
          {course?.code && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <BsFileEarmarkCodeFill size={11} />
              {course.code}
            </span>
          )}
        </div>
        <Paragraph>Upload notes and assignments</Paragraph>
      </div>

      <div className="bg-zinc-100 p-1 mb-6 rounded-[14px] w-min border border-zinc-200">
        <nav className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] font-medium transition-all cursor-pointer whitespace-nowrap text-sm border-0
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
                {count > 0 && (
                  <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
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

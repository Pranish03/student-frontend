import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LuChevronRight, LuInbox } from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";

import { fetchAllNotices } from "../../../api/notices";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";
import { NoticeCard } from "../../notices/NoticeCard";

export const ManageNotices = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchAllNotices,
  });

  const notices = data?.data ?? [];

  return (
    <Container>
      <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
        <Link className="hover:text-zinc-900 transition-colors" to="/student">
          Student
        </Link>
        <LuChevronRight size={14} />
        <span className="text-zinc-900 font-medium">Notices</span>
      </div>

      <div className="mb-8">
        <Heading className="mb-1">Notices</Heading>
        <Paragraph>
          {isLoading
            ? "Loading..."
            : `${notices.length} notice${notices.length !== 1 ? "s" : ""} for you`}
        </Paragraph>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImSpinner8 size={35} className="animate-spin text-green-600" />
          <p className="mt-3 text-zinc-500">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <LuInbox size={64} className="text-zinc-300" />
          <p className="text-zinc-500 font-semibold text-lg mt-2">
            No notices yet
          </p>
          <p className="text-zinc-400 text-sm">
            Check back later for announcements from your teachers
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {notices.map((notice) => (
            <NoticeCard key={notice._id} notice={notice} />
          ))}
        </div>
      )}
    </Container>
  );
};

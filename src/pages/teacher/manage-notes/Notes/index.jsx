import { Link, useParams } from "react-router-dom";
import { DateTime } from "luxon";
import { LuChevronRight, LuEllipsis, LuPaperclip } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { filterSpecificColumns } from "../../../../utils/tableFilters";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseNotes } from "../../../../api/notes";
import { Table } from "../../../../components/table/Table";
import { Container } from "../../../../components/ui/Container";
import { Heading } from "../../../../components/ui/Heading";
import { Paragraph } from "../../../../components/ui/Paragraph";
import { Button } from "../../../../components/Button";

export const Notes = () => {
  const { id: courseId } = useParams();

  console.log(courseId);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", courseId],
    queryFn: () => fetchCourseNotes(courseId),
  });

  console.log(data);

  const columns = [
    { header: "SN", cell: (info) => info.row.index + 1 },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => (
        <a
          href={info.row.original.file}
          target="_blank"
          className="flex items-center gap-2"
        >
          <LuPaperclip />
          {info.getValue()}
        </a>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (info) => DateTime.fromISO(info.getValue()).toRelative(),
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: (info) => DateTime.fromISO(info.getValue()).toRelative(),
    },
    {
      header: "Action",
      cell: (info) => (
        <button
          //   onClick={(e) => handleActionClick(e, info.row.original)}
          className="p-1.5 hover:bg-zinc-100 rounded-[10px] cursor-pointer relative"
        >
          <LuEllipsis size={18} />
        </button>
      ),
    },
  ];

  return (
    <>
      <Container>
        <div className="flex items-center gap-1 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher"
          >
            Teacher
          </Link>

          <LuChevronRight />

          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher/manage-notes"
          >
            Notes
          </Link>

          <LuChevronRight />

          <span className="text-zinc-900"></span>
        </div>

        <div className="mb-8">
          <Heading className="text-3xl font-bold text-zinc-900 mb-1">
            Notes
          </Heading>
          <Paragraph>Total {data?.data?.length || 0} Notes</Paragraph>
        </div>

        <div className="float-end">
          <Button
            className="flex items-center gap-2"
            // onClick={() => setShowAddDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Note
          </Button>
        </div>

        <Table
          data={data?.resources}
          columns={columns}
          globalFilterFn={filterSpecificColumns("title")}
          isLoading={isLoading}
        />
      </Container>
    </>
  );
};

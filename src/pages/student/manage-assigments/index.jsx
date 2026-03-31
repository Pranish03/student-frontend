/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { LuChevronRight } from "react-icons/lu";

import { Table } from "../../../components/table/Table";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

export const ManageAssignments = () => {
  const data = [
    {
      _id: "1",
      title: "React Assignment",
      file: "/react-assignment.pdf",
      deadline: "2026-03-25",
      createdAt: "2026-03-10T10:00:00Z",
      updatedAt: "2026-03-11T10:00:00Z",
    },
    {
      _id: "2",
      title: "OS Assignment",
      file: "/os-assignment.pdf",
      deadline: "2026-03-30",
      createdAt: "2026-02-10T10:00:00Z",
      updatedAt: "2026-02-11T10:00:00Z",
    },
  ];

  const columns = [
    {
      header: "SN",
      cell: (info) => info.row.index + 1,
    },
    {
      header: "Title",
      accessorKey: "title",
      cell: (info) => (
        <a
          href={info.row.original.file}
          target="_blank"
          className="text-blue-600 underline"
        >
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
      header: "Deadline",
      accessorKey: "deadline",
      cell: (info) => DateTime.fromISO(info.getValue()).toFormat("dd LLL yyyy"),
    },
  ];

  return (
    <>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/student"
          >
            Student
          </Link>
          <LuChevronRight />
          <span className="text-zinc-900">Assignments</span>
        </div>

        <div className="mb-8">
          <Heading className="mb-1">Assignments</Heading>
          <Paragraph>{data.length} total assignments</Paragraph>
        </div>

        <Table data={data} columns={columns} isLoading={false} />
      </Container>
    </>
  );
};

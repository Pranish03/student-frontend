import React, { useState, useMemo } from "react";
import { Table } from "../../../components/table/Table";
import { Button } from "../../../components/Button";
import mData from "./mockData.json";
import { IoAddCircle } from "react-icons/io5";


export const ManageAttendance = () => {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [sheetData, setSheetData] = useState([]);
  const [attendance, setAttendance] = useState({});

  const data = useMemo(() => mData || [], []);

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      header: "SN",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const isPresent = attendance[row.original.id] || false;

        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={() => toggleAttendance(row.original.id)}
            />
            <span>{isPresent ? "Present" : "Absent"}</span>
          </div>
        );
      },
    },
    {
      header: "Date",
      cell: () => date,
    },
  ];

  const handleGenerate = () => {
    if (!data.length) {
      alert("No students found");
      return;
    }

    setSheetData(data);

    const initial = {};
    data.forEach((student) => {
      initial[student.id] = false;
    });

    setAttendance(initial);
  };

  const handleSubmit = () => {
    console.log("Attendance:", attendance);
    alert("Attendance Submitted");
  };

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <Button className="flex items-center gap-2" onClick={handleGenerate}>
          <IoAddCircle size={22} />
          Generate Sheet
        </Button>
      </div>

      {sheetData.length > 0 && (
        <>
          <Table data={sheetData} columns={columns} />

          <Button
            className="mt-6 bg-green-600 text-white"
            onClick={handleSubmit}
          >
            Submit Attendance
          </Button>
        </>
      )}
    </div>
  );
};

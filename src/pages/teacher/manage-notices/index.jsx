/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import { IoAddCircle } from "react-icons/io5";
import { Button } from "../../../components/Button";
import { AddNoticeDialog } from "./AddNoticeDialog";
import { EditNoticeDialog } from "./EditNoticeDialog";
import { DeleteNoticeDialog } from "./DeleteNoticeDialog";
import { Container } from "../../../components/ui/Container";
import { Heading } from "../../../components/ui/Heading";
import { Paragraph } from "../../../components/ui/Paragraph";

export const ManageNotices = () => {
  const [selected, setSelected] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [current, setCurrent] = useState(null);

  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Class Meeting 07:30 PM",
      desc: "Join for discussion on project progress",
      file: "",
      type: "green",
    },
    {
      id: 2,
      title: "Fee Payment Issue",
      desc: "Resolve wallet error before deadline",
      file: "/image.png",
      type: "red",
    },
  ]);

  const handleActionClick = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSelected(item);
  };

  const closeDropdown = () => setSelected(null);

  const handleEdit = () => {
    setCurrent(selected);
    closeDropdown();
    setShowEdit(true);
  };

  const handleDelete = () => {
    setCurrent(selected);
    closeDropdown();
    setShowDelete(true);
  };

  return (
    <>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <Link
            className="text-zinc-500 hover:underline hover:text-zinc-900"
            to="/teacher"
          >
            Teacher
          </Link>
          <LuChevronRight />
          <span className="text-zinc-900">Notices</span>
        </div>

        <div className="flex justify-between items-start mb-3">
          <div>
            <Heading className="mb-1">Notices</Heading>
            <Paragraph>{notices.length} total notices</Paragraph>
          </div>

          <Button
            className="flex items-center gap-1 mt-1"
            onClick={() => setShowAdd(true)}
          >
            <IoAddCircle size={22} />
            Add New Notices
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {notices.map((n) => (
            <div
              key={n.id}
              className="flex justify-between items-start p-4 rounded-xl border border-zinc-300 bg-red hover:bg-zinc-50 transition"
            >
              <div className="flex flex-col gap-1">
                {n.file ? (
                  <a
                    href={n.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {n.title}
                  </a>
                ) : (
                  <h4 className="font-medium">{n.title}</h4>
                )}

                <p className="text-sm text-zinc-500">{n.desc}</p>
              </div>

              <button
                onClick={(e) => handleActionClick(e, n)}
                className="p-2 hover:bg-zinc-100 rounded-lg bg"
              >
                <LuEllipsis />
              </button>
            </div>
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="fixed inset-0 z-40" onClick={closeDropdown} />
            <motion.div
              className="fixed z-50 bg-white border rounded-lg shadow p-2 flex flex-col"
              style={{
                top: dropdownPos.top,
                left: dropdownPos.left,
              }}
            >
              <Button variant="ghost" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="ghost-danger" onClick={handleDelete}>
                Delete
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdd && (
          <AddNoticeDialog
            close={() => setShowAdd(false)}
            add={(data) =>
              setNotices((prev) => [
                ...prev,
                { id: Date.now(), ...data },
              ])
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEdit && current && (
          <EditNoticeDialog
            notice={current}
            close={() => setShowEdit(false)}
            update={(updated) =>
              setNotices((prev) =>
                prev.map((n) =>
                  n.id === updated.id ? updated : n
                )
              )
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDelete && current && (
          <DeleteNoticeDialog
            close={() => setShowDelete(false)}
            remove={() =>
              setNotices((prev) =>
                prev.filter((n) => n.id !== current.id)
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};
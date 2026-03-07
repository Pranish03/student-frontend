import { useState } from "react";
import { LuClock, LuPlus } from "react-icons/lu";
import { IoDuplicate } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/Button";
import { ScheduleGrid } from "./ScheduleGrid";
import { AddScheduleDialog } from "./AddScheduleDialog";
import { AddEntryDialog } from "./AddEntryDialog";
import { EditEntryDialog } from "./EditEntryDialog";
import { DeleteEntryDialog } from "./DeleteEntryDialog";
import { DeleteScheduleDialog } from "./DeleteScheduleDialog";

export const Schedule = ({ classData }) => {
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [showAddEntryDialog, setShowAddEntryDialog] = useState(false);
  const [showEditEntryDialog, setShowEditEntryDialog] = useState(false);
  const [showDeleteEntryDialog, setShowDeleteEntryDialog] = useState(false);
  const [showDeleteScheduleDialog, setShowDeleteScheduleDialog] =
    useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setShowEditEntryDialog(true);
  };

  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setShowDeleteEntryDialog(true);
  };

  return (
    <>
      <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-zinc-900">Schedule</h2>

          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowAddEntryDialog(true)}
            >
              <LuPlus />
              Add Entry
            </Button>

            <Button
              variant="danger"
              className="flex items-center gap-2"
              //   onClick={() => setShowDeleteScheduleDialog(true)}
            >
              <IoDuplicate />
              Delete Schedule
            </Button>
          </div>
        </div>

        <ScheduleGrid
          classData={classData}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
          onAddSchedule={() => setShowAddScheduleDialog(true)}
        />
      </div>

      <AnimatePresence>
        {showAddScheduleDialog && (
          <AddScheduleDialog
            classData={classData}
            close={() => setShowAddScheduleDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddEntryDialog && (
          <AddEntryDialog
            classData={classData}
            close={() => setShowAddEntryDialog(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditEntryDialog && selectedEntry && (
          <EditEntryDialog
            classData={classData}
            entry={selectedEntry}
            close={() => {
              setShowEditEntryDialog(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteEntryDialog && selectedEntry && (
          <DeleteEntryDialog
            classData={classData}
            entry={selectedEntry}
            close={() => {
              setShowDeleteEntryDialog(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteScheduleDialog && (
          <DeleteScheduleDialog
            classData={classData}
            close={() => setShowDeleteScheduleDialog(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

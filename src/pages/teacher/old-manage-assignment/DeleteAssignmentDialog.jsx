import React from 'react'
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";


export const DeleteAssignmentDialog = ({ note, close }) => {

  const handleDelete = () => {

    console.log("Delete assignment:", note);
    close();
  };
  return (
    <Dialog
      heading="Delete Assignment"
      desc="Are you sure you want to delete this assignment?"
      close={close}
    >

      <div className="flex items-center gap-5 justify-end">

        <Button
          variant="secondary"
          onClick={close}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
        >
          Delete Assignment
        </Button>

      </div>

    </Dialog>
  );
};
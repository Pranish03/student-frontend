import React from 'react'
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";


export const DeleteNoteDialog = ({ note, close }) => {

  const handleDelete = () => {

    console.log("Delete note:", note);
    close();
  };
  return (
    <Dialog
      heading="Delete Note"
      desc="Are you sure you want to delete this note?"
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
          Delete Note
        </Button>

      </div>

    </Dialog>
  );
};
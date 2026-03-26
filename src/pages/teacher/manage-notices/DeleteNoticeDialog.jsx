import React from 'react'
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";


export const DeleteNoticeDialog = ({ notice, close }) => {

  const handleDelete = () => {

    console.log("Delete notice:", notice);
    close();
  };
  return (
    <Dialog
      heading="Delete Notice"
      desc="Are you sure you want to delete this notice?"
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
          Delete Notice
        </Button>

      </div>

    </Dialog>
  );
};
import { useForm } from "react-hook-form";
import { Dialog } from "../../../components/Dialog";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export const AddNoteDialog = ({ close }) => {

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      file: ""
    }
  });

  const onSubmit = (data) => {

    // API call will go here

    /*
    mutation.mutate(data)
    */

    console.log(data)

    reset();
    close();
  };

  return (
    <Dialog
      heading="Add Note"
      desc="Upload a new note."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mb-5">
          <label className="block mb-2">Title</label>

          <Input
            className="w-full"
            placeholder="React Basics"
            {...register("title")}
          />
        </div>

        <div className="mb-7">
          <label className="block mb-2">PDF File URL</label>

          <Input
            className="w-full"
            placeholder="/notes/react.pdf"
            {...register("file")}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              reset();
              close();
            }}
          >
            Cancel
          </Button>

          <Button type="submit">
            Add Note
          </Button>
        </div>

      </form>
    </Dialog>
  );
};
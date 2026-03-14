import { useForm } from "react-hook-form";
import { Dialog } from "../../../components/Dialog";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export const AddAssignmentDialog = ({ close }) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: "",
      file: null,
      deadline: "",
    },
  });

  const title = watch("title");
  const file = watch("file");

  const onSubmit = (data) => {
    console.log(data);
    reset();
    close();
  };

  return (
    <Dialog
      heading="Add Assignment"
      desc="Upload a new assignment."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="block mb-2">Title</label>
          <Input
            className="w-full"
            placeholder="Assignment title"
            {...register("title", { required: true })}
          />
        </div>

        <div className="mb-7">
          <label className="block mb-2">PDF File</label>
          <Input
            type="file"
            className="w-full"
            {...register("file", { required: true })}
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2">Deadline</label>
          <Input type="date" className="w-full" {...register("deadline")} />
        </div>

        {title && file && file.length > 0 && (
          <div className="mb-5 p-3 border rounded bg-zinc-50">
            <a
              href={URL.createObjectURL(file[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {title}
            </a>
          </div>
        )}

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

          <Button type="submit">Add Assignment</Button>
        </div>
      </form>
    </Dialog>
  );
};

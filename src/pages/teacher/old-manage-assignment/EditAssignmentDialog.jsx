import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export const EditAssignmentDialog = ({ assignment, close }) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: "",
      file: null,
      deadline: ""

    },
  });

  const title = watch("title");
  const file = watch("file");


  useEffect(() => {
    if (assignment) {
      reset({
        title: assignment?.title || "",
        file: null,
        
      });
    }
  }, [assignment, reset]);

  const onSubmit = (data) => {
    console.log("Updated assignment:", data);
    close();
  };

  const previewUrl =
    file && file.length > 0
      ? URL.createObjectURL(file[0])
      : assignment?.file || null;

  return (
    <Dialog
      heading="Edit Assignment"
      desc="Update the assignment information."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label className="block mb-2">Title</label>
          <Input className="w-full" {...register("title")} />
        </div>

        <div className="mb-7">
          <label className="block mb-2">PDF File</label>
          <Input
            type="file"
            className="w-full"
            {...register("file")}
          />
        </div>
        <div className="mb-4">
        <label className="block mb-2">Deadline</label>
  <Input
    type="date"
    className="w-full"
    {...register("deadline")}
  />
</div>

        {title && previewUrl && (
          <div className="mb-5 p-3 border rounded bg-zinc-50">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {title}
            </a>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="secondary" type="button" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Update Assignment</Button>
        </div>
      </form>
    </Dialog>
  );
};
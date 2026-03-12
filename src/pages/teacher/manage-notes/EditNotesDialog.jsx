import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export const EditNotesDialog = ({ note, close }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      file: null,
    },
  });

  const title = watch("title");
  const file = watch("file");

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      reset({
        title: note?.title || "",
        file: null, // Keep file as null initially
      });
      // Store the existing file URL in a separate ref for preview
      setValue("existingFileUrl", note?.file || "");
    }
  }, [note, reset, setValue]);

  const onSubmit = (data) => {
    console.log("Updated note:", data);
    close();
  };

 
  const previewUrl =
    file && file.length > 0
      ? URL.createObjectURL(file[0]) 
      : note?.file || null; 

  return (
    <Dialog
      heading="Edit Note"
      desc="Update the note information."
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
          <Button type="submit">Update Note</Button>
        </div>
      </form>
    </Dialog>
  );
};
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editResourceSchema } from "../../../../schemas/noteSchema";
import { toast } from "sonner";
import { Dialog } from "../../../../components/Dialog";
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editResource } from "../../../../api/resources";
import { FileInput } from "../../../../components/form/FileInput";
import { useEffect } from "react";

export const EditNoteDialog = ({ close, note, courseId }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course: "",
      type: "",
      title: "",
      description: "",
      file: null,
    },
    resolver: zodResolver(editResourceSchema),
  });

  useEffect(() => {
    if (note) {
      reset({
        course: courseId,
        type: "note",
        title: note?.title || "",
        description: note?.description || "",
        file: note?.file,
      });
    }
  }, [note, courseId, reset]);

  const mutation = useMutation({
    mutationFn: editResource,
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({ queryKey: ["notes", courseId] });

      close();
      reset();
    },
  });

  const onSubmit = (data) => {
    if (data?.file && !Array.isArray(data.file)) {
      data.file = [data.file];
    }
    mutation.mutate({ id: note?._id, data });
  };

  return (
    <Dialog
      heading="Edit Note"
      desc="Enter new information below to update the note."
      close={close}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {mutation?.isError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-base">
              {mutation?.error?.response?.data?.message ||
                "Something went wrong"}
            </p>
          </div>
        )}

        <div className="mb-5">
          <label
            htmlFor="title"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.title ? "text-red-600" : "text-zinc-900"}`}
          >
            Title
            <span className="text-red-600">*</span>
          </label>

          <Input
            className="w-full"
            type="text"
            id="title"
            placeholder="OS Unit 1"
            disabled={mutation?.isPending}
            {...register("title")}
            errors={errors?.title}
          />

          {errors?.title && (
            <p className="text-red-600 mt-2">{errors?.title?.message}</p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="file"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.file ? "text-red-600" : "text-zinc-900"}`}
          >
            File
            <span className="text-red-600">*</span>
          </label>

          <FileInput
            onChange={(files) => {
              setValue("file", files || [], { shouldValidate: true });
            }}
            error={errors?.file}
            disabled={mutation?.isPending}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="description"
            className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.description ? "text-red-600" : "text-zinc-900"}`}
          >
            Description
          </label>

          <textarea
            className={`w-full border rounded-[10px] text-base py-1.5 px-2.5 focus:outline-3 placeholder:text-zinc-500 text-zinc-900
            ${
              errors.description
                ? "border-red-600 focus:border-red-600 focus:outline-red-200"
                : "border-zinc-300 focus:border-green-600 focus:outline-green-300"
            }`}
            id="description"
            rows={4}
            placeholder="Write your note description..."
            disabled={mutation?.isPending}
            {...register("description")}
            errors={errors?.description}
          ></textarea>
        </div>

        <div className="flex items-center gap-4 justify-end">
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
          <Button
            className="flex items-center justify-center gap-3"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Updating...</span>
              </>
            ) : (
              "Update Note"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

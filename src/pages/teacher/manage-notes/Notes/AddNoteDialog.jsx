import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResourceSchema } from "../../../../schemas/noteSchema";
import { toast } from "sonner";
import { Dialog } from "../../../../components/Dialog";
import { Input } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import { ImSpinner8 } from "react-icons/im";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../../../api/notes";
import { FileInput } from "../../../../components/form/FileInput";

export const AddNoteDialog = ({ close, courseId }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      course: courseId,
      type: "note",
      title: "",
      description: "",
      file: null,
    },
    resolver: zodResolver(createResourceSchema),
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({ queryKey: ["notes", courseId] });

      close();
      reset();
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    if (data.file && !Array.isArray(data.file)) {
      data.file = [data.file];
    }
    mutation.mutate(data);
  };

  return (
    <Dialog
      heading="Add Note"
      desc="Enter note information below to create a new note."
      close={close}
    >
      <form
        onSubmit={handleSubmit(onSubmit, (errors) =>
          console.log("Validation errors:", errors),
        )}
      >
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
            placeholder="John Doe"
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
                <span>Adding...</span>
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

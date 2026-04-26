import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../components/Dialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Label } from "../../components/form/Label";
import { Select } from "../../components/form/Select";
import { createNoticeSchema } from "../../schemas/noticeSchema";
import { createNotice } from "../../api/notices";

export const AddNoticeDialog = ({ close }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      targetRole: "all",
      file: null,
    },
    resolver: zodResolver(createNoticeSchema),
  });

  const mutation = useMutation({
    mutationFn: createNotice,
    onSuccess: (data) => {
      toast.success(data?.message || "Notice created successfully");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      close();
      reset();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("targetRole", data.targetRole);
    if (data.description) formData.append("description", data.description);
    if (data.file?.[0]) formData.append("file", data.file[0]);
    mutation.mutate(formData);
  };

  return (
    <Dialog
      heading="Add Notice"
      desc="Create a new notice to broadcast to your audience."
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

        {/* Title */}
        <div className="mb-5">
          <Label htmlFor="title" errors={errors?.title} required>
            Title
          </Label>
          <Input
            className="w-full"
            id="title"
            placeholder="e.g. Class rescheduled to Friday"
            disabled={mutation?.isPending}
            errors={errors?.title}
            {...register("title")}
          />
          {errors?.title && (
            <p className="text-red-600 mt-2 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Target Audience */}
        <div className="mb-5">
          <Label htmlFor="targetRole">Audience</Label>
          <Select id="targetRole" {...register("targetRole")}>
            <option value="all">Everyone</option>
            <option value="student">Students only</option>
            <option value="teacher">Teachers only</option>
          </Select>
        </div>

        {/* Description */}
        <div className="mb-5">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            placeholder="Add more details about the notice..."
            disabled={mutation?.isPending}
            className={`w-full border rounded-[10px] text-base py-1.5 px-2.5 focus:outline-3 
              placeholder:text-zinc-500 text-zinc-900 resize-none
              ${
                errors?.description
                  ? "border-red-600 focus:border-red-600 focus:outline-red-200"
                  : "border-zinc-300 focus:border-green-600 focus:outline-green-300"
              }`}
            {...register("description")}
          />
        </div>

        {/* File */}
        <div className="mb-7">
          <Label htmlFor="file">Attachment (PDF / DOCX / PPTX)</Label>
          <input
            id="file"
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            disabled={mutation?.isPending}
            className="block w-full text-sm text-zinc-600
              file:mr-4 file:py-1.5 file:px-3 file:rounded-[10px] file:border-0
              file:text-sm file:font-medium file:bg-zinc-100 file:text-zinc-700
              hover:file:bg-zinc-200 cursor-pointer"
            {...register("file")}
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
            disabled={mutation?.isPending}
          >
            Cancel
          </Button>
          <Button
            className="flex items-center justify-center gap-3 min-w-35"
            type="submit"
            disabled={mutation?.isPending}
          >
            {mutation?.isPending ? (
              <>
                <ImSpinner8 className="animate-spin text-lg" />
                <span>Publishing...</span>
              </>
            ) : (
              "Publish Notice"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

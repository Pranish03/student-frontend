import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import { Dialog } from "../../components/Dialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Label } from "../../components/form/Label";
import { Select } from "../../components/form/Select";
import { updateNoticeSchema } from "../../schemas/noticeSchema";
import { editNotice } from "../../api/notices";

export const EditNoticeDialog = ({ notice, close }) => {
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
    resolver: zodResolver(updateNoticeSchema),
  });

  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title || "",
        description: notice.description || "",
        targetRole: notice.targetRole || "all",
        file: null,
      });
    }
  }, [notice, reset]);

  const mutation = useMutation({
    mutationFn: editNotice,
    onSuccess: (data) => {
      toast.success(data?.message || "Notice updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      close();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    if (data.title) formData.append("title", data.title);
    if (data.targetRole) formData.append("targetRole", data.targetRole);
    if (data.description !== undefined)
      formData.append("description", data.description);
    if (data.file?.[0]) formData.append("file", data.file[0]);
    mutation.mutate({ id: notice._id, formData });
  };

  return (
    <Dialog
      heading="Edit Notice"
      desc="Update the notice information."
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

        <div className="mb-5">
          <Label htmlFor="targetRole">Audience</Label>
          <Select id="targetRole" {...register("targetRole")}>
            <option value="all">Everyone</option>
            <option value="student">Students only</option>
            <option value="teacher">Teachers only</option>
          </Select>
        </div>

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

        <div className="mb-7">
          <Label htmlFor="file">Replace Attachment</Label>
          {notice?.file && (
            <p className="text-sm text-zinc-500 mb-2">
              Current:{" "}
              <a
                href={notice.file}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 underline"
              >
                View existing file
              </a>
            </p>
          )}
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
                <span>Updating...</span>
              </>
            ) : (
              "Update Notice"
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

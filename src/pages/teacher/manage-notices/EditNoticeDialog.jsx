import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export const EditNoticeDialog = ({ notice, close, update }) => {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: notice?.title || "",
      desc: notice?.desc || "",
    },
  });

  const title = watch("title");
  const desc = watch("desc");
  const file = watch("file");

  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title,
        desc: notice.desc,
      });
    }
  }, [notice, reset]);

  const onSubmit = (data) => {
    if (
      !data.desc &&
      !notice.file &&
      (!data.file || data.file.length === 0)
    ) {
      alert("Add description or file");
      return;
    }

    update({
      ...notice,
      title: data.title,
      desc: data.desc,
      file: data.file?.length > 0 ? data.file[0] : notice.file,
    });

    reset();
    close();
  };

  return (
    <Dialog heading="Edit Notice" desc="Update your notice." close={close}>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="mb-5">
          <label className="block mb-2">Title</label>
          <Input
            className="w-full"
            placeholder="Notice title"
            {...register("title", { required: true })}
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Write notice..."
            {...register("desc")}
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2">Replace File (optional)</label>
          <Input type="file" {...register("file")} />
        </div>

        <div className="mb-5 p-3 border rounded bg-zinc-50">
          <p className="font-medium">{title}</p>

          {desc && (
            <p className="text-sm text-zinc-600">{desc}</p>
          )}

          {file && file.length > 0 && (
            <a
              href={URL.createObjectURL(file[0])}
              target="_blank"
              className="text-blue-600 underline text-sm block mt-1"
            >
              View New File
            </a>
          )}

          {!file?.length && notice.file && (
            <a
              href={URL.createObjectURL(notice.file)}
              target="_blank"
              className="text-blue-600 underline text-sm block mt-1"
            >
              View Existing File
            </a>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              close();
            }}
          >
            Cancel
          </Button>

          <Button type="submit">Update Notice</Button>
        </div>
      </form>
    </Dialog>
  );
};
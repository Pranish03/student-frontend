import { useForm } from "react-hook-form";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";

export const AddNoticeDialog = ({ close, add }) => {
  const { register, handleSubmit, watch, reset } = useForm();

  const title = watch("title");
  const desc = watch("desc");
  const file = watch("file");

  const onSubmit = (data) => {
   
    if (!data.desc && (!data.file || data.file.length === 0)) {
      alert("Add description or file");
      return;
    }

    add({
      title: data.title,
      desc: data.desc,
      file: data.file?.[0] || null,
      type: "green",
    });

    reset();
    close();
  };

  return (
    <Dialog heading="Add Notice" desc="Add text or upload file." close={close}>
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
          <label className="block mb-2">Description (optional)</label>
          <textarea
            className="w-full border rounded-lg p-2"
            placeholder="Write notice..."
            {...register("desc")}
          />
        </div>

      
        <div className="mb-5">
          <label className="block mb-2">PDF/File (optional)</label>
          <Input type="file" {...register("file")} />
        </div>

        {/* Preview */}
        {(desc || (file && file.length > 0)) && (
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
                View File
              </a>
            )}
          </div>
        )}

        {/* Buttons */}
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

          <Button type="submit">Add Notice</Button>
        </div>
      </form>
    </Dialog>
  );
};
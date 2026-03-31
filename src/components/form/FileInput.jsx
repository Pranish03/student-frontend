import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export const FileInput = ({ onChange, error, disabled }) => {
  return (
    <div>
      <FilePond
        onupdatefiles={(fileItems) => {
          const files = fileItems.map((f) => f.file);
          onChange(files.length > 0 ? files : null);
        }}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={[
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]}
        maxFileSize="10MB"
        disabled={disabled}
        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
      />
      {error && <p className="text-red-600 mt-2">{error.message}</p>}
    </div>
  );
};

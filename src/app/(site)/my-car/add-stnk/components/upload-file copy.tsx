import { useCallback, useEffect, useState } from "react";
import { useDropzone, FileRejection, FileWithPath } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";

interface DropzoneProps {
  onFileSelected: (files: FileWithPath) => void;
  onFileRejected?: (fileRejections: FileRejection[]) => void;
  onFileDeleted: () => void;
}

function Upload({
  onFileSelected,
  onFileRejected,
  onFileDeleted,
}: DropzoneProps) {
  const [file, setFile] = useState<FileWithPath>();
  const handleAddFile = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const imageFiles = acceptedFiles.filter((file) =>
          file.type.startsWith("image/")
        );
        if (imageFiles.length > 0) {
          setFile(imageFiles[0]);
          onFileDeleted();
        } else {
          if (onFileRejected) {
            onFileRejected(fileRejections);
          }
        }
      } else if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        onFileDeleted();
      }
    },
    [onFileRejected, onFileDeleted]
  );

  useEffect(() => {
    if (file) {
      onFileSelected(file);
    }
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleAddFile,
    maxFiles: 1,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`dropzone w-full h-[48.2px] lg:h-[54.2px] rounded-[12px] text-[24px] sm:text-[28px] flex justify-center items-center cursor-pointer bg-yellow-secondary text-black`}
      >
        <input {...getInputProps()} />
        <MdOutlineFileUpload />
      </div>
    </>
  );
}
export default Upload;

import { useQuery } from "convex/react";
import { useState, DragEvent, useRef } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { api } from "../convex/_generated/api";

const BACKEND_IP = "http://127.0.0.1:5000";

export default function HomePage() {
  const tasks = useQuery(api.tasks.get);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold image preview URL
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  const { mutate, isLoading } = useMutation(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return fetch(`${BACKEND_IP}/upload`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
    },
    {
      onMutate: () => {
        toast.loading("Uploading file...", {
          id: "uploading",
        });
      },
      onError: () => {
        toast.error("Error uploading file", {
          id: "uploading",
        });
      },
      onSuccess: (res) => {
        toast.success(res.message, {
          id: "uploading",
        });
      },
    }
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file); // Set the selected file
        setImagePreview(URL.createObjectURL(file)); // Create a URL for the file
      } else {
        toast.error("Please upload an image file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file)); // Create a URL for the file
      } else {
        toast.error("Please upload an image file.");
      }
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      mutate(selectedFile); // Upload the file when the button is clicked
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed p-4 rounded-lg mt-20 w-[800px] h-[400px] mx-auto text-center cursor-pointer ${
          dragOver ? "border-black" : "border-gray-300"
        } ${selectedFile ? "border-green-800" : "bg-white"}`}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="max-h-full mx-auto" />
        ) : (
          <p className="text-lg">
            {selectedFile ? "File selected: " + selectedFile.name : "Drag and drop an image here, or click to select an image."}
          </p>
        )}
      </div>
      <button
        onClick={handleUploadClick}
        className="w-40 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!selectedFile || isLoading} // Disable the button if no file is selected or if a file is currently being uploaded
      >
        {isLoading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

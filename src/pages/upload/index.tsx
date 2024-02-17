import { useState, DragEvent, useRef } from "react";
import toast from "react-hot-toast";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function UploadPage() {
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setselectedImage] = useState<File | null>(null); // State to hold the selected file
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to hold image preview URL
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  //   const { mutate, isLoading } = useMutation(
  //     (file: File) => {
  //         console.log(file);
  //     },
  //     {
  //       onMutate: () => {
  //         toast.loading("Uploading file...", {
  //           id: "uploading",
  //         });
  //       },
  //       onError: () => {
  //         toast.error("Error uploading file", {
  //           id: "uploading",
  //         });
  //       },
  //       onSuccess: (res) => {
  //         toast.success(res.message, {
  //           id: "uploading",
  //         });
  //       },
  //     }
  //   );

  const generateUploadUrl = useMutation(api.noteImages.generateUploadUrl);

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
      if (file.type.startsWith("image/")) {
        setselectedImage(file); // Set the selected file
        setImagePreview(URL.createObjectURL(file)); // Create a URL for the file
      } else {
        toast.error("Please upload an image file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setselectedImage(file);
        setImagePreview(URL.createObjectURL(file)); // Create a URL for the file
      } else {
        toast.error("Please upload an image file.");
      }
    }
  };

  const handleUploadClick = async () => {
    if (selectedImage) {
      toast.success("Uploading file...");
      //   mutate(selectedImage); // Upload the file when the button is clicked
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedImage!.type },
        body: selectedImage,
      });
      const json = await result.json();
      if (!result.ok) {
        toast.error(`Upload failed: ${JSON.stringify(json)}`);
        // throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }
      const { storageId } = json;
      toast.success(`Upload successful: ${storageId}`); 
      console.log(storageId);
    //   await sendImage({ storageId, author: name });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed p-4 rounded-lg mt-20 w-[800px]  mx-auto text-center cursor-pointer ${
          dragOver ? "border-black" : "border-gray-300"
        } ${selectedImage ? "border-green-800" : "bg-white"}`}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-full mx-auto"
          />
        ) : (
          <p className="text-lg">
            {selectedImage
              ? "File selected: " + selectedImage.name
              : "Drag and drop an image here, or click to select an image."}
          </p>
        )}
      </div>
      <button
        onClick={handleUploadClick}
        className="w-40 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        // disabled={!selectedImage || isLoading} // Disable the button if no file is selected or if a file is currently being uploaded
      >
        Upload
      </button>
    </div>
  );
}

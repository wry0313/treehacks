import { useState, DragEvent, useRef } from "react";
import toast from "react-hot-toast";

import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UploadNotesImagePage({ noteId }: { noteId: string }) {
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

  const mutateInsertNoteImage = useMutation(api.noteImages.insertNoteImage);
  const getImageUrl = useAction(api.noteImages.getImageUrlFromStorageId);

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
      // toast.success(`Upload successful: ${storageId}`);
      mutateInsertNoteImage({ noteId: noteId, imageStorageId: storageId });
      const imageUrl = await getImageUrl({ storageId });
      console.log(imageUrl);
      const res = await fetch(`http://127.0.0.1:5000/image_to_latex`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl, noteId: noteId }),
      });
      const resjson = await res.json();
      console.log(resjson);
      setselectedImage(null);
      setImagePreview(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center pt-10">
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
        className={`border-4 border-dashed flex px-4 rounded-lg items-center justify-center h-[250px] w-1/3 text-center cursor-pointer ${
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
        className="w-1/3 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded"
      >
        Upload
      </button>
    </div>
  );
}

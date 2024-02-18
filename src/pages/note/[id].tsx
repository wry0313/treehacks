import { useQuery } from "convex/react";
import { useParams } from "../../router";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import UploadNotesImagePage from "../../components/UploadNotesImage";
export default function NotePage() {
  const { id } = useParams("/note/:id" as never);
  const notes = useQuery(api.notes.getNoteById, { noteId: id });
  const images = useQuery(api.noteImages.getNoteImagesByNoteId, { noteId: id });
  console.log(images);
  const [mode, setMode] = useState<"Upload" | "Feedback" | "Chatbot">("Upload");
  return (
    <div className="flex flex-row h-full w-full grow">
      <div className="flex w-[15%] bg-blue-500 h-[100vh]">
        <a
          href="/"
          className="hover:underline text-white font-semibold fixed top-1 left-2"
        >
          <a
            href="/"
            className="text-white font-semibold fixed top-1 left-2 mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
        </a>
        <div className="flex flex-col items-center  w-full text-white text-2xl mt-20 gap-y-10">
          <button
            className={mode === "Upload" ? "font-bold" : ""}
            onClick={() => setMode("Upload")}
          >
            Upload
          </button>
          <button
            className={mode === "Feedback" ? "font-bold" : ""}
            onClick={() => setMode("Feedback")}
          >
            Feedback
          </button>
          <button
            className={mode === "Chatbot" ? "font-bold" : ""}
            onClick={() => setMode("Chatbot")}
          >
            Chatbot
          </button>
        </div>
      </div>

      {notes && (
        <div className="flex flex-col pl-10">
          <p className="text-2xl font-semibold p-2 h-[50px] bg-gray-200">
            {" "}
            {notes?.title}{" "}
          </p>
          <div>
            {mode === "Upload" && (
              <div className="flex flex-col">
                <UploadNotesImagePage noteId={notes._id} />
                <div className="p-4 w-[600px]">
                  <p className="font-semibold pb-2">
                    Images uploaded for the notes:
                  </p>
                  <div className="flex flex-row gap-x-2">
                    {images &&
                      images.map((image, index) => (
                        <img
                          key={index}
                          src={image as string}
                          alt="Note Image"
                          height={300}
                          width={100}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "Upload" && (
              <div className="flex flex-col">
                <UploadNotesImagePage noteId={notes._id} />
                <div className="p-4 w-[600px]">
                  <p className="font-semibold pb-2">
                    Images uploaded for the notes:
                  </p>
                  <div className="flex flex-row gap-x-2">
                    {images &&
                      images.map((image, index) => (
                        <img
                          key={index}
                          src={image as string}
                          alt="Note Image"
                          height={300}
                          width={100}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "Upload" && (
              <div className="flex flex-col">
                <UploadNotesImagePage noteId={notes._id} />
                <div className="p-4 w-[600px]">
                  <p className="font-semibold pb-2">
                    Images uploaded for the notes:
                  </p>
                  <div className="flex flex-row gap-x-2">
                    {images &&
                      images.map((image, index) => (
                        <img
                          key={index}
                          src={image as string}
                          alt="Note Image"
                          height={300}
                          width={100}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "Upload" && (
              <div className="flex flex-col">
                <UploadNotesImagePage noteId={notes._id} />
                <div className="p-4 w-[600px]">
                  <p className="font-semibold pb-2">
                    Images uploaded for the notes:
                  </p>
                  <div className="flex flex-row gap-x-2">
                    {images &&
                      images.map((image, index) => (
                        <img
                          key={index}
                          src={image as string}
                          alt="Note Image"
                          height={300}
                          width={100}
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "Feedback" && (
              <div className="w-[40vw] h-[100vh]">
                <iframe
                  src="https://arxiv.org/pdf/2402.09859.pdf"
                  width="100%"
                  height="100%"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

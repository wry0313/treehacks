import { useMutation, useQuery } from "convex/react";
import { useParams } from "../../router";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import UploadNotesImagePage from "../../components/UploadNotesImage";
import ClipLoader from "react-spinners/ClipLoader";
import ChatBot from "../../components/ChatBot";

export default function NotePage() {
  const { id } = useParams("/note/:id" as never);
  const notes = useQuery(api.notes.getNoteById, { noteId: id });
  const images = useQuery(api.noteImages.getNoteImageUrlAndStatusByNoteId, {
    noteId: id,
  });
  const pdfs = useQuery(api.noteLatexPdf.getLatexPdfByNoteId, { noteId: id });
  console.log(pdfs);
  const [mode, setMode] = useState<"Upload" | "Feedback" | "Chatbot">("Upload");

  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const updateNoteTitle = useMutation(api.notes.updateNoteTitle);
  return (
    <div className="flex flex-row h-full w-full grow">
      <div className="fixed top-0 left-0 flex flex-col w-[15%] bg-blue-500 h-screen">
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
        <div className="flex flex-col items-center w-full text-white text-2xl mt-20 gap-y-10">
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
          {/* <button
            className={mode === "Graph" ? "font-bold" : ""}
            onClick={() => setMode("Graph")}
          > */}
          {/* Graph */}
          {/* </button> */}
        </div>
      </div>

      {notes && (
        <div className="flex flex-col h-screen overflow-scroll w-full ml-[15%] flex-grow">
          <div className="text-2xl font-semibold p-2 h-[50px] bg-gray-200 flex flex-row gap-x-2 items-center">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-300 rounded focus:outline-none"
                />
                <button
                  onClick={() => {
                    setEditMode(false);
                    notes.title = newTitle;
                    updateNoteTitle({
                      noteId: notes._id,
                      newTitle: newTitle,
                    });
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p>{notes.title}</p>
                <button
                  onClick={() => {
                    if (editMode) {
                      setEditMode(false);
                    } else {
                      setEditMode(true);
                    }
                  }}
                >
                  <EditIcon />
                </button>
              </>
            )}
          </div>
          <div className="p-4 w-full flex-grow">
            {mode === "Upload" && (
              <div className="flex flex-col flex-grow w-full">
                <UploadNotesImagePage noteId={notes._id} />
                <div className="p-4 w-[600px]">
                  <p className="font-semibold pb-2">
                    Images uploaded for the notes:
                  </p>
                  <div className="flex flex-row gap-x-2 overflow-scroll flex-grow w-[190%]">
                    {images &&
                      images.map((image, index) => (
                        <div className="flex flex-col gap-y-2">
                          <img
                            key={index}
                            src={image.url as string}
                            alt="Note Image"
                            className="object-contain rounded shadow-lg"
                            height={500}
                            width={200}
                          />
                          <p>
                            {image.status === "complete" ? (
                              <div className="flex flex-row gap-x-1">
                                <CheckIcon />
                                <p className="text-green-700">Complete</p>
                              </div>
                            ) : (
                              <div className="flex flex-row gap-x-1">
                                <ClipLoader
                                  size={30}
                                  aria-label="Loading Spinner"
                                  data-testid="loader"
                                />
                                <p className="text-blue-700">loading</p>
                              </div>
                            )}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {mode === "Feedback" && (
              <div className="flex w-full h-[80vh]">
                <div className="flex-grow">
                  {pdfs && pdfs.length > 0 ? (
                    pdfs.map((pdf, index) => (
                      <div className="flex flex-row gap-x-2 justify-start items-start">
                        <iframe
                          key={index}
                          src={pdf as string}
                          style={{ width: "50vw", height: "60vh" }}
                          title={`PDF document ${index + 1}`}
                        ></iframe>
                        {images && images.length > index && (
                          <img
                            src={images[index].url as string}
                            alt="Note Image"
                            className="rounded object-contain"
                            height={500}
                            width={400}
                          />
                        )}
                      </div>
                    ))
                  ) : images && images.length > 0 ? (
                    <p>Image is processing...</p>
                  ) : (
                    <p>No PDFs uploaded for this note</p>
                  )}
                </div>
              </div>
            )}

            {mode === "Chatbot" && (
              <div className="">
                <ChatBot />
                {/* <Graph adjacencyList={temp}/>  */}
              </div>
            )}
            {/* {mode === "Graph" && <Graph adjacencyList={adjacencyList} />} */}
          </div>
        </div>
      )}
    </div>
  );
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="green"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

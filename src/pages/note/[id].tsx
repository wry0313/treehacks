import { useQuery } from "convex/react";
import { useParams } from "../../router";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import UploadNotesImagePage from "../../components/UploadNotesImage";
import ChatBot from "../../components/ChatBot";
import Graph from "../../components/Graph";

const adjacencyList = {
  "The Stable Matching ...": ["Stability is defined...", "The algorithm operat...", "The concept of optim..."],
  "Stability is defined...": ["The Stable Matching ...", "The algorithm operat...", "The concept of optim..."],
  "The algorithm operat...": ["The Stable Matching ...", "Stability is defined...", "The concept of optim..."],
  "The concept of optim...": ["The Stable Matching ...", "The algorithm operat...", "Stability is defined..."],
  "Historical context i...": ["The note discusses t...", "The concept of optim...", "The Stable Matching ..."],
  "The note discusses t...": ["Historical context i...", "The concept of optim...", "The algorithm operat..."],
  "Further reading sugg...": ["The Stable Matching ...", "RSA's implementation...", "Hall's Marriage Theo..."],
  "RSA's implementation...": ["The document outline...", "RSA cryptography all...", "Further reading sugg..."],
  "Hall's Marriage Theo...": [],
  "Eulerian Tours: Cond...": ["Planar Graphs and Eu..."],
  "Planar Graphs and Eu...": ["Connectivity and Pat...", "Eulerian Tours: Cond..."],
  "Connectivity and Pat...": ["Planar Graphs and Eu..."],
  "RSA cryptography all...": ["The security of RSA ...", "Security: The securi...", "The document outline..."],
  "The security of RSA ...": ["Security: The securi...", "RSA cryptography all...", "The document outline..."],
  "Security: The securi...": [],
  "The document outline...": ["RSA cryptography all...", "RSA's implementation...", "Security: The securi..."]
};

// const adjacencyList = {
//   "The Stable Matching ...": ["Stability is defined...", "The algorithm operat...", "The concept of optim..."],
//   "Stability is defined...": ["The Stable Matching ...", "The algorithm operat...", "The concept of optim..."],
//   "The algorithm operat...": ["The Stable Matching ...", "Stability is defined...", "The concept of optim..."],
//   "The concept of optim...": ["The Stable Matching ...", "The algorithm operat...", "Stability is defined..."],
//   "Historical context i...": ["The note discusses t...", "The concept of optim...", "The Stable Matching ..."],
//   "The note discusses t...": ["Historical context i...", "The concept of optim...", "The algorithm operat..."],
//   "Further reading sugg...": ["The Stable Matching ...", "RSA's implementation...", "Hall's Marriage Theo..."],
//   "RSA's implementation...": ["The document outline...", "RSA cryptography all...", "Further reading sugg..."],
//   "Hall's Marriage Theo...": ["Tutte's Theorem: Gen...", "Hales-Jewett Theorem...", "Ramsey's Theorem: St..."],
//   "Eulerian Tours: Cond...": ["Planar Graphs and Eu..."],
//   "Planar Graphs and Eu...": ["Connectivity and Pat...", "Eulerian Tours: Cond..."],
//   "Connectivity and Pat...": ["Planar Graphs and Eu..."],
//   "RSA cryptography all...": ["The security of RSA ...", "Security: The securi...", "The document outline..."],
//   "The security of RSA ...": ["Security: The securi...", "RSA cryptography all...", "The document outline..."],
//   "Security: The securi...": ["The security of RSA ...", "Choose two large pri...", "RSA cryptography all..."],
//   "The document outline...": ["RSA cryptography all...", "RSA's implementation...", "Security: The securi..."],
//   "Choose two large pri...": ["Security: The securi...", "The sender, Alice, t...", "Decryption: The reci..."],
//   "The sender, Alice, t...": ["Decryption: The reci...", "Choose two large pri...", "Security: The securi..."],
//   "Decryption: The reci...": ["The sender, Alice, t...", "Security: The securi...", "Choose two large pri..."],
//   "Tutte's Theorem: Gen...": ["Hall's Marriage Theo...", "Turán's Theorem: Pro...", "Kuratowski's Theorem..."],
//   "Hales-Jewett Theorem...": [],
//   "Ramsey's Theorem: St...": ["Dilworth's Theorem: ...", "Hales-Jewett Theorem...", "Menger's Theorem: Pr..."],
//   "Turán's Theorem: Pro...": [],
//   "Kuratowski's Theorem...": [],
//   "Dijkstra's Algorithm...": ["Ford-Fulkerson Algor...", "Connectivity and Pat...", "Eulerian Tours: Cond..."],
//   "Ford-Fulkerson Algor...": ["Menger's Theorem: Pr...", "Dijkstra's Algorithm...", "Connectivity and Pat..."],
//   "Menger's Theorem: Pr...": [],
//   "Dilworth's Theorem: ...": [],
//   "Van der Waerden's Th...": ["Lovász Local Lemma: ...", "Ramsey's Theorem: St...", "Brouwer's Fixed Poin..."],
//   "Lovász Local Lemma: ...": [],
//   "Brouwer's Fixed Poin...": [],
//   "Block Design Theory:...": ["Dilworth's Theorem: ...", "Latin Squares and Or...", "Hales-Jewett Theorem..."],
//   "Latin Squares and Or...": ["Planar Graphs and Eu...", "Lovász Local Lemma: ..."],
//   "Diffie-Hellman Key E...": ["RSA cryptography all...", "Elliptic Curve Crypt...", "Decryption: The reci..."],
//   "Elliptic Curve Crypt...": []
// };


export default function NotePage() {
  const { id } = useParams("/note/:id" as never);
  const notes = useQuery(api.notes.getNoteById, { noteId: id });
  const images = useQuery(api.noteImages.getNoteImageUrlAndStatusByNoteId, {
    noteId: id,
  });
  const pdfs = useQuery(api.noteLatexPdf.getLatexPdfByNoteId, { noteId: id });
  console.log(pdfs);
  const [mode, setMode] = useState<"Upload" | "Feedback" | "Chatbot">("Upload");
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
        </div>
      </div>

      {notes && (
        <div className="flex flex-col h-screen overflow-scroll w-full ml-[15%] flex-grow">
          <p className="text-2xl font-semibold p-2 h-[50px] bg-gray-200">
            {" "}
            {notes?.title}{" "}
          </p>
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
                            style={{ objectFit: "contain" }}
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
                              "Processing"
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
          <iframe
            key={index}
            src={pdf as string}
            style={{ width: "50vw", height: "100%" }}
            frameBorder="0"
            title={`PDF document ${index + 1}`}
          ></iframe>
        ))
      ) : images && images.length > 0 ? (
        <p>Image is processing...</p>
      ) : (
        <p>No PDFs uploaded for this note</p>
      )}
    </div>
    {images && images.length > 0 && (
      <div className="flex-grow overflow-auto">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url as string}
            alt="Note Image"
            style={{ objectFit: "contain", width: "50vw", height: "auto" }}
          />
        ))}
      </div>
    )}
  </div>
)}


            {mode === "Chatbot" && (
              <div className="">
                {/* <ChatBot /> */}
                {/* <ChatBot/> */}
                <Graph adjacencyList={adjacencyList}/> 
              </div>
            )}
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

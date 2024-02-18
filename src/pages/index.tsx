/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";
import logo from "../assets/logo.png";
export default function HomePage() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  console.log(user);
  const userNotes = useQuery(api.notes.getNotesByUserId, {
    userId: user?.id ?? "",
  });
  console.log(userNotes);
  return (
    <div className="w-full ">
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar bg-secondary">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 font-bold text-2xl text-white">
              <img src={logo} alt="logo" className="h-14 w-13 inline" />
              Elevate Notebooks
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal">
                {/* Navbar menu content here */}
                <li>
                  {isAuthenticated ? (
                    <div className="btn ">
                      <SignOutButton />
                    </div>
                  ) : (
                    <div className="btn ">
                      <SignInButton mode="modal" />
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-5">
        {isAuthenticated ? (
          <h1 className="text-2xl font-bold">Welcome {user?.fullName}</h1>
        ) : (
          <h1 className="text-2xl font-bold">Welcome to the home page</h1>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 p-5">
        {userNotes?.map(({ _id, title, createdAt }) => (
          <NoteCard id={_id} title={title} date={createdAt} isAdd={false} />
        ))}
        <AddNoteCard />
      </div>
    </div>
  );
}

const NoteCard = ({
  id,
  title,
  date,
  isAdd = false,
}: {
  id: string;
  title: string;
  date: string;
  isAdd: boolean;
}) => {
  const navigate = useNavigate();

  const getThumbNail = useQuery(api.noteImages.getOneImageByOneNoteId, {
    noteId: id as Id<"notes">,
  });
  return (
    <button
      key={id}
      onClick={() => {
        navigate(`/note/${id}`);
      }}
      className="cursor-pointer flex flex-col w-72 rounded-lg shadow-lg"
    >
      <div className="bg-gray-100 h-48 w-full rounded-t">
        {getThumbNail ? (
          <img
            src={getThumbNail}
            alt="thumbnail"
            className="object-cover h-full w-full rounded-t"
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <DocumentIcon />
          </div>
        )}
      </div>
      <div className="px-6 py-4 grow w-full bg-blue-500 rounded-b">
        <div className="font-bold text-xl mb-2 text-white">
          {isAdd ? "Add a new note" : title}
        </div>
        <p className="text-gray-200 text-base">{date}</p>
      </div>
    </button>
  );
};

const AddNoteCard = () => {
  const insertNewNotes = useMutation(api.notes.insertNewNotes);

  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        if (!isAuthenticated || !user) {
          toast.error("Please sign in to add a new note");
          return;
        }
        insertNewNotes({ userId: user.id }).then((id) => {
          toast.success("New note added");
          navigate(`/note/${id}`);
        });
      }}
      className="cursor-pointer flex flex-col w-72 rounded-lg shadow-lg"
    >
      <div className="bg-gray-100 h-48 w-full rounded-t">
        <div className="flex justify-center items-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
      </div>
      <div className="px-6 py-4 grow w-full bg-blue-500 rounded-b">
        <div className="font-bold text-xl mb-2 text-white">Add a new note</div>
      </div>
    </button>
  );
};

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-10 h-10"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
    />
  </svg>
);

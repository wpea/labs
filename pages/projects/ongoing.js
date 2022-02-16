import Home from "./../index";
import { useEffect, useState } from "react";
import { useAppContext } from "../../lib/contexts/globalState";
import moment from "moment";
import { useRouter } from "next/router";

export default function OnGoingProjects() {
  const [sharedState] = useAppContext();
  const [ongoing, setOngoing] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setOngoing(
      sharedState.projects.filter((project) => project.status === "ongoing")
    );
    // console.log(ongoing);
  }, []);

  return (
    <Home>
      <div className="border rounded-lg lg:col-span-2 place-self-start w-full">
        <div className="p-4">
          <div className="tracking-wide space-y-6">
            <div className="font-bold text-sm tracking-tight">
              Ongoing Projects
            </div>
          </div>
        </div>
        <div className="p-4 border-t rounded-bl-md rounded-br-md bg-gray-100">
          {!ongoing.length > 0 ? (
            <div className="grid p-3 px-4">
              <div className="text-center text-xs text-gray-600">
                No ongoing projects.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {ongoing.map((project) => (
                <div
                  onClick={() => {
                    router.push(`/projects/${project.id}`);
                  }}
                  key={project.id}
                  className="grid grid-cols-2 bg-yellow-600 hover:bg-yellow-700 p-3 px-4 rounded-md hover:bg-blue-yellow cursor-pointer"
                >
                  <div className="text-white tracking-tight font-medium">
                    {project.title}
                  </div>
                  <div className="flex justify-self-end space-x-3">
                    <div className="text-2xs border border-yellow-500 rounded-md px-2 py-1 text-white font-medium uppercase">
                      End date &bull; {moment(project.end_date).format("ll")}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 fill-current text-white self-center transform -rotate-45"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ))}

              {/* <button className="text-sm btn btn-sm btn-outline">
                View more
              </button> */}
            </div>
          )}
        </div>
      </div>
    </Home>
  );
}

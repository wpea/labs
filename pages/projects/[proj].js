import { useRouter } from "next/router";
import { useState } from "react";
import Home from "..";
import { useAppContext } from "../../lib/contexts/globalState";
import Modal from "../../lib/modal";
import CreateMilestone from "./../../components/createMilestone";
import { useEffect } from "react";
import { findMilestone } from "../../lib/api";
import moment from "moment";

export default function Project() {
  const router = useRouter();
  const { proj } = router.query;
  const [open, setOpen] = useState(false);
  const [sharedState, updateSharedState] = useAppContext();
  const [defaultProject, setDefaultProject] = useState(["hey"]);
  const [milestones, setMilestones] = useState([]);

  const toggleModal = () => {
    setOpen((open = !open));
  };

  useEffect(() => {
    // getData();
    setDefaultProject(getProject(proj));

    setMilestones(
      sharedState.milestones.filter(
        (milestone) => parseInt(milestone.proj_id) === parseInt(proj)
      )
    );
  }, [sharedState.refresh]);

  const getData = async () => {
    const getMilestones = await findMilestone(proj);
    // setMilestones(getMilestones);
  };

  // Get project details
  const getProject = () => {
    return sharedState.projects.filter(
      (project) => parseInt(project.id) === parseInt(proj)
    );
  };

  return (
    <Home>
      {defaultProject.map((df) => (
        <div
          key={Math.random()}
          className="border rounded-lg lg:col-span-2 place-self-start w-full"
        >
          <div className="p-4">
            <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
              <div className="font-bold text-xl tracking-tight">{df.title}</div>
              <div className="flex items-center justify-between md:justify-start space-x-2">
                <div className="text-2xs font-medium">
                  <span className="text-green-600">&bull;</span> Lead ({df.lead}
                  )
                </div>

                <div className="text-2xs items-center cursor-pointer bg-yellow-600 hover:border-none space-x-1 flex rounded-md px-2 py-1 text-white font-medium uppercase">
                  <div>Ongoing</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-10 border-t rounded-bl-md rounded-br-md hover:bg-gray-100">
            <div className="grid grid-cols-2 rounded-md hover:bg-blue-green cursor-pointer">
              <div>
                <div className="text-sm font-medium">Starts</div>
                <div className="text-xs font-medium">
                  {moment(df.start_date).format("ll")}
                </div>
              </div>

              <div className="justify-self-end">
                <div className="text-right text-sm font-medium">Ends</div>
                <div className="text-xs font-medium">
                  {moment(df.end_date).format("ll")}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 mb-16 space-y-4 md:space-y-0">
                <div className="font-bold text-lg">Milestones</div>
                <button
                  onClick={toggleModal}
                  className="text-sm btn btn-sm btn-outline place-self-start md:justify-self-end"
                >
                  + Add a milestone
                </button>
                {/* <div className="text-2xs">{JSON.stringify(defaultProject)}</div> */}
              </div>

              {milestones.length === 0 ? (
                <div className="grid place-items-center text-sm tracking-tight text-gray-400 p-3 px-4 rounded-md hover:bg-blue-cyan cursor-pointer">
                  Add a milestone
                </div>
              ) : (
                milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    onClick={() =>
                      router.push(`/projects/milestone/${milestone.id}`)
                    }
                    className="grid md:grid-cols-2 space-y-4 md:space-y-0 bg-cyan-600 hover:bg-cyan-700 p-3 px-4 rounded-md hover:bg-blue-cyan cursor-pointer"
                  >
                    <div className="self-start place-self-start grid space-y-4">
                      <div className="text-white leading-5">
                        {milestone.milestone}
                      </div>
                      <div className="self-start place-self-start bg-cyan-200 rounded-md px-1 text-cyan-800 text-xs grid grid-cols-2">
                        <div className="grid">
                          <div className="justify-self-center p-1 pr-2">
                            Starts &nbsp;
                            <span className="font-bold">
                              {moment(milestone.start_date).format("ll")}
                            </span>
                          </div>
                        </div>
                        <div className="border-l border-cyan-600 grid">
                          <div className="justify-self-center p-1 pl-2">
                            Ends &nbsp;
                            <span className="font-bold">
                              {moment(milestone.end_date).format("ll")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:justify-self-end justify-self-start self-start flex items-center space-x-2">
                      {milestone.status === "ongoing" ? (
                        <div className="text-2xs border items-center cursor-pointer hover:bg-cyan-800 hover:border-none space-x-1 flex border-cyan-500 rounded-md px-2 py-1 text-white font-medium uppercase">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>

                          <div>Mark as completed</div>
                        </div>
                      ) : (
                        <div className="text-2xs items-center cursor-pointer bg-cyan-800 hover:border-none space-x-1 flex rounded-md px-2 py-1 text-white font-medium uppercase">
                          <div>Completed</div>
                        </div>
                      )}

                      <div className="bg-rose-500 p-0.5 cursor-pointer hover:bg-rose-700 rounded">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 stroke-current text-rose-100 hover:text-rose-200"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ))}

      {open && (
        <Modal>
          <CreateMilestone toggle={toggleModal} projectId={proj} />
        </Modal>
      )}
    </Home>
  );
}

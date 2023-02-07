import { useRouter } from "next/router";
import { useState } from "react";
import Home from "..";
import { useAppContext } from "../../lib/contexts/globalState";
import Modal from "../../lib/modal";
import CreateMilestone from "./../../components/createMilestone";
import { useEffect } from "react";
import { del, findMilestone, update, apiAddress } from "../../lib/api";
import moment from "moment";
import MarkAsCompleted from "./../../components/MarkAsCompleted";
import { getToken } from "./../../lib/hooks/useAuth2";
import _ from "lodash";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Project() {
  const router = useRouter();
  const { proj } = router.query;
  const [open, setOpen] = useState(false);
  const [sharedState] = useAppContext();
  const [defaultProject, setDefaultProject] = useState(["hey"]);
  const [milestones, setMilestones] = useState([]);
  const [urlId, setUrlId] = useState();

  const toggleModal = () => {
    setOpen((open = !open));
  };

  useEffect(() => {
    setDefaultProject(getProject(proj));
    setUrlId(proj);
    //get + filter
    const mstones = sharedState.milestones.filter(
      (milestone) => parseInt(milestone.proj_id) === parseInt(proj)
    );

    //sort
    const sortedMilestones = _.orderBy(mstones, ["end_date"], ["asc"]);

    //set
    setMilestones(sortedMilestones);
  }, [sharedState.refresh]);

  // Get project details
  const getProject = () => {
    return sharedState.projects.filter(
      (project) => parseInt(project.id) === parseInt(proj)
    );
  };

  // Complete milestone
  const handleComplete = (data) => {
    update("milestone", data.id, { status: "completed" }, getToken());

    const m = milestones.map((milestone) => {
      if (milestone.id === data.id) {
        return { ...milestone, status: "completed" };
      }
      return milestone;
    });

    setMilestones(m);
  };

  const handleDelete = (id) => {
    del("milestone", id, getToken());

    const m = milestones.filter((milestone) => milestone.id !== id);

    setMilestones(m);
  };

  const completeProject = (df) => {
    update("projects", df.id, { status: "completed" }, getToken());

    const p = defaultProject.map((project) => {
      if (project.id === df.id) {
        return { ...project, status: "completed" };
      }
      return project;
    });

    setDefaultProject(p);
  };

  const handleDeleteProject = () => {
    const deleteProject = async (proj) => {
      try {
        const res = await axios.delete(`${apiAddress}/projects/${urlId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        });
        // const response = await fetch(`${apiAddress}/projects/${proj}`);
        // const result = await response.json();
        // console.log(result);
        if (res.status === 200) {
          toast.success("Project Deleted");
          router.push("/projects");
        }
      } catch (e) {
        console.log(e);
      }
    };
    deleteProject();
    console.log(proj);
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

                {df.status === "ongoing" && (
                  <MarkAsCompleted
                    onComplete={() => {
                      completeProject(df);
                    }}
                    textColor={`text-black`}
                    color={`gray`}
                    hover={`stone`}
                  />
                )}

                <div
                  className={`text-2xs items-center cursor-pointer ${
                    df.status === "ongoing" ? `bg-yellow-600` : `bg-green-600`
                  } hover:border-none space-x-1 flex rounded-md px-2 py-1 text-white font-medium uppercase`}
                >
                  <div className="capitalize">{df.status}</div>
                </div>

                <button onClick={handleDeleteProject}>
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
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
                  Create a milestone.
                </div>
              ) : (
                milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="grid md:grid-cols-2 space-y-4 md:space-y-0 bg-cyan-600 hover:bg-cyan-700 p-3 px-4 rounded-md hover:bg-blue-cyan cursor-pointer"
                  >
                    <div
                      onClick={() =>
                        router.push(`/projects/milestone/${milestone.id}`)
                      }
                      className="self-start place-self-start grid space-y-4"
                    >
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
                        <MarkAsCompleted
                          onComplete={() => {
                            handleComplete(milestone);
                          }}
                          textColor={`text-white`}
                          color={`cyan`}
                          hover={`cyan`}
                        />
                      ) : (
                        <div className="text-2xs items-center cursor-pointer bg-cyan-800 hover:border-none space-x-1 flex rounded-md px-2 py-1 text-white font-medium uppercase">
                          <div>Completed</div>
                        </div>
                      )}

                      <div
                        onClick={() => {
                          handleDelete(milestone.id);
                        }}
                        className="bg-rose-500 p-0.5 cursor-pointer hover:bg-rose-700 rounded"
                      >
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

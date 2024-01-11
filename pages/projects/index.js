import Home from "..";
import Button from "../../components/button";
import { useRouter } from "next/router";
// import md5 from "md5";
import { useEffect, useState } from "react";
import { useAppContext } from "../../lib/contexts/globalState";
import _ from "lodash";

export default function AllProjects() {
  const router = useRouter();
  const [prods, setProds] = useState([]);

  const [sharedState] = useAppContext();

  useEffect(() => {
    // get and sort
    const sortedProjects = _.orderBy(sharedState.projects, "end_date", "asc");
    const groupedProjects = _.groupBy(sharedState.projects, (project) =>
      new Date(project.start_date).getFullYear()
    );

    console.log(groupedProjects);
    // set
    setProds(groupedProjects);
  }, [sharedState.projects]);

  const completed = "bg-green-600 hover:bg-green-800";
  const ongoing = "bg-yellow-600 hover:bg-yellow-800";
  const defaultStyle = "grid grid-cols-2 p-3 px-4 rounded-md cursor-pointer ";

  return (
    <Home>
      <div className="border rounded-lg lg:col-span-2 place-self-start w-full">
        <div className="p-4">
          <div className="tracking-wide space-y-6">
            <div className="font-bold text-sm tracking-tight">All Projects</div>
          </div>
        </div>
        <div className="p-4 space-y-6 border-t rounded-bl-md rounded-br-md bg-gray-100">
          {prods.length === 0 ? (
            <div className="grid p-3 px-4">
              <div className="text-center text-xs text-gray-600">
                Create a project.
              </div>
            </div>
          ) : (
            // prods.map((project) => (
            //   <div
            //     key={project.id}
            //     onClick={() => router.push(`projects/${project.id}`)}
            //     className={`${defaultStyle} ${
            //       project.status === "completed" ? completed : ongoing
            //     }`}
            //   >
            //     <div className="text-white tracking-tight font-medium">
            //       {project.title}
            //     </div>
            //     <svg
            //       xmlns="http://www.w3.org/2000/svg"
            //       className="h-5 w-5 fill-current text-white justify-self-end self-center transform -rotate-45"
            //       viewBox="0 0 20 20"
            //       fill="currentColor"
            //     >
            //       <path
            //         fillRule="evenodd"
            //         d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
            //         clipRule="evenodd"
            //       />
            //     </svg>
            //   </div>
            // ))
            Object.entries(prods)
              .reverse()
              .map(([year, projects]) => (
                <div key={year} className="mb-2">
                  <div className="font-bold mb-1">{year}</div>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => router.push(`projects/${project.id}`)}
                      className={` ${defaultStyle} ${
                        project.status === "completed" ? completed : ongoing
                      } mb-4`}
                    >
                      <div className="text-white tracking-tight font-medium ">
                        {project.title}
                      </div>
                      {/* Add other project details or SVG as needed */}
                    </div>
                  ))}
                </div>
              ))
          )}

          {!prods.length === 0 && (
            <Button
              styles={`text-sm btn btn-sm btn-outline`}
              value={`view more`}
            />
          )}
        </div>
      </div>
    </Home>
  );
}

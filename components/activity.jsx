import Link from "next/link";
import { useAppContext } from "../lib/contexts/globalState";

export default function Activity() {
  const [sharedState] = useAppContext();
  const { activity } = sharedState;

  // useEffect(() => {
  //   getActivities();
  //   console.log(activity);
  // }, []);

  // const getActivities = async () => {
  //   const data = await getActivity();
  //   setSharedState({ ...sharedState, activity: data });
  // };

  const truncateTitle = (str, num) => {
    return str.length > num ? str.slice(0, num) + "..." : str;
  };

  const createSVG = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 mt-1 fill-current text-blue-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const addMilestoneSVG = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 mt-1 fill-current text-blue-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const compMileStoneSVG = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 mt-1 fill-current text-cyan-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const compProjectSVG = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3 mt-1 fill-current text-green-600"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const delProjectSVG = () => {
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 mt-1 fill-current text-red-700"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    </svg>;
  };

  const Project = (title, type, id, date) => {
    return (
      <div key={`${id}`} className="flex space-x-3 justify-between">
        <div className="flex space-x-3">
          {type === "create" && createSVG()}
          {type === "delete" && delProjectSVG()}
          {type === "milestone" && addMilestoneSVG()}
          {type === "complete_milestone" && compMileStoneSVG()}
          {type === "complete_project" && compProjectSVG()}
          <div>
            <Link href={`/projects/${id}`}>
              <div className="justify-self-end text-2xs cursor-pointer hover:text-gray-800 text-gray-500 font-bold">
                {truncateTitle(title, 20)}
              </div>
            </Link>
          </div>
        </div>
        <div className="text-2xs">{date.toDateString()}</div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 rounded-lg place-self-start w-full pb-2">
      <div className="border-b rounded-t-lg border-gray-300 grid grid-cols-2 cursor-pointer hover:bg-gray-100">
        <div className="p-4 font-bold text-sm">Activity</div>
      </div>

      <div className="p-4 space-y-4">
        {activity.length === 0 ? (
          <div className="text-2xs text-gray-600 text-center">No activity</div>
        ) : (
          activity.map((item) =>
            Project(item.title, item.type, item.proj_id, new Date(item.date))
          )
        )}
      </div>
    </div>
  );
}

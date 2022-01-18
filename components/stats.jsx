import ActiveLink from "./activeLink";
import { useAppContext } from "../lib/contexts/globalState";

export default function Stats() {
  const [sharedState] = useAppContext();
  const { projects } = sharedState;

  const resOngoing = projects.filter((project) => project.status === "ongoing");

  const resCompleted = projects.filter(
    (project) => project.status === "completed"
  );

  return (
    <div className="border rounded-lg place-self-start w-full">
      <div className="border-b grid grid-cols-2">
        <div className="p-4 font-bold text-sm">Stats</div>
      </div>

      <div>
        <ActiveLink href="/projects">
          <div className="tracking-tight">All Projects</div>
          <div className="font-bold text-blue-600">
            {sharedState.projects.length}
          </div>
        </ActiveLink>

        <ActiveLink href="/projects/ongoing">
          <div className="tracking-tight">Ongoing Projects</div>
          <div className="font-bold text-yellow-600">{resOngoing.length}</div>
        </ActiveLink>

        <ActiveLink href="/projects/completed">
          <div className="tracking-tight">Completed Projects</div>
          <div className="font-bold text-green-700">{resCompleted.length}</div>
        </ActiveLink>
      </div>
    </div>
  );
}

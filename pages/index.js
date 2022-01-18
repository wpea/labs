import Head from "next/head";
import { useState, useEffect } from "react";
import CreateProject from "../components/createProject";
import Modal from "../lib/modal";
import Header from "../components/header";
import Button from "../components/button";
import Stats from "../components/stats";
import Activity from "../components/activity";
import { get, getMilestones, getTasks } from "../lib/api";
import { useAppContext } from "../lib/contexts/globalState";

export default function Home({ children }) {
  const [open, setOpen] = useState(false);
  const [sharedState, updateSharedState] = useAppContext();

  //get page data on load
  //i need to add a clause for when new data is created
  //so it updates the global state
  //maybe this helps, taking out the caluse to check if theres data before
  useEffect(() => {
    // if (sharedState.projects.length === 0) {
    getData();
    // console.log("home refresh");
    // console.log(sharedState.milestones);
    // }
  }, [sharedState.refresh]);

  const getData = async () => {
    const projects = await get();
    const milestones = await getMilestones();
    const tasks = await getTasks();
    updateSharedState({ ...sharedState, projects, milestones, tasks });
  };

  const toggleModal = () => {
    setOpen((open = !open));
  };

  return (
    <>
      <Head>
        <title>wplabs</title>
        <meta
          name="description"
          content="WP Labs Project - Innovating the family office."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full grid">
        <div className="md:px-20 p-10 space-y-10 grid">
          <Header />

          <div className="space-y-10">
            <Button
              styles={`btn btn-sm btn-outline`}
              clickEvent={toggleModal}
              value={`+ new project`}
            />
          </div>

          <div className="space-y-10">
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-9">
              <Stats />
              {children}
              <Activity />
            </div>
          </div>
        </div>
      </div>

      {open && (
        <Modal>
          <CreateProject toggle={toggleModal} />
        </Modal>
      )}
    </>
  );
}

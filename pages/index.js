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
import { getToken } from "./../lib/hooks/useAuth2";
import AppLayout from "./../components/Layouts/AppLayout";

export default function Home({ children }) {
  const [open, setOpen] = useState(false);
  const [sharedState, updateSharedState] = useAppContext();

  // on component mount
  useEffect(() => {
    getData(getToken());
  }, [sharedState.refresh]);

  // get and store data in global state
  const getData = async (token) => {
    const projects = await get(token);
    const milestones = await getMilestones(token);
    const tasks = await getTasks(token);
    updateSharedState({ ...sharedState, projects, milestones, tasks });
  };

  // toggle modal
  const toggleModal = () => {
    setOpen((open = !open));
  };

  return (
    <>
      <AppLayout>
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
      </AppLayout>
    </>
  );
}

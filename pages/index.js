import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import CreateProject from '../components/createProject';
import Modal from '../lib/modal';
import Header from './../components/header';
import Button from './../components/button';
import Stats from './stats';
import AllProjects from './allProjects';
import Activity from './activity';

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleModalState = () => {
    setOpen(open = !open);
  }

  return (
    <>
      <Head>
        <title>wplabs</title>
        <meta name="description" content="WP Labs Project - Innovating the family office." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full grid">
        <div className="md:px-20 p-10 space-y-10 grid">
          <Header />

          <div className="space-y-10">
            <Button styles={`btn btn-sm btn-outline`} handleClick={handleModalState} value={`+ new project`} />
          </div>

          <div className='space-y-10'>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-9">
              <Stats />
              <AllProjects />
              <Activity />
            </div>
          </div>
        </div>
      </div>

      {open &&
        <Modal>
          <CreateProject setModalState={handleModalState} />
        </Modal>
      }

    </>
  )
}

import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import CreateProject from '../components/createProject';
import Modal from '../lib/modal';
import Header from '../components/header';
import Button from '../components/button';
import Stats from '../components/stats';
import Activity from '../components/activity';

export default function Home({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
  }, [])

  const toggleModal = () => {
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
            <Button styles={`btn btn-sm btn-outline`} clickEvent={toggleModal} value={`+ new project`} />
          </div>

          <div className='space-y-10'>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-9">
              <Stats />
              {children}
              <Activity />
            </div>
          </div>
        </div>
      </div>

      {open &&
        <Modal>
          <CreateProject toggle={toggleModal} />
        </Modal>
      }

    </>
  )
}

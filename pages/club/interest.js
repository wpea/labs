import AppLayout from "./../../components/Layouts/AppLayout";
import Head from "next/head";
import Header from "./../../components/header";
import Table from "../../components/Clubs/table";

export default function Interest() {
  return (
    <>
      <AppLayout>
        <Head>
          <title>home &mdash; wplabs</title>
          <meta
            name="description"
            content="WP Clubs - Innovating the family office."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="w-full grid">
          <div className="md:px-20 p-10 space-y-10 grid">
            <Header />

            <div className="border-t pt-10 flex items-center justify-between">
              <div className="text-xl tracking-tight font-bold text-gray-700">
                Club Prospects{" "}
                <span className="text-xs font-light align-super">01</span>
              </div>
              <div className="cursor-pointer rounded-md px-3 py-1 text-blue-800 bg-blue-100 font-medium tracking-tight flex items-center space-x-2">
                <div>Share link</div>
              </div>
            </div>
            <Table />
          </div>
        </div>
      </AppLayout>
    </>
  );
}

import { WPEALogo, Download } from "../../assets/SVGs";
import { Container } from "./components/Container";
import PortfolioValue from "./components/PortfolioValue";
import Table from "./components/Table";

const Jamila = () => {
  return (
    <Container>
      <div className="rounded-3xl bg-white h-fit pt-20 px-24 ">
        <div className="flex items-center justify-between">
          <WPEALogo />
          <p className="font-normal text-sm">Reporting Dashboard.</p>
        </div>

        <PortfolioValue
          ammount="$12,000"
          clientName="Jamila Abubakar"
          date={new Date().toJSON().slice(0, 10)}
        />

        <Table />

        <button
          className="border bg-[#2D7EC2] rounded-md p-2  mx-auto mb-12"
          onClick={() => {}}
        >
          <div className="flex justify-between items-center space-x-6 px-5">
            <p className="text-white">Download Report</p>
            <div className=" flex">
              <Download />
            </div>
          </div>
        </button>
      </div>
    </Container>
  );
};

export default Jamila;

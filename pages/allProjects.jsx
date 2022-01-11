import Button from "./../components/button";

export default function AllProjects() {
  return (
    <div className="border rounded-lg lg:col-span-2 place-self-start w-full">
      <div className="p-4">
        <div className="tracking-wide space-y-6">
          <div className="font-bold text-sm tracking-tight">All Projects</div>
        </div>
      </div>
      <div className="p-4 space-y-6 border-t rounded-bl-md rounded-br-md hover:bg-gray-100">
        <div className="grid grid-cols-2 bg-blue-600 p-3 px-4 rounded-md hover:bg-blue-800 cursor-pointer">
          <div className="text-white tracking-tight font-medium">
            Financial Modelling for WP
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-current text-white justify-self-end self-center transform -rotate-45"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 bg-yellow-600 p-3 px-4 rounded-md hover:bg-blue-yellow cursor-pointer">
          <div className="text-white tracking-tight font-medium">
            Financial Modelling for WP
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-current text-white justify-self-end self-center transform -rotate-45"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 bg-green-600 p-3 px-4 rounded-md hover:bg-blue-green cursor-pointer">
          <div className="text-white tracking-tight font-medium">
            Financial Modelling for WP
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-current text-white justify-self-end self-center transform -rotate-45"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <Button styles={`text-sm btn btn-sm btn-outline`} value={`view more`} />

        {/* <button className="text-sm btn btn-sm btn-outline">+ Add a milestone</button> */}
      </div>
    </div>
  );
}

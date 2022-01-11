export default function CreateProject({ setModalState }) {
  return (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 space-y-4">
            <div className="mt-3 text-center sm:mt-1 sm:mx-4 sm:text-left flex justify-between">
              <h3
                className="text-lg leading-6 font-bold text-gray-900"
                id="modal-title"
              >
                Create Project
              </h3>
              <svg
                onClick={setModalState}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current text-gray-500 cursor-pointer hover:text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="sm:items-start">
              <form action="#" method="POST">
                <div className="overflow-hidden sm:rounded-md">
                  <div className="bg-white sm:p-4">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label
                          for="first-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Project title
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autocomplete="given-name"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          for="about"
                          className="block text-sm font-medium text-gray-700"
                        >
                          About
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="about"
                            name="about"
                            rows="3"
                            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder=""
                          ></textarea>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Brief description about the project.
                        </p>
                      </div>

                      <div className="col-span-6">
                        <label
                          for="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Project lead
                        </label>
                        <select
                          id="country"
                          name="country"
                          autocomplete="country-name"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        >
                          <option selected disabled>
                            Select
                          </option>
                          <option>Habib</option>
                          <option>Hafsah</option>
                          <option>Alex</option>
                        </select>
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                        <label
                          for="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="city"
                          id="city"
                          autocomplete="address-level2"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <label
                          for="region"
                          className="block text-sm font-medium text-gray-700"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          name="region"
                          id="region"
                          autocomplete="address-level1"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:px-6 sm:flex">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-0 focus:ring-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              + Create
            </button>
            <button
              onClick={setModalState}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

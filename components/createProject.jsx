import { useState, useEffect } from "react";
import { post } from "../lib/api";
import { useAppContext } from "../lib/contexts/globalState";
import { get, apiAddress } from "../lib/api";
import { getToken } from "../lib/hooks/useAuth2";
import axios from "axios";

export default function CreateProject({ toggle }) {
  const initialValues = {
    id: Date.now(),
    title: "",
    description: "",
    lead: "",
    start_date: "",
    end_date: "",
  };

  // console.log(sharedState);
  const [sharedState, setSharedState] = useAppContext();
  const [canSubmit, setCanSubmit] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (Object.keys(errors).length === 0 && canSubmit) {
      getData();
      toggle();
    }
  }, [errors]);

  const createNewProject = async () => {
    try {
      const res = await axios.post(`${apiAddress}/projects`, formValues, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // console.log(formValues);
  };

  // get and set the global state
  const getData = async () => {
    const data = await get(getToken());
    setSharedState({
      ...sharedState,
      projects: data,
      refresh: !sharedState.refresh,
    });
  };

  // validation rules
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.title) {
      errors.title = "Project title is required.";
    }

    if (!values.description) {
      errors.description = "Project description is required.";
    } else if (values.description.length <= 40) {
      errors.description = "Description should be more than 40 chars.";
    }

    if (!values.lead) {
      errors.lead = "Project lead is required.";
    }

    if (!values.start_date) {
      errors.start_date = "Project start date is required.";
    }

    if (!values.end_date) {
      errors.end_date = "Project end date is required.";
    }

    return errors;
  };

  const handleSubmit = () => {
    setErrors(validate(formValues));
    setCanSubmit(true);
    createNewProject();
  };

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
                onClick={toggle}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 fill-current text-gray-500 cursor-pointer hover:text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {/* {JSON.stringify(formValues, null, 2)} */}
            <div className="sm:items-start">
              <form>
                <div className="overflow-hidden sm:rounded-md">
                  <div className="bg-white sm:p-4">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Project title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formValues.title}
                          onChange={handleChange}
                          autoComplete="given-name"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.title && (
                          <span className="block text-2xs py-1 text-red-700">
                            {errors.title}
                          </span>
                        )}
                      </div>

                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Project Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            value={formValues.description}
                            onChange={handleChange}
                            rows="3"
                            className="shadow-sm focus:ring-gray-500 focus:border-gray-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder=""
                          ></textarea>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            Brief description the project.
                          </p>
                          <span className="text-xs font-bold text-gray-500">
                            {formValues.description.length}{" "}
                            <span className="font-normal">(Min: 40)</span>
                          </span>
                        </div>
                        {errors.description && (
                          <span className="block text-2xs py-1 text-red-700">
                            {errors.description}
                          </span>
                        )}
                      </div>

                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Project lead
                        </label>
                        <select
                          id="country"
                          name="lead"
                          value={formValues.lead}
                          onChange={handleChange}
                          autoComplete="country-name"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                        >
                          <option defaultValue>Select</option>
                          <option>Treasure-Praise</option>
                          <option>Maryam Salaudeen</option>
                          <option>Kayode Adedeji</option>
                          <option>Alex</option>
                          <option>Maryam</option>
                        </select>
                        {errors.lead && (
                          <span className="block text-2xs py-1 text-red-700">
                            {errors.lead}
                          </span>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={formValues.start_date}
                          onChange={handleChange}
                          id="city"
                          autoComplete="address-level2"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.start_date && (
                          <span className="block text-2xs py-1 text-red-700">
                            {errors.start_date}
                          </span>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={formValues.end_date}
                          onChange={handleChange}
                          id="region"
                          autoComplete="address-level1"
                          className="mt-1 focus:ring-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.end_date && (
                          <span className="block text-2xs py-1 text-red-700">
                            {errors.end_date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:px-6 sm:flex">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-0 focus:ring-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              + Create
            </button>

            <button
              onClick={toggle}
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

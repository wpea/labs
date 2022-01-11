export default function Activity() {
  return (
    <div className="bg-gray-100 rounded-lg place-self-start w-full pb-2">
      <div className="border-b rounded-t-lg border-gray-100 grid grid-cols-2 cursor-pointer hover:bg-gray-100">
        <div className="p-4 font-bold text-sm">Activity</div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex space-x-3 justify-between">
          <div className="flex space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mt-1 fill-current text-purple-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <div className="justify-self-end text-xs font-bold">
                Building a financial model
              </div>
              <div className="text-xs cursor-pointer link" href="#">
                View project &#8594;
              </div>
            </div>
          </div>
          <div className="text-xs">12 Jun</div>
        </div>

        <div className="flex space-x-3 justify-between">
          <div className="flex space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mt-1 fill-current text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <div className="justify-self-end text-xs font-bold">
                Building a financial model
              </div>
              <div className="text-xs cursor-pointer link" href="#">
                View project &#8594;
              </div>
            </div>
          </div>
          <div className="text-xs">12 Jun</div>
        </div>

        <div className="flex space-x-3 justify-between">
          <div className="flex space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mt-1 fill-current text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>

            <div>
              <div className="justify-self-end text-xs font-bold">
                Building a financial model
              </div>
              <div className="text-xs cursor-pointer link" href="#">
                View project &#8594;
              </div>
            </div>
          </div>
          <div className="text-xs">12 Jun</div>
        </div>

        <div className="flex space-x-3 justify-between">
          <div className="flex space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mt-1 fill-current text-red-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                clip-rule="evenodd"
              />
            </svg>
            <div>
              <div className="justify-self-end text-xs font-bold text-red-700">
                Building a financial model
              </div>
            </div>
          </div>
          <div className="text-xs">12 Jun</div>
        </div>
      </div>
    </div>
  );
}

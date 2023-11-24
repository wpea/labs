export default function Verify() {

    const verifyToken = () => {
        //
    }

    return (
      <>
        <div className="grid place-items-center h-screen">
          <div className="w-72 space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Enter OTP to continue
              </div>
              <input
                type="text"
                name="buy_price"
                required
                //   value={formData.buy_price}
                //   onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-0 sm:text-sm"
              />
              <button
                type="submit"
                onClick={() => verifyToken()}
                className="btn bg-cyan-600 border-none hover:bg-cyan-800 btn-sm"
              >
                Verify
              </button>
            </div>
            <div className="flex items-center justify-between space-x-10 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-10"
              >
                <path
                  fillRule="evenodd"
                  d="M9.661 2.237a.531.531 0 01.678 0 11.947 11.947 0 007.078 2.749.5.5 0 01.479.425c.069.52.104 1.05.104 1.59 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 01-.332 0C5.26 16.564 2 12.163 2 7c0-.538.035-1.069.104-1.589a.5.5 0 01.48-.425 11.947 11.947 0 007.077-2.75zm4.196 5.954a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>

              <div className="text-[10px]">
                If you experience any issues getting past this, contact
                <a href="mailto:dev@wealthparadigm.org">&nbsp;
                  dev@wealthparadigm.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
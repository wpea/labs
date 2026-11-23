import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ActionDialog({
  title,
  open,
  onClose,
  busy,
  children,
  tabs,
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          if (!busy) onClose();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="lg:w-1/4 md:w-1/2 w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {tabs}
                <div className="p-6 space-y-6">
                  <div className="mt-3 flex items-center justify-between sm:mt-1">
                    <Dialog.Title
                      className={`${
                        tabs ? "text-sm" : "text-lg"
                      } font-bold leading-6 text-gray-900`}
                    >
                      {title}
                    </Dialog.Title>
                    <button
                      type="button"
                      aria-label="Close"
                      disabled={busy}
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

import { Dialog } from "@headlessui/react";
export default function ActionDialog({ title, open, onClose, busy, children }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 py-10 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
        <div className="relative w-full max-w-xl rounded-xl bg-white p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-ibm text-2xl">{title}</Dialog.Title>
            <button
              aria-label="Close"
              disabled={busy}
              onClick={onClose}
              className="p-2 text-xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </Dialog>
  );
}

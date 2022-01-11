export default function Stats() {
  return (
    <div className="border rounded-lg place-self-start w-full">
      <div className="border-b grid grid-cols-2">
        <div className="p-4 font-bold text-sm">Stats</div>
      </div>

      <div>
        <div className="flex justify-between border-b p-4 hover:bg-gray-100 cursor-pointer bg-gray-100">
          <div className="tracking-tight">All Projects</div>
          <div className="font-bold text-blue-600">9</div>
        </div>
        <div className="flex justify-between border-b p-4 hover:bg-gray-100 cursor-pointer">
          <div className="tracking-tight">Ongoing Projects</div>
          <div className="font-bold text-yellow-600">6</div>
        </div>
        <div className="flex justify-between border-b p-4 hover:bg-gray-100 cursor-pointer">
          <div className="tracking-tight">Completed Projects</div>
          <div className="font-bold text-green-700">2</div>
        </div>
      </div>
    </div>
  );
}

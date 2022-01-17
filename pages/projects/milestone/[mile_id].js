import { useRouter } from "next/router"
import md5 from "md5";
import Home from "../..";

export default function Milestones() {
    const router = useRouter();
    const { mile_id } = router.query;

    return (
        <Home>
            <div className="border rounded-lg lg:col-span-2 place-self-start w-full">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text- tracking-tight">Research and present a report about various models {mile_id}</div>
                    </div>
                </div>
                <div className="p-4 space-y-10 border-t rounded-bl-md rounded-br-md hover:bg-gray-100">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 mb-16">
                            <div className="font-bold">Tasks</div>
                            <button className="text-sm btn btn-sm btn-outline justify-self-end">+ new task</button>
                        </div>

                        <div className="grid grid-cols-2 bg-stone-600 p-3 pb-4 px-4 rounded-md hover:bg-blue-stone">
                            <div className="self-start place-self-start grid space-y-2">
                                <div className="text-white leading-5 text-md">Research and present a report about various models</div>
                                <div className="self-start place-self-start bg-stone-200 rounded-md px-1 text-stone-800 text-xs grid grid-cols-2">
                                    <div className="grid">
                                        <div className="justify-self-center p-1 pr-2">Start <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                    <div className="border-l border-stone-600 grid">
                                        <div className="justify-self-center p-1 pl-2">End <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="justify-self-end self-start flex items-center space-x-2">
                                <div className="text-2xs border items-center cursor-pointer hover:bg-stone-800 hover:border-none space-x-1 flex border-stone-500 rounded-md px-2 py-1 text-white font-medium uppercase">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>Mark as completed</div>
                                </div>
                                <div className="bg-rose-500 p-0.5 cursor-pointer hover:bg-rose-700 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-current text-rose-100 hover:text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Home>
    )
}
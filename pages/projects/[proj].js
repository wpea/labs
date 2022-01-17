import { useRouter } from 'next/router';
import Home from '..';

export default function Project() {
    const router = useRouter();
    const { proj } = router.query;
    const id = 1;
    return (
        <Home>
            <div className="border rounded-lg lg:col-span-2 place-self-start w-full">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-xl tracking-tight">Financial Modelling for WP</div>
                        <div className="text-2xs font-medium"><span className="text-green-600">&bull;</span> Lead (Alex)</div>
                    </div>
                </div>
                <div className="p-4 space-y-10 border-t rounded-bl-md rounded-br-md hover:bg-gray-100">
                    <div className="grid grid-cols-2 rounded-md hover:bg-blue-green cursor-pointer">
                        <div>
                            <div className="text-sm">Starts</div>
                            <div className="text-xs font-medium">Monday, 12th Jan, 2021</div>
                        </div>

                        <div className="justify-self-end">
                            <div className="text-right text-sm">Ends</div>
                            <div className="text-xs font-medium">Monday, 12th Mar, 2021</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 mb-16">
                            <div className="font-bold text-lg">Milestones</div>
                            <button className="text-sm btn btn-sm btn-outline justify-self-end">+ Add a milestone</button>
                        </div>

                        <div onClick={() => router.push(`/projects/milestone/${id}`)} className="grid grid-cols-2 bg-cyan-600 hover:bg-cyan-700 p-3 px-4 rounded-md hover:bg-blue-cyan cursor-pointer">
                            <div className="self-start place-self-start grid space-y-2">
                                <div className="text-white leading-5">Research and present a report about various models</div>
                                <div className="self-start place-self-start bg-cyan-200 rounded-md px-1 text-cyan-800 text-xs grid grid-cols-2">
                                    <div className="grid">
                                        <div className="justify-self-center p-1 pr-2">Start <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                    <div className="border-l border-cyan-600 grid">
                                        <div className="justify-self-center p-1 pl-2">End <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="justify-self-end self-start flex items-center space-x-2">
                                <div className="text-2xs border items-center cursor-pointer hover:bg-cyan-800 hover:border-none space-x-1 flex border-cyan-500 rounded-md px-2 py-1 text-white font-medium uppercase">
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

                        <div className="grid grid-cols-2 bg-cyan-600 hover:bg-cyan-700 p-3 px-4 rounded-md hover:bg-blue-cyan cursor-pointer">
                            <div className="self-start place-self-start grid space-y-2">
                                <div className="text-white leading-5">Discuss financial models</div>
                                <div className="self-start place-self-start bg-cyan-200 rounded-md px-1 text-cyan-800 text-xs grid grid-cols-2">
                                    <div className="grid">
                                        <div className="justify-self-center p-1 pr-2">Start <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                    <div className="border-l border-cyan-600 grid">
                                        <div className="justify-self-center p-1 pl-2">End <span className="font-bold">Mar, 12 2022</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="justify-self-end self-start flex items-center space-x-2">
                                <div className="text-2xs border items-center cursor-pointer hover:bg-cyan-800 hover:border-none space-x-1 flex border-cyan-500 rounded-md px-2 py-1 text-white font-medium uppercase">
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
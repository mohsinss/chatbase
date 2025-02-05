'use client'

import Script from 'next/script';
import { useEffect } from 'react';
import toast from 'react-hot-toast';


interface CodeEvent {
    token: string;
    data: any;
    message: string;
}

export default function Home() {
    const device = "380663761344"
    // useEffect(() => {
    //     const socket = io('https://chatbase-socket-nqyw.onrender.com', {
    //         transports: ['websocket'], // Force WebSocket transport
    //     });

    //     socket.emit('StartConnection', device);
    //     socket.on('code', ({ token, data, message }: CodeEvent) => {
    //         console.log("I am here")
    //         if (token === device) {
    //             console.log('code',data, message)
    //         }
    //     });

    //     socket.on('connection-open', ({
    //         token,
    //         user,
    //         ppUrl
    //     }) => {
    //         if (token == device) {
    //             console.log('connection-open', token, user, ppUrl)
    //         }
    //     })

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);
    useEffect(() => {
        //@ts-ignore
        window.toast = toast;
        //@ts-ignore
        window.PDF2MD_TRIEVE_KEY = process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY;
    }, [])
    return (
        <>
            <div id="upload-form-container" className=" flex justify-center items-center px-4 mt-10 sm:mt-14 md:mt-24">
                <form className="max-w-2xl mx-auto">
                    <div className="text-center hidden">
                        <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                            OCR With Intelligence
                        </h2>
                        <p className="mt-2 text-pretty text-lg/8 text-gray-700">
                            Convert any PDF to LLM-ready Markdown using thrifty vision models like
                            GPT-4o-mini and Gemini-flash-1.5.
                        </p>
                    </div>
                    <button id="expand-advanced-options" className="hidden w-full flex justify-center items-center gap-x-2 my-2 text-gray-600 text-sm/5">
                        <p>Advanced Options: Change Model + Prompt</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"></path>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up hidden" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"></path>
                        </svg>
                    </button>
                    <div id="advanced-options-inputs" className="hidden">
                        <label htmlFor="model" className="block text-sm/6 font-medium text-gray-900">Model</label>
                        <select id="model" name="model" className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 bg-white ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-magenta-600 sm:text-sm/6">
                            <option value="openai/gpt-4o-mini" selected={true}>
                                4o-mini ($0.15/M input)
                            </option>
                            <option value="google/gemini-flash-1.5-8b">
                                gemini-flash-1.5-8b ($0.0375/M input)
                            </option>
                            <option value="google/gemini-flash-1.5">
                                gemini-flash-1.5 ($0.075/M input)
                            </option>
                            <option value="Chunkr">chunkr</option>
                        </select>
                        <label htmlFor="conversion-prompt" className="block text-sm/6 font-medium text-gray-900 mt-2">Conversion prompt</label>
                        <div className="mt-2">
                            <textarea rows={4} name="conversion-prompt" id="conversion-prompt" className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-magenta-600 sm:text-sm/6">Convert the following PDF page to markdown. Return only the markdown with no explanation text. Do not exclude any content from the page.</textarea>
                        </div>
                    </div>
                    <div id="drop-zone" className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd"></path>
                            </svg>
                            <div className="mt-4 flex text-sm/6 text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-magenta-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-magenta-600 focus-within:ring-offset-2 hover:text-magenta-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs/5 text-gray-600">PDF</p>
                        </div>
                    </div>
                    <div id="example-buttons-container" className="hidden flex flex-wrap gap-2 mt-2 w-full justify-center items-center">
                        <button className="hover:border-magenta-500 border">
                            <img src="https://cdn.trieve.ai/pdf2md/satellite-market-data-statista.webp" className="w-28" />
                        </button>
                        <button className="hover:border-magenta-500 border">
                            <img src="https://cdn.trieve.ai/pdf2md/bitcoin-whitepaper-diagram.webp" className="w-28" />
                        </button>
                        <button className="hover:border-magenta-500 border">
                            <img src="https://cdn.trieve.ai/pdf2md/clutch-install-guide-sscycle.webp" className="w-28" />
                        </button>
                        <button className="hover:border-magenta-500 border">
                            <img src="https://cdn.trieve.ai/pdf2md/xerox-ui-patent-pg15.webp" className="w-28" />
                        </button>
                        <button className="hover:border-magenta-500 border">
                            <img src="https://cdn.trieve.ai/pdf2md/LightGBM%20-%20A%20Highly-Efficient%20Gradient%20Boosting%20Decision%20Tree%20(2017)-pages.webp" className="w-28" />
                        </button>
                    </div>
                </form>
            </div>
            <div id="utility-results-view" className='hidden px-4 mt-10 sm:mt-14 md:mt-24 max-w-screen-2xl mx-auto'>
                <div className="col-span-2 flex justify-between items-center py-1">
                    <p id="document-price" className="text-gray-600 text-sm/6"> </p>
                    <div className="flex items-center gap-2">
                        <button type="button" className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600" id="copy-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"></path>
                            </svg>
                            Copy
                        </button>
                        <div className="flex items-center">
                            <button type="button" className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:ring-offset-2" role="switch" aria-checked="false" aria-labelledby="json" id="json-switch">
                                <span aria-hidden="true" className="pointer-events-none inline-block size-5 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>
                            <span className="ml-3 text-sm" id="json">
                                <span className="font-medium text-gray-900">Json</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div id="result-container" className="grid grid-cols-2 gap-4 border border-gray-900">
                    <div id="my-pdf" className="pdfobject-container"></div>
                    <div id="markdown-container" className="max-h-[75vh] overflow-y-auto" data-task-id="29ad3eeb-3c1c-48ba-8ee2-08ec2bb7f8ab" data-task-status="Completed" data-task-pages-processed="490">
                    </div>
                    <pre id="json-pre" className="hidden max-h-[75vh] overflow-y-auto">
                        <code className="language-json hljs" id="json-container" data-highlighted="yes">
                        </code>
                    </pre>
                </div>
            </div>
            <div id="task-status-table-container" className="hidden my-12 sm:my-24 md:my-50 max-w-screen-2xl mx-auto px-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Task ID
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        File Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Prompt Tokens
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Completion Tokens
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="task-id whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"></td>
                                    <td className="task-file-name whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="task-status whitespace-nowrap px-3 py-4 text-sm text-gray-500 status-completed"></td>
                                    <td className="task-prompt-tokens whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="task-completion-tokens whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <button className="task-view-button text-magenta-600 hover:text-magenta-900">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Script
                src={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}/pdf2md.js`} />
        </>
    );
}

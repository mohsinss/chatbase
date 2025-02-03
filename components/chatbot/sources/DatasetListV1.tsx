'use client'

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        PDF2MD_TRIEVE_KEY: string;
    }
}

interface DatasetListProps {
    teamId: string;
    chatbotId: string;
    datasetId: string;
    uploading: boolean;
    setFileCount: (value: number | ((prevState: number) => number)) => void;
    setFileChars: (value: number | ((prevState: number) => number)) => void;
    setFileSize: (value: number | ((prevState: number) => number)) => void;
    onDelete?: () => void;
}

interface Task {
    id: string;
    file_name: string;
    status: string;
    pages: Page[];
    pages_processed: number;
}

interface Page {
    page_num: number;
    content: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
    };
}

export function DatasetListV1({ teamId, chatbotId, onDelete, datasetId, uploading, setFileCount, setFileSize, setFileChars }: DatasetListProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    const markdownContainerRef = useRef<HTMLDivElement>(null);
    const jsonContainerRef = useRef<HTMLPreElement>(null);
    const fileUploadInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const advancedOptionsButtonRef = useRef<HTMLButtonElement>(null);
    const jsonSwitchRef = useRef<HTMLButtonElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        //@ts-ignore
        window.toast = toast;
        //@ts-ignore
        window.PDF2MD_TRIEVE_KEY = process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY;

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (dropZoneRef.current) {
                dropZoneRef.current.style.borderColor = "rgba(17, 24, 39, 0.25)";
            }

            const dt = e.dataTransfer;
            const files = dt?.files;

            if (files && files.length && fileUploadInputRef.current) {
                const file = files[0];

                if (file.type === "application/pdf") {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileUploadInputRef.current.files = dataTransfer.files;

                    const event = new Event("change", { bubbles: true });
                    fileUploadInputRef.current.dispatchEvent(event);
                } else {
                    alert("Please upload a PDF file.");
                }
            }
        };

        if (dropZoneRef.current) {
            dropZoneRef.current.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dropZoneRef.current) {
                    dropZoneRef.current.style.borderColor = "#a33eb5";
                }
            });

            dropZoneRef.current.addEventListener("dragleave", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dropZoneRef.current) {
                    dropZoneRef.current.style.borderColor = "rgba(17, 24, 39, 0.25)";
                }
            });

            dropZoneRef.current.addEventListener("drop", handleDrop);
        }

        return () => {
            if (dropZoneRef.current) {
                dropZoneRef.current.removeEventListener("drop", handleDrop);
            }
        };
    }, []);

    // Define the handlers outside of the JSX
    const handleJsonSwitchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const jsonSwitch = e.currentTarget;
        const jsonPre = document.getElementById("json-pre");
        const markdownContainer = document.getElementById("markdown-container");

        if (jsonSwitch.classList.contains("bg-purple-600")) {
            jsonSwitch.classList.remove("bg-purple-600");
            jsonSwitch.classList.add("bg-gray-200");
            jsonSwitch.querySelector("span").classList.remove("translate-x-5");
            jsonSwitch.querySelector("span").classList.add("translate-x-0");
            jsonPre.classList.add("hidden");
            markdownContainer.classList.remove("hidden");
        } else {
            jsonSwitch.classList.add("bg-purple-600");
            jsonSwitch.classList.remove("bg-gray-200");
            jsonSwitch.querySelector("span").classList.add("translate-x-5");
            jsonSwitch.querySelector("span").classList.remove("translate-x-0");
            jsonPre.classList.remove("hidden");
            markdownContainer.classList.add("hidden");
        }
    };

    const handleCopyButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const jsonSwitch = document.getElementById("json-switch");
        const jsonPre = document.getElementById("json-pre");
        const markdownContainer = document.getElementById("markdown-container");

        let textToCopy = "";
        if (jsonSwitch.classList.contains("bg-purple-600")) {
            textToCopy = jsonPre.innerText;
        } else {
            textToCopy = markdownContainer.innerText;
        }
        navigator.clipboard.writeText(textToCopy);

        toast.success(`Copied ${jsonSwitch.classList.contains("bg-purple-600") ? "JSON" : "Markdown"
            } to clipboard!`);
    };

    interface FormData {
        file_name: string;
        base64_file: string;
        provider: string;
        llm_model: string;
        system_prompt?: string;
    }

    const fileUpload = (e: React.MouseEvent<HTMLInputElement>): void => {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            console.error("No file selected");
            return;
        }

        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result as string;
            const base64_file = result.split(",")[1];

            const modelSelect = document.getElementById("model") as HTMLSelectElement;
            const model = modelSelect.options[modelSelect.selectedIndex].value;

            const conversionPromptTextarea = document.getElementById("conversion-prompt") as HTMLTextAreaElement;
            const conversionPrompt = conversionPromptTextarea.value;

            const provider = model === "Chunkr" ? "Chunkr" : "LLM";

            const formData: FormData = {
                file_name: file.name,
                base64_file,
                provider,
                llm_model: model,
                system_prompt: conversionPrompt || undefined,
            };

            fetch("https://pdf2md.trieve.ai/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: window.PDF2MD_TRIEVE_KEY,
                },
                body: JSON.stringify(formData),
            })
                .then((response: Response) => response.json())
                .then((data: Task) => {
                    toast.success("File uploaded! We are processing the file. Please wait. Scroll down to the table to view the status.");

                    upsertTaskToStorage(data);
                    const url = new URL(window.location.href);
                    url.searchParams.set("taskId", data.id);
                    window.history.pushState({}, "", url);
                })
                .catch((error: Error) => {
                    toast.error(`Error uploading file. Please try again later. ${error.message}`);
                });
        };

        reader.readAsDataURL(file);
    };

    const upsertTaskToStorage = (task: Task) => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const updatedTasks = storedTasks.find((t: Task) => t.id === task.id)
            ? storedTasks.map((t: Task) => (t.id === task.id ? task : t))
            : [task, ...storedTasks];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        updateTaskStatusTable();
    };


    const displayTask = (task: Task) => {
        if (!markdownContainerRef.current || !jsonContainerRef.current) return;

        const markdownContainer = markdownContainerRef.current;
        const jsonContainer = jsonContainerRef.current;

        const taskId = markdownContainer.getAttribute("data-task-id");
        const taskStatus = markdownContainer.getAttribute("data-task-status");
        const taskNumPagesProcessed = markdownContainer.getAttribute("data-task-pages-processed");

        if (
            taskId === task.id &&
            taskStatus === task.status &&
            taskNumPagesProcessed === task.pages_processed.toString()
        ) {
            console.log("Task already displayed", task.id);
            return;
        }

        const pages = task.pages;
        if (!pages) return;

        const sortedPages = pages.sort((a, b) => a.page_num - b.page_num);

        jsonContainer.innerText = JSON.stringify(task, null, 2);

        //@ts-ignore
        PDFObject.embed(task.file_url, "#my-pdf", {
            pdfOpenParams: {
                view: "FitH",
            },
        });

        const utilityResultsView = document.getElementById("utility-results-view");
        if (utilityResultsView) {
            utilityResultsView.classList.remove("hidden");
        }

        const resultContainer = document.getElementById("result-container");
        if (resultContainer) {
            resultContainer.classList.add("border", "border-gray-900");
        }

        while (markdownContainer.firstChild) {
            markdownContainer.removeChild(markdownContainer.firstChild);
        }

        markdownContainer.setAttribute("data-task-id", task.id);
        markdownContainer.setAttribute("data-task-status", task.status);
        markdownContainer.setAttribute("data-task-pages-processed", task.pages_processed.toString());

        let completionTokens = 0;
        let promptTokens = 0;

        sortedPages.forEach((page) => {
            const pageContainer = document.createElement("div");
            pageContainer.classList.add("page-container");
            pageContainer.innerText = page.content;
            markdownContainer.appendChild(pageContainer);
            const spacerDiv = document.createElement("div");
            spacerDiv.classList.add("my-4", "h-1", "bg-gray-700");
            markdownContainer.appendChild(spacerDiv);

            promptTokens += page?.usage?.prompt_tokens || 0;
            completionTokens += page?.usage?.completion_tokens || 0;
        });

        if (task.status?.toLowerCase() === "failed") {
            const pageContainer = document.createElement("div");
            pageContainer.classList.add("page-container", "animate-pulse", "pt-4");
            pageContainer.innerText = "Something went wrong, please check your file.";
            markdownContainer.appendChild(pageContainer);
            return;
        }

        if (!sortedPages.length) {
            const pageContainer = document.createElement("div");
            pageContainer.classList.add("page-container", "animate-pulse", "pt-4");
            pageContainer.innerText =
                "Your file is being converted. We are pinging the server every 5 seconds to check for status updates. See the table below for more detailed status information. Please be patient!";
            markdownContainer.appendChild(pageContainer);
        }
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const getTaskPages = async (taskId: string, taskIdToDisplay: string | null) => {
        if (!taskId) return;

        try {
            let paginationToken = "";
            let task: Task | null = null;
            let pages: Page[] = [];
            while (true) {
                await wait(5000);
                const resp = await fetch(
                    `https://pdf2md.trieve.ai/api/task/${taskId}${paginationToken ? `?pagination_token=${paginationToken}` : ""}`,
                    {
                        headers: {
                            Authorization: window.PDF2MD_TRIEVE_KEY,
                        },
                    }
                );
                if (!resp.ok) {
                    throw new Error(`HTTP error! status: ${resp.status}`);
                }
                const taskWithPages = await resp.json();
                task = taskWithPages;
                pages.push(...(taskWithPages.pages ?? []));
                paginationToken = taskWithPages.pagination_token;
                if (!paginationToken) break;
            }

            pages = pages.sort((a, b) => a.page_num - b.page_num);
            if (task) {
                task.pages = pages;
                upsertTaskToStorage(task);
                if (taskIdToDisplay === taskId) {
                    displayTask(task);
                }
            }
        } catch (e) {
            console.error(e);
            toast.error(`Error fetching task pages. Please try again later. ${e}`);
        }
    };

    const updateTaskStatusTable = () => {
        if (tasks.length == 0) {
            return;
        }
        const tableContainer = document.getElementById("task-status-table-container");
        if (!tableContainer) return;

        const tbody = tableContainer.querySelector("tbody");
        if (!tbody) return;

        const firstRow = tbody.querySelector("tr");
        tbody.innerHTML = "";

        const handleRowButtonClick = (task: Task) => {
            console.log('handleRowButtonClick', task.id)
            const url = new URL(window.location.href);
            url.searchParams.set("taskId", task.id);
            window.history.pushState({}, "", url);
            setActiveTaskId(task.id);
            displayTask(task);
        };

        const htmlRows = tasks.map((task) => {
            let completionTokens = 0;
            let promptTokens = 0;
            task.pages?.forEach((page) => {
                promptTokens += page?.usage?.prompt_tokens || 0;
                completionTokens += page?.usage?.completion_tokens || 0;
            });

            const row = (firstRow ? firstRow.cloneNode(true) : document.createElement("tr")) as Element;
            row.querySelector(".task-id")!.textContent = task.id;
            row.querySelector(".task-file-name")!.textContent = task.file_name;
            row.querySelector(".task-status")!.textContent =
                task.status?.toLowerCase() === "completed"
                    ? task.status
                    : task.status?.toLowerCase() === "failed"
                        ? task.status
                        : `${task.status} | Please wait. Checking for updates every 5 seconds.`;
            row.querySelector(".task-status")!.classList.add(`status-${task.status?.split(" ").join("-").toLowerCase()}`);
            row.querySelector(".task-prompt-tokens")!.textContent = promptTokens.toString();
            row.querySelector(".task-completion-tokens")!.textContent = completionTokens.toString();
            row.querySelector(".task-prompt-tokens").classList.add('hidden')
            row.querySelector(".task-completion-tokens").classList.add('hidden')

            // row.querySelector("button")!.addEventListener("click", () => {
            //     const url = new URL(window.location.href);
            //     url.searchParams.set("taskId", task.id);
            //     window.history.pushState({}, "", url);
            //     setActiveTaskId(task.id);
            //     displayTask(task);
            // });
            row.querySelector("button")!.onclick = () => handleRowButtonClick(task);

            return row;
        });

        htmlRows.forEach((row) => tbody.appendChild(row));

        if (htmlRows.length) {
            tableContainer.classList.remove("hidden");
            tableContainer.classList.add("flow-root");
            const formContainer = document.getElementById("upload-form-container");
            if (formContainer) {
                formContainer.classList.remove("mt-[10vh]", "sm:mt-[20vh]");
                formContainer.classList.add("mt-10", "sm:mt-14", "md:mt-24");
            }
        }
    };

    const refreshTasks = () => {
        const url = new URL(window.location.href);
        const taskIdToDisplay = url.searchParams.get("taskId");
        tasks.forEach((task) => {
            if (
                task.status?.toLowerCase() === "completed" &&
                task.pages &&
                task.pages.length
            ) {
                return;
            }
            if (task.status?.toLowerCase() === "failed") {
                return;
            }

            getTaskPages(task.id, taskIdToDisplay);
        });
    };

    useEffect(() => {
        const interval = setInterval(refreshTasks, 5000);
        return () => clearInterval(interval);
    }, [tasks]);

    const setActiveTaskFromUrl = () => {
        const url = new URL(window.location.href);
        const taskId = url.searchParams.get("taskId");
        if (taskId) {
            setActiveTaskId(taskId);
            getTaskPages(taskId, taskId);
        }
    };

    useEffect(() => {
        updateTaskStatusTable();
        setActiveTaskFromUrl();
    }, [tasks]);

    useEffect(() => {
        setTasks(JSON.parse(localStorage.getItem("tasks")) || [])
    }, [])

    return (
        <>
            <div id="upload-form-container" className="flex justify-center items-center px-4 mt-10 sm:mt-14 md:mt-24">
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
                    <button id="expand-advanced-options" ref={advancedOptionsButtonRef} className="hidden w-full flex justify-center items-center gap-x-2 my-2 text-gray-600 text-sm/5">
                        <p>Advanced Options: Change Model + Prompt</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"></path>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up hidden" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"></path>
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
                    <div id="drop-zone" ref={dropZoneRef} className="mt-4 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd"></path>
                            </svg>
                            <div className="mt-4 flex text-sm/6 text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-magenta-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-magenta-600 focus-within:ring-offset-2 hover:text-magenta-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" onClick={e => fileUpload(e)} ref={fileUploadInputRef} name="file-upload" type="file" accept=".pdf" className="sr-only" />
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
                        <button 
                            onClick={handleCopyButtonClick}
                            type="button" ref={copyButtonRef} 
                            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600" 
                            id="copy-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"></path>
                            </svg>
                            Copy
                        </button>
                        <div className="flex items-center">
                            <button 
                                onClick={handleJsonSwitchClick}
                                type="button" ref={jsonSwitchRef}
                                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:ring-offset-2" 
                                role="switch" aria-checked="false" aria-labelledby="json" id="json-switch">
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
                    <div id="markdown-container" ref={markdownContainerRef} className="max-h-[75vh] overflow-y-auto" data-task-id="29ad3eeb-3c1c-48ba-8ee2-08ec2bb7f8ab" data-task-status="Completed" data-task-pages-processed="490">
                    </div>
                    <pre id="json-pre" ref={jsonContainerRef} className="hidden max-h-[75vh] overflow-y-auto">
                        <code className="language-json hljs" id="json-container" data-highlighted="yes">
                        </code>
                    </pre>
                </div>
            </div>
            <div id="task-status-table-container" className="max-w-[580px] hidden my-12 sm:my-24 md:my-50 mx-auto flow-root">
                <div className="-my-2 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <table className="divide-y divide-gray-300 overflow-y-scroll mx-auto">
                            <thead>
                                <tr>
                                    <th scope="col" className="hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Task ID
                                    </th>
                                    <th scope="col" className="max-w-[400px] px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        File Name
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Prompt Tokens
                                    </th>
                                    <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Completion Tokens
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">View</span>
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">View</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="hidden task-id whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"></td>
                                    <td className="task-file-name max-w-[400px] whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="task-status whitespace-nowrap px-3 py-4 text-sm text-gray-500 status-completed"></td>
                                    <td className="hidden task-prompt-tokens whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="hidden task-completion-tokens whitespace-nowrap px-3 py-4 text-sm text-gray-500"></td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                        <button className="task-view-button text-magenta-600 hover:text-magenta-900">
                                            View
                                        </button>
                                    </td>
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
            {/* <Script */}
            {/* src={`${process.env.NODE_ENV === 'development' ? 'http:' : 'https:'}//${process.env.NEXT_PUBLIC_DOMAIN}/pdf2md.js`} /> */}
        </>
    );
}
"use client";

import { useState, useEffect, Fragment } from "react";
import { Switch, Menu, Transition } from "@headlessui/react";
import { IconInfoCircle, IconCopy } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { QRCodeCanvas } from 'qrcode.react';
import { IndentDecrease } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Spinner from "@/components/Spinner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const MessengerManagement = ({ chatbotId, domain, teamId }:
    {
        chatbotId: string,
        domain: string,
        teamId: string
    }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFetchingPage, setIsFetchingPage] = useState(true);
    const [pages, setPages] = useState([]);
    const [deletePage, setDeletePage] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [isFetchingSettings, setIsFetchingSettings] = useState(false);
    const [settingsData, setSettingsData] = useState<{
        prompt?: string;
        delay?: number;
        prompt1?: string;
        delay1?: number;
        commentDmEnabled?: boolean;
        welcomeDmEnabled?: boolean;
        welcomeDmPrompt?: string;
        welcomeDmDelay?: number;
        replyDmEnabled?: boolean;
        replyDmPrompt?: string;
        replyDmDelay?: number;
        keywordDmEnabled?: boolean;
        keywordTriggers?: Array<{ keyword: string; prompt: string; delay?: number }>;
        likeDmEnabled?: boolean;
        likeDmPrompt?: string;
        likeDmDelay?: number;
        likeDmFirstOnly?: boolean;
        likeDmSpecificPosts?: Array<{ postUrl: string; prompt?: string; delay?: number }>;
    } | null>(null);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (selectedPageId)
            fetchSettings(selectedPageId);
    }, [selectedPageId]);

    useEffect(() => {
        if (!isSettingsDialogOpen) {
            setSelectedPageId(null);
        }
    }, [isSettingsDialogOpen]);

    const handleSettingsMenu = (id: string) => {
        setIsSettingsDialogOpen(true);
        setSelectedPageId(id);
    };

    const fetchSettings = async (id: string) => {
        setIsFetchingSettings(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/facebook-page/settings?_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch settings");
            }

            const data = await response.json();
            setSettingsData(data);
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to fetch settings.");
        }
        setIsFetchingSettings(false);
    };

    const saveSettings = async () => {
        setIsSavingSettings(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/facebook-page/settings?_id=${selectedPageId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...settingsData
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to save settings");
            }

            toast.success("Settings saved successfully!");
            setIsSettingsDialogOpen(false);
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
        setIsSavingSettings(false);
    };

    const fetchPages = async () => {
        setIsFetchingPage(true)
        try {
            const response = await fetch(`/api/chatbot/integrations/facebook-page?chatbotId=${chatbotId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch pages");
            }

            const data = await response.json();
            if (data.length == 0) {
                router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`);
                router.refresh();
                return;
            }
            setPages(data);
        } catch (error) {
            console.error("Error fetching FB pages:", error);
        }
        setIsFetchingPage(false)
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const fbLoginCallbackForFB = (response: any) => {
        if (response.authResponse) {
            const code = response.authResponse.code;

            fetch("/api/chatbot/integrations/facebook-page/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    chatbotId
                }),
            }).then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then((data) => {
                    setIsConnecting(false);
                    fetchPages();
                    toast.success("Successfully connected to Messenger!");
                })
                .catch((error) => {
                    setIsConnecting(false);
                    console.error("Error saving FB page credentials:", error);
                    toast.error("Failed to save FB page. Please check integration guide again.");
                });
        } else {
            console.log(response);
            toast.error("Sth went wrong.");
            setIsConnecting(false);
        }
    }

    const handleConnect = () => {
        setIsConnecting(true);

        window.FB.login(fbLoginCallbackForFB, {
            config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_PAGE, // configuration ID goes here
            response_type: 'code', // must be set to 'code' for System User access token
            override_default_response_type: true, // when true, any response types passed in the "response_type" will take precedence over the default types
            extras: {
                setup: {},
                featureType: '',
                sessionInfoVersion: '2',
            }
        });
    }

    const handleDeleteMenu = (page: any) => () => {
        setDeletePage(page);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = async () => {
        if (!deletePage)
            return;
        console.log('handleDelete', deletePage);
        setIsConnecting(true);
        try {
            const response = await fetch("/api/chatbot/integrations/facebook-page", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pageId: deletePage?.pageId,
                    chatbotId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete FB Page");
            }

            toast.success("Successfully delete FB Page!");
        } catch (error) {
            console.error("Error deleting FB Page:", error);
            toast.error("Failed to delete FB Page.");
        }

        fetchPages();
        setIsConnecting(false);
        setIsDeleteDialogOpen(false);
    }

    return (
        <div>
            <div className="flex flex-row items-center gap-2 pb-4">
                <Link
                    href={`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`}
                    className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    Integrations
                </Link>
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <div className="text-gray-900 font-bold">
                    Messenger
                </div>
            </div>
            {isFetchingPage ?
                <div className="rounded-md border-1 border-[1px] border-gray-200 p-6">Fectching pages...</div>
                :
                <>
                    <div className="rounded-md border-1 border-[1px] border-gray-200 mb-4">
                        <div className="p-4">
                            <h2 className="text-xl font-extrabold text-gray-900">Connected Facebook Pages</h2>

                        </div>
                        <table className="min-w-full divide-y divide-gray-200 mt-4">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Page Id
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">

                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pages?.map((page) => (
                                    <tr key={`pageTR-${page.pageId}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.pageId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <div className="z-10">
                                                    <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                                        <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32.055 32.055" xmlSpace="preserve">
                                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                                                            </g>
                                                            <g id="SVGRepo_iconCarrier"> <g> <path d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967 s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967 c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z">
                                                            </path>
                                                            </g>
                                                            </g>
                                                        </svg>
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute z-20 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={() => handleSettingsMenu(page._id)}
                                                                    >
                                                                        Advanced Settings
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                                            } flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={handleConnect}
                                                                    >
                                                                        Reconnect
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`${active ? 'bg-gray-100 text-red-900 ' : 'text-red-700'
                                                                            } flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={handleDeleteMenu(page)}
                                                                    >
                                                                        Delete
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end p-4">
                            <button
                                className="mt-4 disabled:opacity-50 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded"
                                onClick={handleConnect}
                                disabled={isConnecting}>
                                Connect a new page
                            </button>
                        </div>
                    </div>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Facebook page</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this facebook page?.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isConnecting}
                                >
                                    {isConnecting ? "Deleting" : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Messenger Integration Settings</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Manage your Messenger integration settings here.
                                </DialogDescription>
                            </DialogHeader>

                            {isFetchingSettings ? (
                                <div className="flex justify-center items-center py-8">
                                    <Spinner />
                                </div>
                            ) : settingsData ? (
                                <div className="flex flex-col gap-6 py-4">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messenger Settings</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Prompt</label>
                                                <textarea
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                                    value={settingsData.prompt}
                                                    onChange={(e) => setSettingsData({ ...settingsData, prompt: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                                                <input
                                                    type="number"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={settingsData.delay}
                                                    onChange={(e) => setSettingsData({ ...settingsData, delay: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Settings</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Prompt</label>
                                                <textarea
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                                    value={settingsData.prompt1}
                                                    onChange={(e) => setSettingsData({ ...settingsData, prompt1: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                                                <input
                                                    type="number"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={settingsData.delay1}
                                                    onChange={(e) => setSettingsData({ ...settingsData, delay1: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment-Triggered DMs</h3>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={settingsData.commentDmEnabled}
                                                        onChange={(enabled) => setSettingsData({ ...settingsData, commentDmEnabled: enabled })}
                                                        className={`${settingsData.commentDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                    >
                                                        <span className={`${settingsData.commentDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                    </Switch>
                                                    <span className="text-sm font-medium text-gray-700">Enable Comment-Triggered DMs</span>
                                                </div>
                                            </div>

                                            <div className={`space-y-6 ${!settingsData.commentDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={settingsData.welcomeDmEnabled}
                                                                onChange={(enabled) => setSettingsData({ ...settingsData, welcomeDmEnabled: enabled })}
                                                                className={`${settingsData.welcomeDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                            >
                                                                <span className={`${settingsData.welcomeDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                            </Switch>
                                                            <span className={`text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Send Welcome DM to New Users</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className={`block text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Welcome DM Template</label>
                                                        <textarea
                                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                            value={settingsData.welcomeDmPrompt || "Welcome! Thanks for engaging with our page. How can I help you today?"}
                                                            onChange={(e) => setSettingsData({ ...settingsData, welcomeDmPrompt: e.target.value })}
                                                            disabled={!settingsData.commentDmEnabled}
                                                        />
                                                        <div className="mt-2">
                                                            <label className={`block text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Delay (seconds)</label>
                                                            <input
                                                                type="number"
                                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                                value={settingsData.welcomeDmDelay || 0}
                                                                onChange={(e) => setSettingsData({ ...settingsData, welcomeDmDelay: Number(e.target.value) })}
                                                                disabled={!settingsData.commentDmEnabled}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={settingsData.replyDmEnabled}
                                                                onChange={(enabled) => setSettingsData({ ...settingsData, replyDmEnabled: enabled })}
                                                                className={`${settingsData.replyDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                            >
                                                                <span className={`${settingsData.replyDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                            </Switch>
                                                            <span className={`text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Send DM to Comment Authors</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className={`block text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Comment Reply DM Template</label>
                                                        <textarea
                                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                            value={settingsData.replyDmPrompt || "Thanks for your comment! I'd love to continue this conversation in DM. How can I assist you?"}
                                                            onChange={(e) => setSettingsData({ ...settingsData, replyDmPrompt: e.target.value })}
                                                            disabled={!settingsData.commentDmEnabled}
                                                        />
                                                        <div className="mt-2">
                                                            <label className={`block text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Delay (seconds)</label>
                                                            <input
                                                                type="number"
                                                                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                                value={settingsData.replyDmDelay || 0}
                                                                onChange={(e) => setSettingsData({ ...settingsData, replyDmDelay: Number(e.target.value) })}
                                                                disabled={!settingsData.commentDmEnabled}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={settingsData.keywordDmEnabled}
                                                                onChange={(enabled) => setSettingsData({ ...settingsData, keywordDmEnabled: enabled })}
                                                                className={`${settingsData.keywordDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                            >
                                                                <span className={`${settingsData.keywordDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                            </Switch>
                                                            <span className={`text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Keyword-Triggered DMs</span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <label className={`block text-sm font-medium mb-2 ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Keyword Triggers</label>
                                                        <div className="space-y-3">
                                                            {(settingsData.keywordTriggers || []).map((trigger, index) => (
                                                                <div key={index} className="flex gap-3 items-start">
                                                                    <input
                                                                        type="text"
                                                                        className={`mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                                        placeholder="Keyword"
                                                                        value={trigger.keyword}
                                                                        onChange={(e) => {
                                                                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                                                                            newTriggers[index].keyword = e.target.value;
                                                                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                                                        }}
                                                                        disabled={!settingsData.commentDmEnabled}
                                                                    />
                                                                    <textarea
                                                                        className={`mt-1 block w-1/3 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                                        placeholder="DM Prompt"
                                                                        value={trigger.prompt}
                                                                        onChange={(e) => {
                                                                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                                                                            newTriggers[index].prompt = e.target.value;
                                                                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                                                        }}
                                                                        disabled={!settingsData.commentDmEnabled}
                                                                    />
                                                                    <div className="flex flex-col w-1/6">
                                                                        <label className={`block text-sm font-medium ${settingsData.commentDmEnabled ? 'text-gray-700' : 'text-gray-400'}`}>Delay (seconds)</label>
                                                                        <input
                                                                            type="number"
                                                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!settingsData.commentDmEnabled ? 'bg-gray-50' : ''}`}
                                                                            value={trigger.delay || 0}
                                                                            onChange={(e) => {
                                                                                const newTriggers = [...(settingsData.keywordTriggers || [])];
                                                                                newTriggers[index].delay = Number(e.target.value);
                                                                                setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                                                            }}
                                                                            disabled={!settingsData.commentDmEnabled}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        onClick={() => {
                                                                            const newTriggers = [...(settingsData.keywordTriggers || [])];
                                                                            newTriggers.splice(index, 1);
                                                                            setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                                                        }}
                                                                        className={`mt-1 ${settingsData.commentDmEnabled ? 'text-red-500 hover:text-red-700' : 'text-gray-400'}`}
                                                                        disabled={!settingsData.commentDmEnabled}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => {
                                                                    const newTriggers = [...(settingsData.keywordTriggers || []), { keyword: '', prompt: '', delay: 0 }];
                                                                    setSettingsData({ ...settingsData, keywordTriggers: newTriggers });
                                                                }}
                                                                className={`text-sm font-medium ${settingsData.commentDmEnabled ? 'text-blue-500 hover:text-blue-700' : 'text-gray-400'}`}
                                                                disabled={!settingsData.commentDmEnabled}
                                                            >
                                                                + Add Keyword Trigger
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Like DMs</h3>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={settingsData.likeDmEnabled}
                                                        onChange={(enabled) => setSettingsData({ ...settingsData, likeDmEnabled: enabled })}
                                                        className={`${settingsData.likeDmEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                    >
                                                        <span className={`${settingsData.likeDmEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                    </Switch>
                                                    <span className="text-sm font-medium text-gray-700">Send DM After Post Like</span>
                                                </div>
                                            </div>

                                            <div className={`space-y-6 ${!settingsData.likeDmEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <Switch
                                                                checked={settingsData.likeDmFirstOnly}
                                                                onChange={(enabled) => setSettingsData({ ...settingsData, likeDmFirstOnly: enabled })}
                                                                className={`${settingsData.likeDmFirstOnly ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                            >
                                                                <span className={`${settingsData.likeDmFirstOnly ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                                            </Switch>
                                                            <span className="text-sm font-medium text-gray-700">Send DM Only on First Like</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Default Like DM Prompt</label>
                                                            <textarea
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                                                value={settingsData.likeDmPrompt || "Thanks for liking our post! We're glad you enjoyed it. How can we help you today?"}
                                                                onChange={(e) => setSettingsData({ ...settingsData, likeDmPrompt: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">Default Delay (seconds)</label>
                                                            <input
                                                                type="number"
                                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                                value={settingsData.likeDmDelay || 0}
                                                                onChange={(e) => setSettingsData({ ...settingsData, likeDmDelay: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-4">Specific Post Settings</h4>
                                                    <div className="space-y-4">
                                                        {(settingsData.likeDmSpecificPosts || []).map((post, index) => (
                                                            <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Post URL</label>
                                                                    <input
                                                                        type="text"
                                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="https://facebook.com/..."
                                                                        value={post.postUrl}
                                                                        onChange={(e) => {
                                                                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                                                            newPosts[index].postUrl = e.target.value;
                                                                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Custom Prompt (optional)</label>
                                                                    <textarea
                                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Leave empty to use default prompt"
                                                                        value={post.prompt}
                                                                        onChange={(e) => {
                                                                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                                                            newPosts[index].prompt = e.target.value;
                                                                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds, optional)</label>
                                                                    <input
                                                                        type="number"
                                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                                        placeholder="Leave empty to use default delay"
                                                                        value={post.delay}
                                                                        onChange={(e) => {
                                                                            const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                                                            newPosts[index].delay = Number(e.target.value);
                                                                            setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                                                        }}
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const newPosts = [...(settingsData.likeDmSpecificPosts || [])];
                                                                        newPosts.splice(index, 1);
                                                                        setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                                                    }}
                                                                    className="text-sm text-red-500 hover:text-red-700"
                                                                >
                                                                    Remove Post
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newPosts = [...(settingsData.likeDmSpecificPosts || []), { postUrl: '', prompt: '', delay: undefined }];
                                                                setSettingsData({ ...settingsData, likeDmSpecificPosts: newPosts });
                                                            }}
                                                            className="text-sm font-medium text-blue-500 hover:text-blue-700"
                                                        >
                                                            + Add Specific Post
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 py-8 text-center">No settings available.</div>
                            )}

                            <DialogFooter className="mt-6">
                                <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={saveSettings} disabled={isSavingSettings}>
                                    {isSavingSettings ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            }

            {isConnecting && (
                // Show the spinner when loading
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Spinner />
                </div>
            )}
        </div>
    )
}

export default MessengerManagement
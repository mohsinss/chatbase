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
    const router = useRouter();

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
                throw new Error("Failed to fetch page numbers");
            }

            const data = await response.json();
            if(data.length == 0){                
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
            router.refresh();
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
            config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID_FOR_PAGE_1, // configuration ID goes here
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
                            <h2 className="text-xl font-extrabold text-gray-900">Connected Pages</h2>
                            <p className="text-gray-500 pt-4">
                                After creating a business profile on Meta if recommended to verify you business
                                &nbsp;<a href='https://www.facebook.com/business/help/1095661473946872?id=180505742745347' className="text-gray-950 underline font-medium" target="_blank">Learn more</a>.
                                You can also learn more about the status of you integration by visiting
                                &nbsp;<a href="https://business.facebook.com/wa/manage/home" className="text-gray-950 underline font-medium" target="_blank">WhatsApp Manager</a>.
                            </p>
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
                                <DialogTitle>Delete WhatsApp Number</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this WhatsApp Number?.
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
"use client";

import { useState, useEffect, Fragment } from "react";
import { Switch, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import Spinner from "@/components/Spinner";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const XManagement = ({ chatbotId, domain, teamId }:
    {
        chatbotId: string,
        domain: string,
        teamId: string
    }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFetchingPage, setIsFetchingPage] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [deleteAccount, setDeleteAccount] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const router = useRouter();

    const fetchAccounts = async () => {
        setIsFetchingPage(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/x?chatbotId=${chatbotId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch X accounts");
            }

            const data = await response.json();
            if (data.length === 0) {
                router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`);
                router.refresh();
                return;
            }
            setAccounts(data);
        } catch (error) {
            console.error("Error fetching X accounts:", error);
            toast.error("Failed to fetch X accounts.");
        }
        setIsFetchingPage(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleDeleteMenu = (account: any) => () => {
        setDeleteAccount(account);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteAccount)
            return;

        setIsConnecting(true);
        try {
            const response = await fetch("/api/chatbot/integrations/x", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: deleteAccount?.userId,
                    chatbotId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete X account");
            }

            toast.success("Successfully deleted X account!");
        } catch (error) {
            console.error("Error deleting X account:", error);
            toast.error("Failed to delete X account.");
        }

        fetchAccounts();
        setIsConnecting(false);
        setIsDeleteDialogOpen(false);
    };

    return (
        <div>
            <div className="flex flex-row items-center gap-2 pb-4">
                <Link
                    href={`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`}
                    className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    Integrations
                </Link>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <div className="text-gray-900 font-bold">X</div>
            </div>

            {isFetchingPage ? (
                <div className="rounded-md border-1 border-[1px] border-gray-200 p-6">Fetching accounts...</div>
            ) : (
                <>
                    <div className="rounded-md border-1 border-[1px] border-gray-200 mb-4">
                        <div className="p-4">
                            <h2 className="text-xl font-extrabold text-gray-900">Connected X Accounts</h2>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200 mt-4">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {accounts?.map((account) => (
                                    <tr key={`accountTR-${account.userId}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={handleDeleteMenu(account)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end p-4">
                            <button
                                className="mt-4 disabled:opacity-50 bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded"
                                onClick={() => router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`)}
                                disabled={isConnecting}
                            >
                                Connect a new account
                            </button>
                        </div>
                    </div>

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete X account</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this X account?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isConnecting}>
                                    {isConnecting ? "Deleting..." : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}

            {isConnecting && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default XManagement;
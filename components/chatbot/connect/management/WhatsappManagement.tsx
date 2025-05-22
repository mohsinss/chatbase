"use client";

import { useState, useEffect, Fragment } from "react";
import { Switch, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { QRCodeCanvas } from 'qrcode.react';
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

// Import dialog components
import DeleteDialog from "@/components/ui/deleteDialog";
import SettingsDialog from "./dialogs/SettingsDialog";
import ProfileDialog from "./dialogs/ProfileDialog";
import TemplateDialog from "./dialogs/TemplateDialog";

const WhatsappManagement = ({ chatbotId, domain, teamId }:
    {
        chatbotId: string,
        domain: string,
        teamId: string
    }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isFetchingNumber, setIsFetchingNumber] = useState(true);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [deletePhone, setDeletePhone] = useState(null);
    const [selectedNumberId, setSelectedNumberId] = useState(null);
    const [integrationUrl, setIntegrationUrl] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

    const router = useRouter();

    // No need to fetch settings on selectedNumberId change as it's handled in the SettingsDialog component

    useEffect(() => {
        if (isSettingsDialogOpen == false) {
            setSelectedNumberId(null);
        }
    }, [isSettingsDialogOpen]);

    const handleSettingsMenu = (id: string) => {
        setIsSettingsDialogOpen(true);
        setSelectedNumberId(id);
    };

    // These functions have been moved to their respective dialog components

    const handleNumberChange = (phoneNumber: string) => () => {
        setPhoneNumber(phoneNumber)
    }

    const fetchPhoneNumbers = async () => {
        setIsFetchingNumber(true)
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp?chatbotId=${chatbotId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch phone numbers");
            }

            const data = await response.json();
            if (data.length == 0) {
                router.push(`/dashboard/${teamId}/chatbot/${chatbotId}/connect/integrations`);
                router.refresh();
                return;
            }
            setPhoneNumbers(data);
            setPhoneNumber(data[0]?.display_phone_number);
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
        setIsFetchingNumber(false)
    };

    useEffect(() => {
        if (phoneNumber) {
            let refinePhoneNumber = phoneNumber;
            refinePhoneNumber = refinePhoneNumber.replace(/\D/g, ''); // removes all non-digit characters
            setIntegrationUrl(`https://wa.me/${refinePhoneNumber}?text=Hello%2C%20this%20is%20a%20test%20message`);
        }
    }, [phoneNumber])

    useEffect(() => {
        const messageEventListener = (event: MessageEvent) => {
            if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") return;
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'WA_EMBEDDED_SIGNUP') {
                    console.log('WhatsApp Embedded Signup response:', data);

                    // Handle successful signup
                    if (data.event === 'FINISH') {
                        const credentials = {
                            phoneNumberId: data.data.phone_number_id,
                            wabaId: data.data.waba_id,
                            // accessToken: data.access_token,
                        };
                        saveWhatsAppCredentials(credentials);
                    } else {
                        console.error('WhatsApp Embedded Signup failed:', data.error);
                        toast.error(data.error);
                        setIsConnecting(false);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        };

        window.addEventListener('message', messageEventListener);

        fetchPhoneNumbers();

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('message', messageEventListener);
        };
    }, []);

    const saveWhatsAppCredentials = async (credentials: any) => {
        try {
            const response = await fetch("/api/chatbot/integrations/whatsapp/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatbotId,
                    ...credentials,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save WhatsApp credentials");
            }

            toast.success("Successfully connected to WhatsApp!");
        } catch (error) {
            console.error("Error saving WhatsApp credentials:", error);
            toast.error("Failed to save WhatsApp Number. Please check integration guide again.");
        }
        setIsConnecting(false);
        fetchPhoneNumbers();
    };

    const handleConnect = () => {
        setIsConnecting(true);

        window.FB.login((response: any) => {
            if (response.authResponse) {
                const code = response.authResponse.code;
                console.log(code);
                // WhatsApp uses a different flow with embedded signup
                // The actual saving happens in the message event listener
            } else {
                console.log(response);
                toast.error("Something went wrong with the connection.");
                setIsConnecting(false);
            }
        }, {
            config_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_CONFIGURATION_ID,
            response_type: 'code',
            override_default_response_type: true,
            extras: {
                setup: {},
                featureType: '',
                sessionInfoVersion: '2',
            }
        });
    }

    const handleDeleteMenu = (phone: any) => () => {
        console.log(phone)
        setDeletePhone(phone);
        setIsDeleteDialogOpen(true);
    }

    const handleDelete = async () => {
        if (!deletePhone)
            return;
        console.log('handleDelete', deletePhone);
        setIsConnecting(true);
        try {
            const response = await fetch("/api/chatbot/integrations/whatsapp", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumberId: deletePhone?.phoneNumberId,
                    wabaId: deletePhone?.wabaId,
                    chatbotId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete WhatsApp Number");
            }

            toast.success("Successfully delete WhatsApp Number!");
        } catch (error) {
            console.error("Error deleting WhatsApp number:", error);
            toast.error("Failed to delete WhatsApp Number.");
        }

        fetchPhoneNumbers();
        setIsConnecting(false);
        setIsDeleteDialogOpen(false);
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
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
                    Whatsapp
                </div>
            </div>
            {isFetchingNumber ?
                <div className="rounded-md border-1 border-[1px] border-gray-200 p-6">Fectching number...</div>
                :
                <>
                    <div className="rounded-md border-1 border-[1px] border-gray-200 mb-4">
                        <div className="p-4">
                            <h2 className="text-xl font-extrabold text-gray-900">Connected Phone Numbers</h2>
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
                                        Phone number
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Display Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">

                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {phoneNumbers?.map((phone) => (
                                    <tr key={`phonenumberTR-${phone.phoneNumberId}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{phone.display_phone_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{phone.verified_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">{phone.code_verification_status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <div className="z-10">
                                                    <Menu.Button className="inline-flex justify-center w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                                        <svg fill="#000000" height="20px" width="21px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32.055 32.055" xmlSpace="preserve">
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
                                                    <Menu.Items className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={() => {
                                                                            setSelectedNumberId(phone._id);
                                                                            setIsProfileDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        Manage Profile
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={() => {
                                                                            setSelectedNumberId(phone._id);
                                                                            setIsTemplateDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        Manage Template
                                                                    </div>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <div
                                                                        className={`hidden ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} flex px-4 py-2 text-sm cursor-pointer`}
                                                                        onClick={() => handleSettingsMenu(phone._id)}
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
                                                                        onClick={handleDeleteMenu(phone)}
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
                                Connect a new number
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center flex-col lg:flex-row lg:justify-between rounded-md border-1 border-[1px] border-gray-200 p-4 gap-10 justify-center">
                        <div className="max-w-[600px]">
                            <h2 className="text-xl font-extrabold text-gray-900">Test Your Integration</h2>
                            <div className="flex gap-4 mt-3 items-center text-gray-500">
                                <span>
                                    You can test your WhatsApp integration by sending a message to your linked WhatsApp number, and chatting with your chatbot!.
                                    Pick a number and scan the QR code using your smartphone to start chatting.
                                </span>
                            </div>
                            <div className="mt-4">
                                <Menu as="div" className="relative inline-block text-left w-full">
                                    <div>
                                        <Menu.Button className="inline-flex items-center gap-4 justify-between w-full px-2 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-200 shadow-sm hover:bg-gray-50 ">
                                            {phoneNumber}
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                                        <Menu.Items className="origin-top-left w-full absolute left-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                {phoneNumbers?.map((phone, index) => {
                                                    return (
                                                        <Menu.Item key={`phonenumber-${index}`}>
                                                            {({ active }) => (
                                                                <div
                                                                    key={`phonenumberdiv-${index}`}
                                                                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                                        } flex px-4 py-2 text-sm cursor-pointer`}
                                                                    onClick={handleNumberChange(phone.display_phone_number)}
                                                                >
                                                                    {phone.display_phone_number}
                                                                </div>
                                                            )}
                                                        </Menu.Item>
                                                    )
                                                })}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>

                        <QRCodeCanvas id="qr-code-canvas" value={integrationUrl} className="w-[400px]" />
                    </div>
                    {/* Dialog components */}
                    <DeleteDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        isDeleting={isConnecting}
                        onDelete={handleDelete}
                        title={'Delete WhatsApp Number'}
                        description={'Are you sure you want to delete this WhatsApp Number?.'}
                    />

                    <SettingsDialog
                        isOpen={isSettingsDialogOpen}
                        setIsOpen={setIsSettingsDialogOpen}
                        selectedNumberId={selectedNumberId}
                        onClose={() => setSelectedNumberId(null)}
                    />

                    <ProfileDialog
                        isOpen={isProfileDialogOpen}
                        setIsOpen={setIsProfileDialogOpen}
                        selectedNumberId={selectedNumberId}
                        onProfileUpdated={() => {
                            // Profile is updated in the dialog component
                            setIsProfileDialogOpen(false);
                        }}
                    />

                    <TemplateDialog
                        isOpen={isTemplateDialogOpen}
                        setIsOpen={setIsTemplateDialogOpen}
                        selectedNumberId={selectedNumberId}
                        wabaId={phoneNumbers.find(p => p._id === selectedNumberId)?.wabaId || null}
                        phoneNumber={phoneNumbers.find(p => p._id === selectedNumberId)?.display_phone_number || null}
                    />
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

export default WhatsappManagement

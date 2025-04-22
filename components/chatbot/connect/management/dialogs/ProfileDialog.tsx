import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import Image from "next/image";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface ProfileData {
    about: string;
    address: string;
    description: string;
    email: string;
    profile_picture_url: string;
    profile_picture_file?: File;
    websites: string[];
}

interface ProfileDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedNumberId: string | null;
    onProfileUpdated: () => void;
}

const ProfileDialog = ({ isOpen, setIsOpen, selectedNumberId, onProfileUpdated }: ProfileDialogProps) => {
    const [isFetchingProfile, setIsFetchingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (selectedNumberId && isOpen) {
            fetchProfile(selectedNumberId);
        }
    }, [selectedNumberId, isOpen]);

    const fetchProfile = async (id: string) => {
        setIsFetchingProfile(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp/profile?_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to fetch profile");
            }

            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to fetch profile.");
        }
        setIsFetchingProfile(false);
    };

    const saveProfile = async () => {
        if (!selectedNumberId || !profileData) return;
        
        setIsSavingProfile(true);
        try {
            const formData = new FormData();

            formData.append("about", profileData.about);
            formData.append("address", profileData.address);
            formData.append("description", profileData.description);
            formData.append("email", profileData.email);
            formData.append("websites", JSON.stringify(profileData.websites));

            if (profileData.profile_picture_file) {
                formData.append("profile_picture", profileData.profile_picture_file);
            }

            const response = await fetch(`/api/chatbot/integrations/whatsapp/profile?_id=${selectedNumberId}`, {
                method: "POST",
                body: formData, // Send formData instead of JSON
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to save profile");
            }

            toast.success("Profile is saved successfully!");
            setIsOpen(false);
            onProfileUpdated();
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
        setIsSavingProfile(false);
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">WhatsApp Profile Management</DialogTitle>
                    <DialogDescription>
                        Manage your WhatsApp business profile here.
                    </DialogDescription>
                </DialogHeader>

                {isFetchingProfile ? (
                    <div className="flex justify-center items-center">
                        <Spinner />
                    </div>
                ) : profileData ? (
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
                        <div className="flex flex-col items-center gap-2">
                            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                            {(profileImagePreview || profileData.profile_picture_url) && (
                                <Image
                                    src={profileImagePreview || profileData.profile_picture_url}
                                    alt="Profile Picture"
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover"
                                />
                            )}
                            {profileImagePreview && (
                                <button
                                    type="button"
                                    className="mt-2 inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    onClick={() => {
                                        setProfileImagePreview(null);
                                        setProfileData({ ...profileData, profile_picture_file: undefined });
                                    }}
                                >
                                    Cancel Selection
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setProfileData({ ...profileData, profile_picture_file: file });
                                        setProfileImagePreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">About</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={profileData.about}
                                onChange={(e) => setProfileData({ ...profileData, about: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={profileData.description}
                                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Websites</label>
                            {profileData.websites?.map((website, index) => {
                                const isUrlValid = website !== "" || isValidUrl(website);
                                return (
                                    <div key={`website-${index}`} className="flex items-center gap-2 mt-1">
                                        <input
                                            type="text"
                                            className={`block w-full border rounded-md shadow-sm p-2 ${isUrlValid ? "border-gray-300" : "border-red-500"}`}
                                            value={website}
                                            onChange={(e) => {
                                                const updatedWebsites = [...profileData.websites];
                                                updatedWebsites[index] = e.target.value;
                                                setProfileData({ ...profileData, websites: updatedWebsites });
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                const updatedWebsites = profileData.websites.filter((_, i) => i !== index);
                                                setProfileData({ ...profileData, websites: updatedWebsites });
                                            }}
                                        >
                                            <IconTrash className="h-5 w-5" />
                                        </button>
                                    </div>
                                );
                            })}
                            <button
                                type="button"
                                className={`mt-2 text-sm ${profileData.websites?.every((url) => isValidUrl(url) && url !== "")
                                    ? "text-blue-600 hover:text-blue-800"
                                    : "text-gray-400 cursor-not-allowed"
                                    }`}
                                onClick={() => {
                                    if (profileData.websites?.every((url) => isValidUrl(url) && url !== "")) {
                                        setProfileData({ ...profileData, websites: [...profileData.websites, ""] });
                                    } else {
                                        toast.error("Please enter valid URLs before adding a new one.");
                                    }
                                }}
                                disabled={profileData.websites?.length > 0 && !profileData.websites?.every((url) => isValidUrl(url) && url !== "")}
                            >
                                <IconPlus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500">No profile data available.</div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={saveProfile} disabled={isSavingProfile}>
                        {isSavingProfile ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileDialog;

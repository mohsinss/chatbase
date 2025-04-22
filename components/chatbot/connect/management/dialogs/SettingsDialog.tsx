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

interface SettingsData {
    prompt: string;
    delay: number;
}

interface SettingsDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedNumberId: string | null;
    onClose: () => void;
}

const SettingsDialog = ({ isOpen, setIsOpen, selectedNumberId, onClose }: SettingsDialogProps) => {
    const [isFetchingSettings, setIsFetchingSettings] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsData, setSettingsData] = useState<SettingsData | null>(null);

    useEffect(() => {
        if (selectedNumberId && isOpen) {
            fetchSettings(selectedNumberId);
        }
    }, [selectedNumberId, isOpen]);

    const fetchSettings = async (id: string) => {
        setIsFetchingSettings(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp/settings?_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to fetch settings");
            }

            setSettingsData(data);
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Failed to fetch settings.");
        }
        setIsFetchingSettings(false);
    };

    const saveSettings = async () => {
        if (!selectedNumberId || !settingsData) return;
        
        setIsSavingSettings(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp/settings?_id=${selectedNumberId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: settingsData.prompt,
                    delay: settingsData.delay,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to save settings");
            }

            toast.success("Settings saved successfully!");
            setIsOpen(false);
            onClose();
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
        setIsSavingSettings(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl">WhatsApp Integration Settings</DialogTitle>
                    <DialogDescription>
                        Manage your WhatsApp integration settings here.
                    </DialogDescription>
                </DialogHeader>

                {isFetchingSettings ? (
                    <div className="flex justify-center items-center">
                        <Spinner />
                    </div>
                ) : settingsData ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prompt</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={settingsData.prompt}
                                onChange={(e) => setSettingsData({ ...settingsData, prompt: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                            <input
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={settingsData.delay}
                                onChange={(e) => setSettingsData({ ...settingsData, delay: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500">No settings available.</div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={saveSettings} disabled={isSavingSettings}>
                        {isSavingSettings ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;

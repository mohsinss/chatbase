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
import { IconPlus, IconTrash, IconEdit, IconCheck } from "@tabler/icons-react";

interface TemplateData {
    id: string;
    name: string;
    status: string;
    category: string;
    language: string;
    components: {
        type: string;
        text?: string;
        format?: string;
        example?: {
            header_text?: string;
            body_text?: string;
        };
    }[];
}

interface TemplateDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedNumberId: string | null;
    wabaId: string | null;
    phoneNumber: string | null;
}

const TemplateDialog = ({ isOpen, setIsOpen, selectedNumberId, wabaId, phoneNumber }: TemplateDialogProps) => {
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [templates, setTemplates] = useState<TemplateData[]>([]);
    const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
    const [newTemplate, setNewTemplate] = useState<{
        name: string;
        category: string;
        language: string;
        headerText: string;
        bodyText: string;
        footerText: string;
        buttons: { type: string; text: string; url?: string }[];
    }>({
        name: "",
        category: "MARKETING",
        language: "en_US",
        headerText: "",
        bodyText: "",
        footerText: "",
        buttons: []
    });

    const categories = [
        { value: "MARKETING", label: "Marketing" },
        { value: "UTILITY", label: "Utility" },
        { value: "AUTHENTICATION", label: "Authentication" }
    ];

    const languages = [
        { value: "en_US", label: "English (US)" },
        { value: "es_ES", label: "Spanish (Spain)" },
        { value: "pt_BR", label: "Portuguese (Brazil)" },
        { value: "fr_FR", label: "French (France)" },
        { value: "de_DE", label: "German" },
        { value: "it_IT", label: "Italian" },
        { value: "zh_CN", label: "Chinese (China)" },
        { value: "ja_JP", label: "Japanese" },
        { value: "ko_KR", label: "Korean" }
    ];

    useEffect(() => {
        if (selectedNumberId && isOpen && wabaId) {
            fetchTemplates();
        }
    }, [selectedNumberId, isOpen, wabaId]);

    const fetchTemplates = async () => {
        if (!selectedNumberId || !wabaId) return;
        
        setIsFetchingTemplates(true);
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp/templates?_id=${selectedNumberId}&wabaId=${wabaId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to fetch templates");
            }

            setTemplates(data.data || []);
        } catch (error) {
            console.error("Error fetching templates:", error);
            toast.error("Failed to fetch templates.");
        }
        setIsFetchingTemplates(false);
    };

    const createTemplate = async () => {
        if (!selectedNumberId || !wabaId) return;
        
        setIsCreatingTemplate(true);
        try {
            // Prepare components array based on the template structure
            const components = [];
            
            // Add header if provided
            if (newTemplate.headerText) {
                const headerComponent: any = {
                    type: "HEADER",
                    format: "TEXT",
                    text: newTemplate.headerText
                };
                
                // Only add example if there are variables
                const headerVariables = newTemplate.headerText.match(/{{[0-9]+}}/g);
                if (headerVariables && headerVariables.length > 0) {
                    headerComponent.example = {
                        header_text: [
                            newTemplate.headerText.replace(/{{[0-9]+}}/g, "Example Value")
                        ]
                    };
                }
                
                components.push(headerComponent);
            }
            
            // Add body (required)
            // Extract variables from body text
            const bodyVariables = newTemplate.bodyText.match(/{{[0-9]+}}/g);
            const bodyComponent: any = {
                type: "BODY",
                text: newTemplate.bodyText
            };
            
            // Only add example if there are variables
            if (bodyVariables && bodyVariables.length > 0) {
                // Create example values for each variable
                const exampleValues = bodyVariables.map(() => "Example Value");
                
                bodyComponent.example = {
                    body_text: exampleValues
                };
            }
            
            components.push(bodyComponent);
            
            // Add footer if provided
            if (newTemplate.footerText) {
                components.push({
                    type: "FOOTER",
                    text: newTemplate.footerText
                });
            }
            
            // Add buttons if any
            if (newTemplate.buttons.length > 0) {
                components.push({
                    type: "BUTTONS",
                    buttons: newTemplate.buttons
                });
            }

            const response = await fetch(`/api/chatbot/integrations/whatsapp/templates?_id=${selectedNumberId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newTemplate.name,
                    category: newTemplate.category,
                    language: newTemplate.language,
                    components,
                    wabaId
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to create template");
            }

            toast.success("Template created successfully!");
            resetNewTemplate();
            setIsCreatingTemplate(false);
            fetchTemplates();
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
            setIsCreatingTemplate(false);
        }
    };

    const deleteTemplate = async (templateId: string) => {
        if (!selectedNumberId || !wabaId) return;
        
        try {
            const response = await fetch(`/api/chatbot/integrations/whatsapp/templates?_id=${selectedNumberId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    templateId,
                    wabaId
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to delete template");
            }

            toast.success("Template deleted successfully!");
            fetchTemplates();
        } catch (error) {
            console.error(error.message);
            toast.error(error.message);
        }
    };

    const resetNewTemplate = () => {
        setNewTemplate({
            name: "",
            category: "MARKETING",
            language: "en_US",
            headerText: "",
            bodyText: "",
            footerText: "",
            buttons: []
        });
    };

    const addButton = () => {
        if (newTemplate.buttons.length < 3) {
            setNewTemplate({
                ...newTemplate,
                buttons: [...newTemplate.buttons, { type: "QUICK_REPLY", text: "" }]
            });
        } else {
            toast.error("Maximum 3 buttons allowed");
        }
    };

    const removeButton = (index: number) => {
        const updatedButtons = [...newTemplate.buttons];
        updatedButtons.splice(index, 1);
        setNewTemplate({
            ...newTemplate,
            buttons: updatedButtons
        });
    };

    const updateButton = (index: number, field: string, value: string) => {
        const updatedButtons = [...newTemplate.buttons];
        updatedButtons[index] = { ...updatedButtons[index], [field]: value };
        setNewTemplate({
            ...newTemplate,
            buttons: updatedButtons
        });
    };

    const handleButtonTypeChange = (index: number, type: string) => {
        const updatedButtons = [...newTemplate.buttons];
        if (type === "URL") {
            updatedButtons[index] = { type, text: updatedButtons[index].text, url: "" };
        } else {
            const { url, ...rest } = updatedButtons[index];
            updatedButtons[index] = { ...rest, type };
        }
        setNewTemplate({
            ...newTemplate,
            buttons: updatedButtons
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">WhatsApp Message Templates</DialogTitle>
                    <DialogDescription>
                        Create and manage message templates for your WhatsApp business account.
                    </DialogDescription>
                </DialogHeader>

                {isFetchingTemplates ? (
                    <div className="flex justify-center items-center p-8">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Template List */}
                        <div className="border rounded-md">
                            <div className="bg-gray-50 p-4 border-b">
                                <h3 className="text-lg font-medium">Your Templates</h3>
                            </div>
                            {templates.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No templates found. Create your first template below.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {templates.map((template) => (
                                        <div key={template.id} className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">{template.name}</h4>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        template.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                                        template.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {template.status}
                                                    </span>
                                                    <span className="ml-2">{template.category} • {template.language}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 text-gray-500 hover:text-gray-700"
                                                    onClick={() => {
                                                        setSelectedTemplate(template);
                                                        setIsEditingTemplate(true);
                                                    }}
                                                >
                                                    <IconEdit size={18} />
                                                </button>
                                                <button
                                                    className="p-1 text-red-500 hover:text-red-700"
                                                    onClick={() => deleteTemplate(template.id)}
                                                >
                                                    <IconTrash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Create New Template Form */}
                        <div className="border rounded-md">
                            <div className="bg-gray-50 p-4 border-b">
                                <h3 className="text-lg font-medium">Create New Template</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Template Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            value={newTemplate.name}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                            placeholder="e.g., appointment_reminder"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Use lowercase letters, numbers and underscores only
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Category</label>
                                            <select
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={newTemplate.category}
                                                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.value} value={category.value}>
                                                        {category.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Language</label>
                                            <select
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={newTemplate.language}
                                                onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                                            >
                                                {languages.map((language) => (
                                                    <option key={language.value} value={language.value}>
                                                        {language.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Header (Optional)</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newTemplate.headerText}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, headerText: e.target.value })}
                                        placeholder="Add a header text (optional)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Body (Required)</label>
                                    <textarea
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={4}
                                        value={newTemplate.bodyText}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, bodyText: e.target.value })}
                                        placeholder="Add your message body here. Use {1}, {2}, etc. for variables."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        You can use variables like {"{1}"}, {"{2}"} which will be replaced with actual values when sending.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Footer (Optional)</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newTemplate.footerText}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, footerText: e.target.value })}
                                        placeholder="Add a footer text (optional)"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Buttons (Optional)</label>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none"
                                            onClick={addButton}
                                        >
                                            <IconPlus size={16} className="mr-1" />
                                            Add Button
                                        </button>
                                    </div>
                                    
                                    {newTemplate.buttons.length > 0 && (
                                        <div className="mt-2 space-y-3">
                                            {newTemplate.buttons.map((button, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <select
                                                        className="block w-1/4 border border-gray-300 rounded-md shadow-sm p-2"
                                                        value={button.type}
                                                        onChange={(e) => handleButtonTypeChange(index, e.target.value)}
                                                    >
                                                        <option value="QUICK_REPLY">Quick Reply</option>
                                                        <option value="URL">URL</option>
                                                        <option value="PHONE_NUMBER">Phone Number</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-2"
                                                        value={button.text}
                                                        onChange={(e) => updateButton(index, 'text', e.target.value)}
                                                        placeholder="Button text"
                                                    />
                                                    {button.type === 'URL' && (
                                                        <input
                                                            type="text"
                                                            className="block w-1/2 border border-gray-300 rounded-md shadow-sm p-2"
                                                            value={button.url || ''}
                                                            onChange={(e) => updateButton(index, 'url', e.target.value)}
                                                            placeholder="https://example.com"
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        className="p-2 text-red-500 hover:text-red-700"
                                                        onClick={() => removeButton(index)}
                                                    >
                                                        <IconTrash size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={createTemplate}
                                        disabled={isCreatingTemplate || !newTemplate.name || !newTemplate.bodyText}
                                        className="w-full"
                                    >
                                        {isCreatingTemplate ? (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        ) : (
                                            <IconCheck size={18} className="mr-2" />
                                        )}
                                        Create Template
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (wabaId && phoneNumber) {
                                window.open(`https://business.facebook.com/wa/manage/message-templates/?waba_id=${wabaId}&phone_number=${phoneNumber}`, '_blank');
                            }
                        }}
                    >
                        Open WhatsApp Manager
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TemplateDialog;

"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { MoreHorizontal, Search, Zap, Puzzle, X, ChevronRight, Globe, Workflow, LayoutGrid, Users, Loader, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Calcom from "./Calcom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import toast from "react-hot-toast"

const ACTION_TABS = [
  { id: "main", label: "Actions", icon: <Zap className="w-5 h-5" /> },
  { id: "integrations", label: "Integrations", icon: <Puzzle className="w-5 h-5" /> },
]

const ACTIONS = [
  {
    id: "naturesky-meeting",
    name: "naturesky meeting",
    description: "Retrieve and book available slots from your Cal.com account",
    enabled: true,
    type: "calcom",
  },
  {
    id: "222",
    name: "222",
    description: "Retrieve and book available slots from your Cal.com account",
    enabled: true,
    type: "calcom",
  },
]

const actionsData = [
  {
    id: "calcom",
    title: "Cal Com",
    description: "Book a meeting from cal.com",
    icon: <div className="h-5 w-5 text-center text-2xl flex items-center justify-center" >C </div>,
    bgColor: "bg-black",
    textColor: "text-white",
    active: true,
  },
  {
    id: "custom",
    title: "Custom action",
    description: "Custom action to execute your own workflows",
    icon: <Workflow className="h-5 w-5" />,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    active: false,
  },
  {
    id: "leads",
    title: "Collect leads",
    description: "Collect leads from your website",
    icon: <Users className="h-5 w-5" />,
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    active: false,
  },
  {
    id: "button",
    title: "Custom button",
    description: "Custom button to trigger your own links",
    icon: <LayoutGrid className="h-5 w-5" />,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    active: false,
  },
  {
    id: "tavily",
    title: "Tavily",
    description: "Connect to Tavily API",
    icon: <Globe className="h-5 w-5" />,
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    active: false,
  },
];

const Actions = (
  params
    :
    {
      teamId: string;
      chatbotId: string;
      subTab: string;
      chatbot: {
        name: string;
        id: string;
        settings?: {
          model?: string;
          temperature?: number;
          maxTokens?: number;
          systemPrompt?: string;
          language?: string;
        };
      },
    }
) => {
  const router = useRouter()
  const pathname = usePathname()
  const currentTab = params.subTab
  const [actions, setActions] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionIdToDelete, setActionIdToDelete] = useState<string | null>(null)
  const [actionIdToToggle, setActionIdToToggle] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setIsToggling] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch(`/api/chatbot/action?chatbotId=${params.chatbotId}`);
        const data = await res.json();
        setActions(data);
      } catch (error) {
        console.error("Failed to fetch actions:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchActions();
  }, [params.chatbotId]);

  const handleActionSelect = (actionId: string) => {
    console.log(`Action selected: ${actionId}`);
    // Here you can handle navigation or further modal dialogs based on the action selected
    closeModal();
  };

  const handleTabChange = (tabId: string) => {
    router.push(
      `/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/${tabId}`,
    )
  }

  const handleCustomize = (action: any) => {
    router.push(`/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/${action.type}?actionId=${action._id}`)
  }

  const handleToggle = async (actionId: string, enabled: boolean) => {
    setIsToggling(true);
    setActionIdToToggle(actionId);
    try {
      const response = await fetch(`/api/chatbot/action`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionId, enabled }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update.")
      }

      toast.success('Successfully updated.')
      // Update local state
      setActions((prev) => prev.map((action) => (action._id === actionId ? { ...action, enabled } : action)))
    } catch (error) {
      console.error("Failed to toggle action status:", error)
      toast.error(error?.message)
      // Revert the UI state if the API call fails
    } finally {
      setIsToggling(false)
    }
  }

  const openDeleteDialog = (actionId: string) => {
    setActionIdToDelete(actionId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!actionIdToDelete) return;

    setDeleting(true); // Start deleting
    try {
      const response = await fetch(`/api/chatbot/action?actionId=${actionIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete action.");
      }

      toast.success('Action deleted successfully.');

      setActions((prev) => prev.filter((action) => action._id !== actionIdToDelete));
    } catch (error) {
      console.error("Failed to delete action:", error);
      toast.error(error.message);
    } finally {
      setDeleting(false); // End deleting
      setDeleteDialogOpen(false);
      setActionIdToDelete(null);
    }
  };

  if (currentTab == "calcom") {
    return (
      <div>
        <Calcom teamId={params.teamId} chatbotId={params.chatbotId} chatbot={params.chatbot} />
      </div>
    )
  }

  //@ts-ignore
  const ActionButton = ({ id, title, description, icon, bgColor, textColor, active }) => (
    <div className={`mb-6  ${active ? "bg-gray-50" : "bg-gray-200 cursor-not-allowed"} rounded-2xl`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${bgColor} ${textColor}`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <button
        className={`w-full p-4 border rounded-lg transition-colors flex items-center justify-between ${active ? "hover:bg-gray-100 " : "bg-gray-200 cursor-not-allowed"}`}
        onClick={() => {
          setIsModalOpen(false);
          router.push(`/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/${id}`);
        }}
        disabled={!active}
      >
        <div>
          <h4 className="font-medium text-left">{title}</h4>
          <p className="text-sm text-gray-500 text-left">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Actions</h1>
        {currentTab === "main" && actions.length > 0 && (
          <Button variant="default" className="bg-gray-800 hover:bg-gray-700" onClick={openModal}>
            Create action
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64">
          <div className="flex flex-col space-y-1">
            {ACTION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm
                  ${currentTab === tab.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <div className={`${currentTab === tab.id ? "text-primary" : "text-gray-400"}`}>{tab.icon}</div>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {currentTab === "main" && !loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action) => (
                  <Card key={`action-card-${action._id}`} className="border rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {
                            action.type == "calcom" && <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                              Cal
                            </div>
                          }
                        </div>
                        <div className="flex gap-1">
                          {action._id == actionIdToToggle && toggling && <Loader2 className="animate-spin" />}
                          <Switch
                            checked={action.enabled}
                            onCheckedChange={(checked) => handleToggle(action._id, checked)}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      </div>
                      <div className="border-t pt-4 mt-2 flex items-center justify-between">
                        <Button variant="outline" className="w-full mr-2" onClick={() => handleCustomize(action)}>
                          Customize
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                              onClick={() => openDeleteDialog(action._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {actions.length === 0 && (
                <div className="text-center max-w-[400px] mx-auto mt-20">
                  <h2 className="text-xl font-semibold">Create your first action</h2>
                  <p className="mb-4">Customize how your users interact with the chatbot, connect to an integration or create your own actions.</p>
                  <Button variant="default" className="bg-gray-800 hover:bg-gray-700 mr-4" onClick={openModal}>
                    Create action
                  </Button>
                  <Button variant="outline" onClick={() => router.push(`/dashboard/${params.teamId}/chatbot/${params.chatbotId}/actions/integrations`)}>
                    View all integrations
                  </Button>
                </div>
              )}
            </>
          )}
          {currentTab === "integrations" && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-gray-600">Integrations will be soon here</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this action?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will be permanently removed from your chatbot. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
            >
              {
                deleting ?
                  <div className="flex items-center gap-1"><Loader2 className="animate-spin" />Deleting...</div>
                  : "Delete"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-6xl w-full">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">Select Action</DialogTitle>
          </DialogHeader>

          <div className="p-0">
            {/* Search Input */}
            <div className="flex justify-end mb-3 hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input type="text" placeholder="Search actions..." className="w-full pl-10 py-2 border rounded-lg" />
              </div>
            </div>

            {/* Actions List */}
            <div className="space-y-4">
              {actionsData.map((action) => (
                <ActionButton key={action.id} {...action} />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Actions


"use client"
import { IconArrowLeft, IconArrowRight, IconRefresh, IconTrash } from "@tabler/icons-react"
import type React from "react"

interface InstanceActionsProps {
  onMoveLeft: () => void
  onMoveRight: () => void
  onClearChat: () => void
  onDeleteInstance: () => void
  onClose: () => void
}

const InstanceActions = ({ onMoveLeft, onMoveRight, onClearChat, onDeleteInstance, onClose }: InstanceActionsProps) => {
  // Handle instance actions
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDeleteInstance()
    onClose()
  }

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onMoveLeft()
    onClose()
  }

  const handleMoveRight = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onMoveRight()
    onClose()
  }

  const handleClearChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClearChat()
    onClose()
  }

  return (
    <div
      data-actions-menu
      className="absolute top-full right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="p-2 border-b text-sm font-medium">Actions</div>
      <div className="py-1">
        <button
          onClick={handleMoveLeft}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Move left
        </button>
        <button
          onClick={handleMoveRight}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <IconArrowRight className="w-4 h-4 mr-2" />
          Move right
        </button>
        <button
          onClick={handleClearChat}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <IconRefresh className="w-4 h-4 mr-2" />
          Clear chat
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
        >
          <IconTrash className="w-4 h-4 mr-2" />
          Delete instance
        </button>
      </div>
    </div>
  )
}

export default InstanceActions

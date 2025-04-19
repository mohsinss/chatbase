"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Upload } from "lucide-react"
import toast from "react-hot-toast"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  images: string[] // Array of image URLs
}

interface Category {
  id: string
  name: string
}

interface MenuTabProps {
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  categories: Category[]
}

const MenuTab = ({ menuItems, setMenuItems, categories }: MenuTabProps) => {
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: categories.length > 0 ? categories[0].name : "Main",
    available: true,
    images: []
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle adding a new menu item
  const handleAddMenuItem = () => {
    if (!newMenuItem.name || !newMenuItem.price) {
      toast.error("Name and price are required")
      return
    }

    const newItem = {
      ...newMenuItem,
      id: Date.now().toString()
    }

    setMenuItems([...menuItems, newItem])
    setNewMenuItem({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: categories.length > 0 ? categories[0].name : "Main",
      available: true,
      images: []
    })
  }

  // Handle deleting a menu item
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedImages: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file size (1MB limit)
        if (file.size > 1024 * 1024) {
          toast.error("File size must be less than 1MB")
          continue
        }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
          toast.error("Only JPG, PNG, and SVG files are supported.")
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'menu-item')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const data = await response.json()
        uploadedImages.push(data.url)
      }

      setNewMenuItem(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
      
      toast.success("Images uploaded successfully")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error("Failed to upload images")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image URL addition
  const handleImageUrlAdd = (url: string) => {
    if (!url) return
    
    setNewMenuItem(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  // Handle image removal
  const handleImageRemove = (index: number) => {
    setNewMenuItem(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <p className="text-sm text-gray-500">
            Manage your restaurant menu items that will be available for ordering
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Menu Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  placeholder="e.g. Margherita Pizza"
                />
              </div>
              <div>
                <Label htmlFor="item-price">Price</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={newMenuItem.price || ""}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="e.g. 12.99"
                />
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                placeholder="Brief description of the item"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="item-category">Category</Label>
                <div className="relative">
                  <select
                    id="item-category"
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-8">
                <Switch
                  id="item-available"
                  checked={newMenuItem.available}
                  onCheckedChange={(checked) => setNewMenuItem({ ...newMenuItem, available: checked })}
                />
                <Label htmlFor="item-available">Available</Label>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-4">
              <Label>Images</Label>
              <div className="mt-2">
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    handleImageUpload(e.dataTransfer.files)
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Drag & drop images here, or click to select files
                    </p>
                    <p className="text-xs text-gray-400">
                      Supports JPG, PNG, and SVG files up to 1MB
                    </p>
                  </div>
                </div>

                {/* Image URL Input */}
                <div className="mt-4">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="Or enter image URL..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleImageUrlAdd(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[type="url"]') as HTMLInputElement
                        if (input.value) {
                          handleImageUrlAdd(input.value)
                          input.value = ''
                        }
                      }}
                    >
                      Add URL
                    </Button>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {newMenuItem.images.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {newMenuItem.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${newMenuItem.name} image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button onClick={handleAddMenuItem} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          {/* Menu Items List */}
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Menu Items</h3>
            {menuItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No menu items added yet</p>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="border rounded-md p-4 flex justify-between items-start">
                    <div className="flex gap-4">
                      {item.images && item.images.length > 0 && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                          <div className="flex items-center">
                            <Switch
                              checked={item.available}
                              onCheckedChange={(checked) => {
                                setMenuItems(
                                  menuItems.map((menuItem) =>
                                    menuItem.id === item.id
                                      ? { ...menuItem, available: checked }
                                      : menuItem
                                  )
                                )
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteMenuItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MenuTab

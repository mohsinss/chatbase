"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  images: string[] // Array of image URLs
  isEditing?: boolean // Flag to track if item is being edited
  editData?: {
    name: string
    description: string
    price: number
    category: string
    available: boolean
  } // Temporary data for editing
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
    category: categories.length > 0 ? categories[0].id : "",
    available: true,
    images: []
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

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
      category: categories.length > 0 ? categories[0].id : "",
      available: true,
      images: []
    })
  }

  // Handle deleting a menu item
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  // Handle editing a menu item
  const handleEditMenuItem = (id: string) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        // If starting to edit, create editData with current values
        if (!item.isEditing) {
          return {
            ...item,
            isEditing: true,
            editData: {
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              available: item.available
            }
          }
        } else {
          // If finishing edit, remove editData
          const { editData, ...rest } = item
          return { ...rest, isEditing: false }
        }
      }
      return item
    }))
  }

  // Handle updating menu item images
  const handleUpdateMenuItemImages = (id: string, images: string[]) => {
    setMenuItems(menuItems.map(item =>
      item.id === id
        ? { ...item, images }
        : item
    ))
  }

  // Handle updating edit data for a menu item
  const handleUpdateEditData = (id: string, field: string, value: any) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id && item.editData) {
        return {
          ...item,
          editData: {
            ...item.editData,
            [field]: value
          }
        }
      }
      return item
    }))
  }

  // Handle saving edited menu item
  const handleSaveMenuItem = (id: string) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id && item.editData) {
        const { editData, ...rest } = item
        return {
          ...rest,
          name: editData.name,
          description: editData.description,
          price: editData.price,
          category: editData.category,
          available: editData.available,
          isEditing: false
        }
      }
      return item
    }))

    toast.success("Menu item updated successfully")
  }

  // Handle canceling edit
  const handleCancelEdit = (id: string) => {
    setMenuItems(menuItems.map(item => {
      if (item.id === id) {
        const { editData, ...rest } = item
        return { ...rest, isEditing: false }
      }
      return item
    }))
  }

  // Handle image upload using S3
  const handleImageUpload = useCallback(async (files: FileList | null, targetItemId?: string) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file size (10MB limit)
        // if (file.size > 1024 * 1024) {
        //   toast.error("File size must be less than 1MB")
        //   continue
        // }

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
          toast.error("Only JPG, PNG, and SVG files are supported.")
          continue
        }

        // Convert file to buffer for S3 upload
        const buffer = Buffer.from(await file.arrayBuffer())

        // Create a unique filename with timestamp
        const fileNameParts = file.name.split('.');
        const name = fileNameParts.slice(0, -1).join('.');
        const extension = fileNameParts.slice(-1)[0];
        const newFileName = `menu-item-${name}-${Date.now()}.${extension}`;

        // Set the S3 key (path in bucket)
        const key = `menu-items/${newFileName}`;

        try {
          // Upload to S3
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
              Key: key,
              Body: buffer,
              ContentType: file.type,
            })
          );

          // Generate the URL for the uploaded file
          const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
          uploadedImages.push(fileUrl);
        } catch (s3Error) {
          console.error("S3 upload error:", s3Error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedImages.length > 0) {
        if (targetItemId) {
          // Update existing menu item
          setMenuItems(prevItems =>
            prevItems.map(item =>
              item.id === targetItemId
                ? {
                  ...item,
                  images: [...(item?.images || []), ...uploadedImages]
                }
                : item
            )
          );
        } else {
          // Update new menu item
          setNewMenuItem(prev => ({
            ...prev,
            images: [...prev.images, ...uploadedImages]
          }));
        }

        toast.success("Images uploaded successfully");
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle image URL addition
  const handleImageUrlAdd = (url: string, targetItemId?: string) => {
    if (!url) return

    if (targetItemId) {
      // Add URL to existing menu item
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === targetItemId
            ? {
              ...item,
              images: item?.images ? [...item.images, url] : [url]
            }
            : item
        )
      );
    } else {
      // Add URL to new menu item
      setNewMenuItem(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  }

  // Handle image removal
  const handleImageRemove = (index: number, targetItemId?: string) => {
    if (targetItemId) {
      // Remove image from existing menu item
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.id === targetItemId
            ? { ...item, images: item.images.filter((_, i) => i !== index) }
            : item
        )
      );
    } else {
      // Remove image from new menu item
      setNewMenuItem(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
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
                    <option key={category.id} value={category.id}>
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
                    {isUploading && (
                      <div className="mt-2 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                      </div>
                    )}
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
                {newMenuItem.images?.length > 0 && (
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
            
            {/* Category Filter Tabs */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <Button 
                  variant={!activeCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(null)}
                  className="text-xs"
                >
                  All Items
                </Button>
                {['Appetizer', 'Main', 'Dessert', 'Beverage', 'Special', 'Fruits'].map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                    className="text-xs"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {menuItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No menu items added yet</p>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const filteredItems = menuItems.filter(item => 
                    !activeCategory || categories.find(cat => cat.id === item.category)?.name === activeCategory
                  );
                  
                  return filteredItems.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No items in this category</p>
                  ) : (
                    filteredItems.map((item) => (
                      <div key={item.id} className="border rounded-md p-4">
                        {!item.isEditing ? (
                          // View Mode
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                              {item.images && item.images?.length > 0 && (
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
                                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                    {categories.find(cat => cat.id === item.category)?.name || item.category}
                                  </span>
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
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMenuItem(item.id)}
                              >
                                Edit Item
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMenuItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Edit Mode - Form Fields
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-4">Edit Menu Item</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label htmlFor={`edit-name-${item.id}`}>Item Name</Label>
                                <Input
                                  id={`edit-name-${item.id}`}
                                  value={item.editData?.name || ""}
                                  onChange={(e) => handleUpdateEditData(item.id, "name", e.target.value)}
                                  placeholder="e.g. Margherita Pizza"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`edit-price-${item.id}`}>Price</Label>
                                <Input
                                  id={`edit-price-${item.id}`}
                                  type="number"
                                  value={item.editData?.price || ""}
                                  onChange={(e) => handleUpdateEditData(item.id, "price", parseFloat(e.target.value) || 0)}
                                  placeholder="e.g. 12.99"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <Label htmlFor={`edit-description-${item.id}`}>Description</Label>
                              <Textarea
                                id={`edit-description-${item.id}`}
                                value={item.editData?.description || ""}
                                onChange={(e) => handleUpdateEditData(item.id, "description", e.target.value)}
                                placeholder="Brief description of the item"
                                rows={2}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label htmlFor={`edit-category-${item.id}`}>Category</Label>
                                <div className="relative">
                                  <select
                                    id={`edit-category-${item.id}`}
                                    value={item.editData?.category || ""}
                                    onChange={(e) => handleUpdateEditData(item.id, "category", e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  >
                                    {categories.map((category) => (
                                      <option key={category.id} value={category.id}>
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-8">
                                <Switch
                                  id={`edit-available-${item.id}`}
                                  checked={item.editData?.available || false}
                                  onCheckedChange={(checked) => handleUpdateEditData(item.id, "available", checked)}
                                />
                                <Label htmlFor={`edit-available-${item.id}`}>Available</Label>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4 mb-4">
                              <Button
                                variant="default"
                                onClick={() => handleSaveMenuItem(item.id)}
                              >
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleCancelEdit(item.id)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Image Gallery - Only show in view mode */}
                        {item.images && item.images?.length > 0 && !item.isEditing && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Images ({item.images?.length})</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {item.images.map((image, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`${item.name} image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Image Editing Section - Only show in edit mode */}
                        {item.isEditing && (
                          <div className="mt-4 border-t pt-4">
                            <h4 className="text-sm font-medium mb-2">Manage Images</h4>

                            {/* Image Upload Area */}
                            <div
                              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors mb-4"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault()
                                handleImageUpload(e.dataTransfer.files, item.id)
                              }}
                              onClick={() => {
                                const input = document.createElement('input')
                                input.type = 'file'
                                input.multiple = true
                                input.accept = 'image/*'
                                input.onchange = (e) => handleImageUpload((e.target as HTMLInputElement).files, item.id)
                                input.click()
                              }}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Upload className="h-6 w-6 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  Drag & drop images here, or click to select files
                                </p>
                                {isUploading && (
                                  <div className="mt-2 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Image URL Input */}
                            <div className="flex gap-2 mb-4">
                              <Input
                                type="url"
                                placeholder="Or enter image URL..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleImageUrlAdd(e.currentTarget.value, item.id)
                                    e.currentTarget.value = ''
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const input = document.querySelector(`input[type="url"]`) as HTMLInputElement
                                  if (input && input.value) {
                                    handleImageUrlAdd(input.value, item.id)
                                    input.value = ''
                                  }
                                }}
                              >
                                Add URL
                              </Button>
                            </div>

                            {/* Image Preview Grid with Delete */}
                            {item.images?.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {item.images.map((image, index) => (
                                  <div key={index} className="relative group aspect-square">
                                    <img
                                      src={image}
                                      alt={`${item.name} image ${index + 1}`}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleImageRemove(index, item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MenuTab

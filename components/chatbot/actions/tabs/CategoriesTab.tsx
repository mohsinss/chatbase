"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

interface Category {
  id: string
  name: string
}

interface CategoriesTabProps {
  categories: Category[]
  setCategories: (categories: Category[]) => void
  menuItems: MenuItem[]
  setMenuItems: (items: MenuItem[]) => void
}

const CategoriesTab = ({ categories, setCategories, menuItems, setMenuItems }: CategoriesTabProps) => {
  const [newCategory, setNewCategory] = useState<string>("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState<string>("")

  // Category management functions
  const handleAddCategory = () => {
    if (!newCategory) {
      toast.error("Category name is required")
      return
    }

    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      toast.error("Category already exists")
      return
    }

    const newCategoryItem: Category = {
      id: Date.now().toString(),
      name: newCategory
    }

    setCategories([...categories, newCategoryItem])
    setNewCategory("")
  }

  const handleEditCategory = (id: string) => {
    const category = categories.find(cat => cat.id === id)
    if (category) {
      setEditingCategory(id)
      setEditCategoryName(category.name)
    }
  }

  const handleUpdateCategory = () => {
    if (!editCategoryName) {
      toast.error("Category name is required")
      return
    }

    // Check if category name already exists (excluding the current one)
    if (categories.some(cat => cat.name.toLowerCase() === editCategoryName.toLowerCase() && cat.id !== editingCategory)) {
      toast.error("Category name already exists")
      return
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory ? { ...cat, name: editCategoryName } : cat
    ))

    // Update menu items that use this category
    const oldCategoryName = categories.find(cat => cat.id === editingCategory)?.name
    if (oldCategoryName) {
      setMenuItems(menuItems.map(item => 
        item.category === oldCategoryName ? { ...item, category: editCategoryName } : item
      ))
    }

    setEditingCategory(null)
    setEditCategoryName("")
  }

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id)
    if (!categoryToDelete) return

    // Check if any menu items use this category
    const itemsUsingCategory = menuItems.filter(item => item.category === categoryToDelete.name)
    
    if (itemsUsingCategory.length > 0) {
      toast.error(`Cannot delete category "${categoryToDelete.name}" because it is used by ${itemsUsingCategory.length} menu item(s)`)
      return
    }

    setCategories(categories.filter(cat => cat.id !== id))
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu Categories</CardTitle>
          <p className="text-sm text-gray-500">
            Manage categories for organizing your menu items
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <div className="flex items-end gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="new-category">New Category</Label>
                <Input
                  id="new-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Desserts"
                />
              </div>
              <Button onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>

            {/* Categories List */}
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-4">Menu Categories</h3>
              {categories.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No categories added yet</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-md p-4">
                      {editingCategory === category.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleUpdateCategory}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setEditingCategory(null)
                              setEditCategoryName("")
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{category.name}</div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesTab

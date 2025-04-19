"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
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

interface MenuTabProps {
  menuItems: MenuItem[]
  setMenuItems: (items: MenuItem[]) => void
  categories: Category[]
}

const MenuTab = ({ menuItems, setMenuItems, categories }: MenuTabProps) => {
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: categories.length > 0 ? categories[0].name : "Main",
    available: true
  })

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
      available: true
    })
  }

  // Handle deleting a menu item
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
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

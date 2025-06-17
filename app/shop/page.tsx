"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Coins, Dog, Cat, Bird, Fish, TreePine, Flower, Home, Palette } from "lucide-react"
import Link from "next/link"

interface ShopItem {
  id: number
  name: string
  price: number
  category: "animals" | "decorations" | "buildings"
  icon: any
  description: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  owned: boolean
}

export default function ShopPage() {
  const [userPoints, setUserPoints] = useState(150)
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    // Animals
    {
      id: 1,
      name: "Golden Retriever",
      price: 50,
      category: "animals",
      icon: Dog,
      description: "A loyal companion for your island",
      rarity: "Common",
      owned: false,
    },
    {
      id: 2,
      name: "Siamese Cat",
      price: 40,
      category: "animals",
      icon: Cat,
      description: "An elegant feline friend",
      rarity: "Common",
      owned: true,
    },
    {
      id: 3,
      name: "Peacock",
      price: 120,
      category: "animals",
      icon: Bird,
      description: "A majestic bird with beautiful plumage",
      rarity: "Rare",
      owned: false,
    },
    {
      id: 4,
      name: "Koi Fish",
      price: 80,
      category: "animals",
      icon: Fish,
      description: "Colorful fish for your pond",
      rarity: "Common",
      owned: false,
    },

    // Decorations
    {
      id: 5,
      name: "Sunflower Field",
      price: 60,
      category: "decorations",
      icon: Flower,
      description: "Van Gogh inspired sunflower garden",
      rarity: "Common",
      owned: false,
    },
    {
      id: 6,
      name: "Cypress Tree",
      price: 90,
      category: "decorations",
      icon: TreePine,
      description: "Iconic swirling cypress tree",
      rarity: "Rare",
      owned: false,
    },
    {
      id: 7,
      name: "Starry Night Sky",
      price: 200,
      category: "decorations",
      icon: Palette,
      description: "Transform your sky into Starry Night",
      rarity: "Epic",
      owned: false,
    },

    // Buildings
    {
      id: 8,
      name: "Artist Studio",
      price: 150,
      category: "buildings",
      icon: Home,
      description: "A cozy studio for creating art",
      rarity: "Rare",
      owned: false,
    },
    {
      id: 9,
      name: "Van Gogh Cafe",
      price: 300,
      category: "buildings",
      icon: Home,
      description: "The famous Cafe Terrace at Night",
      rarity: "Legendary",
      owned: false,
    },
  ])

  const handlePurchase = (item: ShopItem) => {
    if (userPoints >= item.price && !item.owned) {
      setUserPoints(userPoints - item.price)
      setShopItems(shopItems.map((shopItem) => (shopItem.id === item.id ? { ...shopItem, owned: true } : shopItem)))
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-600"
      case "Rare":
        return "bg-blue-600"
      case "Epic":
        return "bg-purple-600"
      case "Legendary":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const filterItemsByCategory = (category: string) => {
    return shopItems.filter((item) => item.category === category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-yellow-800 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-400/30">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">{userPoints}</span>
            <span className="text-sm text-blue-200">points</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">Van Gogh Marketplace</h1>
          <p className="text-xl text-blue-200">Build your artistic island paradise</p>
        </div>

        {/* Shop Tabs */}
        <Tabs defaultValue="animals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/30 backdrop-blur-sm">
            <TabsTrigger value="animals" className="data-[state=active]:bg-yellow-600">
              <Dog className="w-4 h-4 mr-2" />
              Animals
            </TabsTrigger>
            <TabsTrigger value="decorations" className="data-[state=active]:bg-yellow-600">
              <Flower className="w-4 h-4 mr-2" />
              Decorations
            </TabsTrigger>
            <TabsTrigger value="buildings" className="data-[state=active]:bg-yellow-600">
              <Home className="w-4 h-4 mr-2" />
              Buildings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="animals">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItemsByCategory("animals").map((item) => (
                <Card
                  key={item.id}
                  className="bg-black/40 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <item.icon className="w-8 h-8 text-yellow-400" />
                      <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                    </div>
                    <CardTitle className="text-white">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={item.owned || userPoints < item.price}
                        className={`${
                          item.owned
                            ? "bg-green-600 hover:bg-green-600"
                            : userPoints < item.price
                              ? "bg-gray-600 hover:bg-gray-600"
                              : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {item.owned ? "Owned" : userPoints < item.price ? "Not enough points" : "Buy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="decorations">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItemsByCategory("decorations").map((item) => (
                <Card
                  key={item.id}
                  className="bg-black/40 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <item.icon className="w-8 h-8 text-yellow-400" />
                      <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                    </div>
                    <CardTitle className="text-white">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={item.owned || userPoints < item.price}
                        className={`${
                          item.owned
                            ? "bg-green-600 hover:bg-green-600"
                            : userPoints < item.price
                              ? "bg-gray-600 hover:bg-gray-600"
                              : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {item.owned ? "Owned" : userPoints < item.price ? "Not enough points" : "Buy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buildings">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterItemsByCategory("buildings").map((item) => (
                <Card
                  key={item.id}
                  className="bg-black/40 backdrop-blur-sm border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <item.icon className="w-8 h-8 text-yellow-400" />
                      <Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge>
                    </div>
                    <CardTitle className="text-white">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={item.owned || userPoints < item.price}
                        className={`${
                          item.owned
                            ? "bg-green-600 hover:bg-green-600"
                            : userPoints < item.price
                              ? "bg-gray-600 hover:bg-gray-600"
                              : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {item.owned ? "Owned" : userPoints < item.price ? "Not enough points" : "Buy"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

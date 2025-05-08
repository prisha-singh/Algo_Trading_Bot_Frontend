"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingCart, Settings, ChevronRight, ChevronLeft, BarChart3 } from "lucide-react"

const navItems = [
  {
    title: "Strategies",
    href: "/strategies",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Check if sidebar state is stored
    const sidebarState = localStorage.getItem("sidebarCollapsed")
    if (sidebarState) {
      setIsCollapsed(sidebarState === "true")
    }
  }, [])

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))
  }

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <BarChart3 className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold"
            >
              AlgoTrade
            </motion.span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                isCollapsed && "justify-center px-0",
              )}
            >
              <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <item.icon className="h-5 w-5" />
              </motion.div>
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-medium text-primary-foreground">{username.charAt(0).toUpperCase()}</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-muted-foreground">Trader</p>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"} Sidebar</span>
      </Button>
    </div>
  )
}

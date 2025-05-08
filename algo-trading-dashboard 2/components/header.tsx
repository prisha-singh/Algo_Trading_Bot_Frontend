"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [marketStatus, setMarketStatus] = useState<"open" | "closed">("closed")

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Check if market is open (9:15 AM - 3:30 PM IST on weekdays)
      const isWeekday = now.getDay() > 0 && now.getDay() < 6
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTimeInMinutes = hours * 60 + minutes
      const marketOpenInMinutes = 9 * 60 + 15
      const marketCloseInMinutes = 15 * 60 + 30

      setMarketStatus(
        isWeekday && currentTimeInMinutes >= marketOpenInMinutes && currentTimeInMinutes <= marketCloseInMinutes
          ? "open"
          : "closed",
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format date and time for India
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentTime)

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentTime)

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <p className="text-sm font-medium">{formattedDate}</p>
            <p className="text-xs text-muted-foreground">{formattedTime}</p>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${marketStatus === "open" ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-xs font-medium">
              NSE: {marketStatus === "open" ? "Market Open" : "Market Closed"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

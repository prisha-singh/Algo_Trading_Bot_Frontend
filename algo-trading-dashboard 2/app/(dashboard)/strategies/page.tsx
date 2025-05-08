"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { StrategyCard } from "@/components/strategy-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the strategy type
interface Strategy {
  id: string
  name: string
  description: string
  accuracy: number
  isActive: boolean
  isAuto: boolean
}

// Define the signal type
interface Signal {
  id: string
  strategyId: string
  type: "BUY" | "SELL"
  instrument: string
  price: number
  timestamp: string
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: "1",
      name: "Bollinger Bands + RSI + ATR",
      description: "Combines Bollinger Bands, RSI, and ATR for signal generation",
      accuracy: 78,
      isActive: false,
      isAuto: false,
    },
    {
      id: "2",
      name: "Supertrend",
      description: "Uses Supertrend indicator for trend following",
      accuracy: 72,
      isActive: false,
      isAuto: false,
    },
    {
      id: "3",
      name: "SMA 50/200 Crossover",
      description: "Simple Moving Average crossover strategy",
      accuracy: 80,
      isActive: false,
      isAuto: false,
    },
  ])

  const [signals, setSignals] = useState<Record<string, Signal[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Function to toggle strategy active state
  const toggleActive = async (id: string) => {
    try {
      const strategy = strategies.find((s) => s.id === id)
      if (!strategy) return

      const newState = !strategy.isActive

      // If activating, call the track-signal endpoint
      if (newState) {
        setIsLoading(true)
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/track-signal`, {
          strategyId: id,
          active: true,
        })

        // Fetch initial signals
        await fetchSignals(id)
      }

      // Update local state
      setStrategies(strategies.map((s) => (s.id === id ? { ...s, isActive: newState } : s)))

      setIsLoading(false)
    } catch (err) {
      console.error("Error toggling strategy:", err)
      setError("Failed to toggle strategy. Please try again.")
      setIsLoading(false)
    }
  }

  // Function to toggle auto/manual mode
  const toggleAuto = (id: string) => {
    setStrategies(strategies.map((s) => (s.id === id ? { ...s, isAuto: !s.isAuto } : s)))
  }

  // Function to fetch signals for a strategy
  const fetchSignals = async (strategyId: string) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-signals`, {
        params: { strategyId },
      })

      setSignals((prev) => ({
        ...prev,
        [strategyId]: response.data,
      }))

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching signals:", err)
      setError("Failed to fetch signals. Please try again.")
      setIsLoading(false)
    }
  }

  // Fetch signals for active strategies periodically
  useEffect(() => {
    const activeStrategies = strategies.filter((s) => s.isActive)
    if (activeStrategies.length === 0) return

    const fetchAllSignals = async () => {
      for (const strategy of activeStrategies) {
        await fetchSignals(strategy.id)
      }
    }

    // Initial fetch
    fetchAllSignals()

    // Set up interval for periodic fetching
    const interval = setInterval(fetchAllSignals, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [strategies])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Trading Strategies</h1>
        <p className="text-muted-foreground">Manage and monitor your algorithmic trading strategies</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Strategies</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="auto">Auto Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StrategyCard
                  strategy={strategy}
                  signals={signals[strategy.id] || []}
                  onToggleActive={() => toggleActive(strategy.id)}
                  onToggleAuto={() => toggleAuto(strategy.id)}
                  onRefreshSignals={() => fetchSignals(strategy.id)}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {strategies
              .filter((s) => s.isActive)
              .map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StrategyCard
                    strategy={strategy}
                    signals={signals[strategy.id] || []}
                    onToggleActive={() => toggleActive(strategy.id)}
                    onToggleAuto={() => toggleAuto(strategy.id)}
                    onRefreshSignals={() => fetchSignals(strategy.id)}
                    isLoading={isLoading}
                  />
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="auto" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {strategies
              .filter((s) => s.isAuto)
              .map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StrategyCard
                    strategy={strategy}
                    signals={signals[strategy.id] || []}
                    onToggleActive={() => toggleActive(strategy.id)}
                    onToggleAuto={() => toggleAuto(strategy.id)}
                    onRefreshSignals={() => fetchSignals(strategy.id)}
                    isLoading={isLoading}
                  />
                </motion.div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {error && <div className="bg-destructive/15 text-destructive p-4 rounded-md mt-4">{error}</div>}
    </div>
  )
}

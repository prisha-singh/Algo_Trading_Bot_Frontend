"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"

interface Strategy {
  id: string
  name: string
  description: string
  accuracy: number
  isActive: boolean
  isAuto: boolean
}

interface Signal {
  id: string
  strategyId: string
  type: "BUY" | "SELL"
  instrument: string
  price: number
  timestamp: string
}

interface StrategyCardProps {
  strategy: Strategy
  signals: Signal[]
  onToggleActive: () => void
  onToggleAuto: () => void
  onRefreshSignals: () => void
  isLoading: boolean
}

export function StrategyCard({
  strategy,
  signals,
  onToggleActive,
  onToggleAuto,
  onRefreshSignals,
  isLoading,
}: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{strategy.name}</CardTitle>
            <CardDescription className="mt-1">{strategy.description}</CardDescription>
          </div>
          <Badge variant={strategy.accuracy >= 75 ? "default" : "secondary"}>{strategy.accuracy}% Accuracy</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch checked={strategy.isActive} onCheckedChange={onToggleActive} disabled={isLoading} />
              <span className="text-sm font-medium">{strategy.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{strategy.isAuto ? "Auto" : "Manual"}</span>
            <Switch
              checked={strategy.isAuto}
              onCheckedChange={onToggleAuto}
              disabled={!strategy.isActive || isLoading}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!strategy.isActive}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Signals
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              View Signals
            </>
          )}
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Recent Signals</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onRefreshSignals}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </div>

                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : signals.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {signals.map((signal) => (
                      <div
                        key={signal.id}
                        className={`flex items-center justify-between rounded-md p-2 text-sm ${
                          signal.type === "BUY"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {signal.type === "BUY" ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span className="font-medium">{signal.instrument}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>₹{signal.price.toFixed(2)}</span>
                          <span className="text-xs opacity-70">{formatTimestamp(signal.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No signals available. Activate the strategy to start receiving signals.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>{strategy.isActive ? "Monitoring" : "Paused"}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

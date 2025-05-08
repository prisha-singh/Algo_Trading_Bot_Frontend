"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from "lucide-react"

interface OrderFormData {
  instrument: string
  quantity: number
  price: number
  exchange: string
  orderType: string
  action: string
}

export default function OrdersPage() {
  const { toast } = useToast()
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OrderFormData>({
    instrument: "",
    quantity: 1,
    price: 0,
    exchange: "NSE",
    orderType: "MARKET",
    action: "BUY",
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "quantity" || name === "price" ? Number.parseFloat(value) : value,
    })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (confirmed = false) => {
    // If in manual mode and not confirmed, don't submit
    if (!isAutoMode && !confirmed) {
      return
    }

    try {
      setIsSubmitting(true)

      // Send order to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/place-order`, formData)

      // Show success toast
      toast({
        title: "Order Placed Successfully",
        description: `${formData.action} order for ${formData.quantity} ${formData.instrument} at ${formData.price}`,
        variant: "default",
      })

      // Reset form
      setFormData({
        instrument: "",
        quantity: 1,
        price: 0,
        exchange: "NSE",
        orderType: "MARKET",
        action: "BUY",
      })
    } catch (error) {
      console.error("Error placing order:", error)

      // Show error toast
      toast({
        title: "Failed to Place Order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Execution</h1>
        <p className="text-muted-foreground">Place manual or automatic orders based on trading signals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Place New Order</CardTitle>
              <CardDescription>Fill in the details to execute a new trading order</CardDescription>
              <div className="flex items-center space-x-2 pt-2">
                <Label htmlFor="auto-mode" className="text-sm font-medium">
                  Auto Mode
                </Label>
                <Switch id="auto-mode" checked={isAutoMode} onCheckedChange={setIsAutoMode} />
                <span className="text-xs text-muted-foreground ml-2">
                  {isAutoMode ? "Orders will execute automatically" : "Orders require confirmation"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Input
                    id="instrument"
                    name="instrument"
                    placeholder="e.g., RELIANCE, INFY, TATASTEEL"
                    value={formData.instrument}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.05"
                      value={formData.price}
                      onChange={handleChange}
                      disabled={formData.orderType === "MARKET"}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exchange">Exchange</Label>
                    <Select value={formData.exchange} onValueChange={(value) => handleSelectChange("exchange", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Exchange" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NSE">NSE</SelectItem>
                        <SelectItem value="BSE">BSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderType">Order Type</Label>
                    <Select
                      value={formData.orderType}
                      onValueChange={(value) => handleSelectChange("orderType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Order Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MARKET">Market</SelectItem>
                        <SelectItem value="LIMIT">Limit</SelectItem>
                        <SelectItem value="SL">Stop Loss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="mb-2 block">Action</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formData.action === "BUY" ? "default" : "outline"}
                      className={`h-16 ${formData.action === "BUY" ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => handleSelectChange("action", "BUY")}
                    >
                      <ArrowUpCircle className="mr-2 h-5 w-5" />
                      Buy
                    </Button>
                    <Button
                      type="button"
                      variant={formData.action === "SELL" ? "default" : "outline"}
                      className={`h-16 ${formData.action === "SELL" ? "bg-red-600 hover:bg-red-700" : ""}`}
                      onClick={() => handleSelectChange("action", "SELL")}
                    >
                      <ArrowDownCircle className="mr-2 h-5 w-5" />
                      Sell
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              {isAutoMode ? (
                <Button
                  className="w-full"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || !formData.instrument || formData.quantity < 1}
                >
                  {isSubmitting ? "Processing..." : "Place Order Automatically"}
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={isSubmitting || !formData.instrument || formData.quantity < 1}>
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to place a {formData.action} order for {formData.quantity}{" "}
                        {formData.instrument}
                        {formData.orderType !== "MARKET" ? ` at ${formData.price}` : ""} on {formData.exchange}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleSubmit(true)}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Guidelines</CardTitle>
              <CardDescription>Important information about placing orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium">Market Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      NSE market hours are from 9:15 AM to 3:30 PM IST, Monday to Friday. Orders placed outside these
                      hours will be queued.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Order Types</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium">Market:</span> Executes at the best available price
                  </li>
                  <li>
                    <span className="font-medium">Limit:</span> Executes at the specified price or better
                  </li>
                  <li>
                    <span className="font-medium">Stop Loss:</span> Triggers when price reaches a specified level
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Auto Mode</h4>
                <p className="text-sm text-muted-foreground">
                  When enabled, orders will be placed automatically without confirmation. Use with caution and only when
                  you're confident in your strategy.
                </p>
              </div>

              <div className="rounded-md bg-yellow-500/10 p-4 border border-yellow-500/20">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-medium text-yellow-500">Risk Warning</h4>
                    <p className="text-sm text-yellow-500/80">
                      Trading involves significant risk. Always ensure you understand the risks before placing orders.
                      Never trade with funds you cannot afford to lose.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

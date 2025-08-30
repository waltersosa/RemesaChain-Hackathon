"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { getFlarePrice } from "@/lib/flare-oracle"
import { useLanguage } from "@/components/language-provider"

interface RateData {
  rate: number
  change: number
  trend: "up" | "down" | "stable"
  lastUpdate: Date
}

export function RealTimeRates() {
  const { t } = useLanguage()
  const [rateData, setRateData] = useState<RateData>({
    rate: 1.0,
    change: 0,
    trend: "stable",
    lastUpdate: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const currentRate = await getFlarePrice()
        const previousRate = rateData.rate
        const change = ((currentRate - previousRate) / previousRate) * 100

        setRateData({
          rate: currentRate,
          change: Math.abs(change),
          trend: change > 0.01 ? "up" : change < -0.01 ? "down" : "stable",
          lastUpdate: new Date(),
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching rates:", error)
        setIsLoading(false)
      }
    }

    // Fetch immediately
    fetchRates()

    // Update every 30 seconds
    const interval = setInterval(fetchRates, 30000)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = () => {
    switch (rateData.trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = () => {
    switch (rateData.trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm">USDC/USD</span>
              {getTrendIcon()}
            </div>
            <div className="text-2xl font-bold text-primary">{isLoading ? "..." : `$${rateData.rate.toFixed(4)}`}</div>
          </div>

          <div className="text-right">
            <div className={`text-sm font-medium ${getTrendColor()}`}>
              {rateData.trend !== "stable" && (rateData.trend === "up" ? "+" : "-")}
              {rateData.change.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {t("rates.last-update")}: {rateData.lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            {t("rates.live-oracle")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

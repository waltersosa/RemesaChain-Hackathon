export interface PriceData {
  symbol: string
  price: number
  timestamp: string
  confidence: number
  source: "FTSO" | "fallback"
}

export interface ConversionRate {
  from: string
  to: string
  rate: number
  timestamp: string
  fees: {
    network: number
    platform: number
    total: number
  }
}

export class FlareOracle {
  private static instance: FlareOracle
  private priceCache: Map<string, PriceData> = new Map()
  private lastUpdate = 0
  private readonly UPDATE_INTERVAL = 30000 // 30 seconds

  static getInstance(): FlareOracle {
    if (!FlareOracle.instance) {
      FlareOracle.instance = new FlareOracle()
    }
    return FlareOracle.instance
  }

  async getUSDCPrice(): Promise<PriceData> {
    const now = Date.now()
    const cached = this.priceCache.get("USDC/USD")

    // Return cached data if recent
    if (cached && now - this.lastUpdate < this.UPDATE_INTERVAL) {
      return cached
    }

    // Simulate FTSO price feed
    const priceData: PriceData = {
      symbol: "USDC/USD",
      price: 0.9998 + (Math.random() - 0.5) * 0.0004, // Simulate slight USDC fluctuation
      timestamp: new Date().toISOString(),
      confidence: 0.99,
      source: "FTSO",
    }

    this.priceCache.set("USDC/USD", priceData)
    this.lastUpdate = now

    console.log("[v0] FTSO Price Update:", priceData)
    return priceData
  }

  async getConversionRate(amount: number, from = "USDC", to = "USD"): Promise<ConversionRate> {
    const priceData = await this.getUSDCPrice()

    const conversionRate: ConversionRate = {
      from,
      to,
      rate: priceData.price,
      timestamp: priceData.timestamp,
      fees: {
        network: 0.25, // Network fee in USD
        platform: 1.0, // RemesaChain platform fee
        total: 1.25,
      },
    }

    return conversionRate
  }

  async calculateReceiveAmount(sendAmount: number): Promise<{
    grossAmount: number
    fees: number
    netAmount: number
    rate: number
    breakdown: {
      originalAmount: number
      exchangeRate: number
      grossUSD: number
      networkFee: number
      platformFee: number
      finalAmount: number
    }
  }> {
    const conversion = await this.getConversionRate(sendAmount)

    const grossAmount = sendAmount * conversion.rate
    const fees = conversion.fees.total
    const netAmount = grossAmount - fees

    return {
      grossAmount,
      fees,
      netAmount,
      rate: conversion.rate,
      breakdown: {
        originalAmount: sendAmount,
        exchangeRate: conversion.rate,
        grossUSD: grossAmount,
        networkFee: conversion.fees.network,
        platformFee: conversion.fees.platform,
        finalAmount: netAmount,
      },
    }
  }

  // Get historical price data for compliance and auditing
  async getPriceHistory(hours = 24): Promise<PriceData[]> {
    const history: PriceData[] = []
    const now = new Date()

    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      history.push({
        symbol: "USDC/USD",
        price: 0.9998 + (Math.random() - 0.5) * 0.0004,
        timestamp: timestamp.toISOString(),
        confidence: 0.99,
        source: "FTSO",
      })
    }

    return history.reverse()
  }
}

export async function getFlarePrice(): Promise<number> {
  const oracle = FlareOracle.getInstance()
  const priceData = await oracle.getUSDCPrice()
  return priceData.price
}

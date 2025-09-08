import { useState, useEffect } from 'react'

// Custom hook for fetching real data from Google Sheets
export function useRealData() {
  const [tradingAdvice, setTradingAdvice] = useState('Loading...')
  const [confidence, setConfidence] = useState(0)
  const [marketData, setMarketData] = useState<any[]>([])
  const [advisorData, setAdvisorData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      // Fetch real trading advice from Advisor_Output
      const advisorResponse = await fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output')
      const advisorResult = await advisorResponse.json()
      
      if (advisorResult && advisorResult.length > 0) {
        setTradingAdvice(advisorResult[0].Recommendation || advisorResult[0].recommendation || 'No advice available')
        setConfidence(parseFloat(advisorResult[0].Confidence || advisorResult[0].confidence || '0'))
        setAdvisorData(advisorResult)
      }

      // Fetch real market data from Price_Data
      try {
        const priceResponse = await fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Price_Data')
        const priceResult = await priceResponse.json()
        
        if (priceResult && priceResult.length > 0) {
          setMarketData(priceResult)
        } else {
          // Use advisor data as fallback for market data
          setMarketData(advisorResult || [])
        }
      } catch (priceError) {
        console.log('Price_Data sheet not available, using Advisor_Output for market data')
        setMarketData(advisorResult || [])
      }

      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching real data:', error)
      setTradingAdvice('Unable to fetch trading advice')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  return {
    tradingAdvice,
    confidence,
    marketData,
    advisorData,
    isLoading,
    lastUpdate,
    refetch: fetchAllData
  }
}

// Specific hook for trading advice
export function useTradingAdvice() {
  const [advice, setAdvice] = useState('Loading...')
  const [confidence, setConfidence] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch real trading advice
    fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setAdvice(data[0].Recommendation || data[0].recommendation || 'No advice available')
          setConfidence(parseFloat(data[0].Confidence || data[0].confidence || '0'))
        }
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching advice:', error)
        setAdvice('Unable to fetch trading advice')
        setIsLoading(false)
      })
  }, [])

  return { advice, confidence, isLoading }
}

// Specific hook for market data
export function useMarketData() {
  const [marketData, setMarketData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch real market data
    fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Price_Data')
      .then(res => res.json())
      .then(data => {
        setMarketData(data || [])
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching market data:', error)
        // Fallback to Advisor_Output
        fetch('https://opensheet.elk.sh/1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo/Advisor_Output')
          .then(res => res.json())
          .then(data => setMarketData(data || []))
          .finally(() => setIsLoading(false))
      })
  }, [])

  return { marketData, isLoading }
}
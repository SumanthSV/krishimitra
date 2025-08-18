'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Loader2, AlertCircle, BarChart3, MapPin, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

// Types for the API response
interface ApiCropData {
  commodity: string
  state: string
  district: string
  market: string
  variety: string
  grade: string
  arrival_date: string
  min_price: string
  max_price: string
  modal_price: string
  Commodity: string
  State: string
  District: string
  Market: string
  Variety: string
  Grade: string
  Arrival_Date: string
  Min_Price: string
  Max_Price: string
  Modal_Price: string
}

interface ApiResponse {
  records: ApiCropData[]
  total: number
  count: number
  offset: number
}

// Indian States and Union Territories
const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
].sort()

// Common crop suggestions
const cropSuggestions = [
  'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Bajra', 'Jowar', 'Barley',
  'Gram', 'Tur', 'Moong', 'Urad', 'Masoor', 'Groundnut', 'Mustard', 'Sunflower',
  'Soybean', 'Sesamum', 'Niger', 'Safflower', 'Castor', 'Linseed', 'Potato',
  'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Okra', 'Chilli',
  'Turmeric', 'Coriander', 'Cumin', 'Fenugreek', 'Garlic', 'Ginger', 'Cardamom',
  'Black Pepper', 'Coconut', 'Areca Nut', 'Cashew', 'Tea', 'Coffee', 'Rubber',
  'Jute', 'Mesta', 'Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Pomegranate'
]

const translations = {
  en: {
    title: 'Crop Market Information',
    selectState: 'Select State',
    selectCommodity: 'Enter Commodity/Crop Name',
    commodityPlaceholder: 'Type crop name (e.g., Rice, Wheat, Cotton...)',
    result: 'Result',
    prices: 'Prices',
    modalPrice: 'Modal Price',
    grade: 'Grade',
    variety: 'Variety',
    loading: 'Loading...',
    error: 'Failed to load data',
    retry: 'Retry',
    noData: 'No data available for selected filters',
    selectBoth: 'Please select state and enter commodity name to view results',
    welcomeTitle: 'Welcome to Crop Market Information System',
    welcomeSubtitle: 'Get real-time market prices for agricultural commodities across India',
    instructions: 'Select a state and enter a commodity name to view current market prices and trends.',
    suggestions: 'Popular crops:',
    showingResults: 'Showing',
    of: 'of',
    results: 'results',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    searchResults: 'Search in results...',
    searchPlaceholder: 'Search by district, market, variety, grade, or price...',
    clearSearch: 'Clear search',
    noSearchResults: 'No results found for your search'
  },
  hi: {
    title: 'फसल बाजार जानकारी',
    selectState: 'राज्य चुनें',
    selectCommodity: 'वस्तु/फसल का नाम दर्ज करें',
    commodityPlaceholder: 'फसल का नाम टाइप करें (जैसे चावल, गेहूं, कपास...)',
    result: 'परिणाम',
    prices: 'मूल्य',
    modalPrice: 'मॉडल मूल्य',
    grade: 'ग्रेड',
    variety: 'किस्म',
    loading: 'लोड हो रहा है...',
    error: 'डेटा लोड करने में विफल',
    retry: 'पुनः प्रयास करें',
    noData: 'चयनित फिल्टर के लिए कोई डेटा उपलब्ध नहीं',
    selectBoth: 'परिणाम देखने के लिए कृपया राज्य चुनें और वस्तु का नाम दर्ज करें',
    welcomeTitle: 'फसल बाजार सूचना प्रणाली में आपका स्वागत है',
    welcomeSubtitle: 'भारत भर में कृषि वस्तुओं के लिए वास्तविक समय के बाजार मूल्य प्राप्त करें',
    instructions: 'वर्तमान बाजार मूल्य और रुझान देखने के लिए एक राज्य चुनें और वस्तु का नाम दर्ज करें।',
    suggestions: 'लोकप्रिय फसलें:',
    showingResults: 'दिखा रहे हैं',
    of: 'में से',
    results: 'परिणाम',
    previous: 'पिछला',
    next: 'अगला',
    page: 'पृष्ठ',
    searchResults: 'परिणामों में खोजें...',
    searchPlaceholder: 'जिला, बाजार, किस्म, ग्रेड या मूल्य द्वारा खोजें...',
    clearSearch: 'खोज साफ़ करें',
    noSearchResults: 'आपकी खोज के लिए कोई परिणाम नहीं मिला'
  }
}

const ITEMS_PER_PAGE = 10

export default function CropInfoPage() {
  const [language, setLanguage] = useState<'en'>('en')
  const [selectedState, setSelectedState] = useState('')
  const [commodityInput, setCommodityInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [results, setResults] = useState<ApiCropData[]>([])
  const [allResults, setAllResults] = useState<ApiCropData[]>([])
  const [filteredResults, setFilteredResults] = useState<ApiCropData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = translations[language]

  // Filter crop suggestions based on input
  const filteredSuggestions = cropSuggestions.filter(crop =>
    crop.toLowerCase().includes(commodityInput.toLowerCase())
  ).slice(0, 8)

  // Calculate pagination values for filtered results
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredResults.length)
  const paginatedResults = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Search function for filtering results
  const searchInResults = (query: string, data: ApiCropData[]) => {
    if (!query.trim()) return data

    const searchTerm = query.toLowerCase()
    return data.filter(record => {
      const district = (record.District || record.district || '').toLowerCase()
      const market = (record.Market || record.market || '').toLowerCase()
      const variety = (record.Variety || record.variety || '').toLowerCase()
      const grade = (record.Grade || record.grade || '').toLowerCase()
      const commodity = (record.Commodity || record.commodity || '').toLowerCase()
      const minPrice = (record.Min_Price || record.min_price || '').toString()
      const maxPrice = (record.Max_Price || record.max_price || '').toString()
      const modalPrice = (record.Modal_Price || record.modal_price || '').toString()

      return district.includes(searchTerm) ||
             market.includes(searchTerm) ||
             variety.includes(searchTerm) ||
             grade.includes(searchTerm) ||
             commodity.includes(searchTerm) ||
             minPrice.includes(searchTerm) ||
             maxPrice.includes(searchTerm) ||
             modalPrice.includes(searchTerm)
    })
  }

  // Handle search in results
  useEffect(() => {
    const filtered = searchInResults(searchQuery, allResults)
    setFilteredResults(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, allResults])

  // Fetch all results for the selected state and commodity
  const fetchAllResults = async () => {
    if (!selectedState || !commodityInput.trim()) return

    setLoading(true)
    setError(null)

    try {
      // First, get the total count
      const countResponse = await fetch(
        `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd0000010e30f72ab0aa45674921636e6cbe8864&format=json&filters[State]=${encodeURIComponent(selectedState)}&filters[Commodity]=${encodeURIComponent(commodityInput.trim())}&limit=1`
      )

      if (!countResponse.ok) {
        throw new Error(`HTTP error! status: ${countResponse.status}`)
      }

      const countData: ApiResponse = await countResponse.json()
      const total = countData.total || countData.count || 0

      if (total === 0) {
        setAllResults([])
        setFilteredResults([])
        setTotalResults(0)
        setLoading(false)
        return
      }

      // Fetch all results
      const response = await fetch(
        `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=579b464db66ec23bdd0000010e30f72ab0aa45674921636e6cbe8864&format=json&filters[State]=${encodeURIComponent(selectedState)}&filters[Commodity]=${encodeURIComponent(commodityInput.trim())}&limit=${total}`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      
      // Sort by arrival date (newest first)
      const sortedResults = (data.records || []).sort((a, b) => {
        const dateA = parseDate(a.Arrival_Date || a.arrival_date)
        const dateB = parseDate(b.Arrival_Date || b.arrival_date)
        return dateB.getTime() - dateA.getTime()
      })
      
      setAllResults(sortedResults)
      setFilteredResults(sortedResults)
      setTotalResults(total)
      setCurrentPage(1)
    } catch (err) {
      console.error('Error fetching results:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch results')
      setAllResults([])
      setFilteredResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  // Parse date in DD/MM/YYYY format
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date(0)
    
    try {
      // Handle DD/MM/YYYY format
      const parts = dateString.split('/')
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        const year = parseInt(parts[2], 10)
        return new Date(year, month, day)
      }
      return new Date(dateString)
    } catch {
      return new Date(0)
    }
  }

  // Reset to first page when filters change
  useEffect(() => {
    if (selectedState && commodityInput.trim()) {
      const timeoutId = setTimeout(() => {
        setSearchQuery('') // Clear search when filters change
        fetchAllResults()
      }, 500) // Debounce API calls

      return () => clearTimeout(timeoutId)
    } else {
      setAllResults([])
      setFilteredResults([])
      setTotalResults(0)
      setCurrentPage(1)
      setSearchQuery('')
    }
  }, [selectedState, commodityInput])

  const handleCommodityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommodityInput(e.target.value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCommodityInput(suggestion)
    setShowSuggestions(false)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    
    try {
      const date = parseDate(dateString)
      if (date.getTime() === 0) return dateString
      
      return date.toLocaleDateString('en-GB')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return isNaN(numPrice) ? price : numPrice.toFixed(0)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">{t.title}</h1>
          <button
            onClick={() => setLanguage(language === 'en' ? 'en' : 'en')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {language === 'en' ? 'English' : 'English'}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* State Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.selectState}
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option value="">{t.selectState}</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black pointer-events-none" />
              </div>
            </div>

            {/* Commodity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.selectCommodity}
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                  <input
                    type="text"
                    value={commodityInput}
                    onChange={handleCommodityChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={t.commodityPlaceholder}
                    className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && commodityInput && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Popular Crops */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-3">{t.suggestions}</p>
            <div className="flex flex-wrap gap-2">
              {cropSuggestions.slice(0, 12).map((crop, index) => (
                <button
                  key={index}
                  onClick={() => setCommodityInput(crop)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors"
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{t.error}: {error}</span>
              </div>
              <button
                onClick={fetchAllResults}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                {t.retry}
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        {!selectedState || !commodityInput.trim() ? (
          /* Placeholder Content */
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="text-center py-16 px-8">
              <img
                src="/placeholder.svg?height=300&width=400&text=Welcome+to+Crop+Market+System"
                alt="Welcome to Crop Market Information System"
                className="mx-auto mb-8 rounded-lg opacity-50"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.welcomeTitle}</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{t.welcomeSubtitle}</p>
              <p className="text-sm text-gray-500">{t.instructions}</p>
            </div>
          </div>
        ) : loading ? (
          /* Loading State */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">{t.loading}</p>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t.result}</h2>
                {totalResults > 0 && (
                  <div className="text-sm text-gray-600">
                    {t.showingResults} {startIndex}-{endIndex} {t.of} {filteredResults.length} {t.results}
                    {searchQuery && ` (filtered from ${totalResults})`}
                  </div>
                )}
              </div>

              {/* Search in Results */}
              {allResults.length > 0 && (
                <div className="mb-6">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full pl-10 pr-10 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {filteredResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {searchQuery ? t.noSearchResults : t.noData}
                  </p>
                  {!searchQuery && (
                    <p className="text-sm text-gray-400 mt-2">
                      Try checking the spelling or try a different commodity name
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-green-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-6">
                      <BarChart3 className="h-6 w-6 text-green-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {commodityInput} {t.prices}
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {paginatedResults.map((record, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="font-medium text-gray-900">
                                  {record.Market || record.market}, {record.District || record.district}
                                </span>
                              </div>
                              
                              <div className="text-lg font-bold text-green-600 mb-2">
                                ₹{formatPrice(record.Min_Price || record.min_price)} - ₹{formatPrice(record.Max_Price || record.max_price)}
                              </div>
                              
                              <div className="text-sm text-gray-600 space-x-4">
                                <span>
                                  {t.modalPrice}: ₹{formatPrice(record.Modal_Price || record.modal_price)}
                                </span>
                                <span>|</span>
                                <span>
                                  {t.grade}: {record.Grade || record.grade || 'N/A'}
                                </span>
                                <span>|</span>
                                <span>
                                  {t.variety}: {record.Variety || record.variety || record.Commodity || record.commodity}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right text-sm text-gray-500">
                              {formatDate(record.Arrival_Date || record.arrival_date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          {t.previous}
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                  currentPage === pageNum
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          })}
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t.next}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {t.page} {currentPage} {t.of} {totalPages}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

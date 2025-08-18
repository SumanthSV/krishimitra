"use client"

import { useState } from "react"
import { ExternalLink, Mic, Search, X, Loader2,AlertCircle } from "lucide-react"
import axios from "axios"

interface Scheme {
  name: string
  provider: string
  type: string
  description: string
  interest_rate: string
  loan_amount: string
  eligibility: string[]
  benefits: string[]
  source_url: string | null
}


interface SchemeRecommendationsProps {
  schemes: Scheme[]
}



export default function Bank_policies() {
  const [expandedScheme, setExpandedScheme] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [policies, setPolicies] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null) // NEW error state

 const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        setError("Please enter a query before searching.")
        return
      }

      setLoading(true)
      setError(null) // clear old errors

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/bank_policies`,
        { query: searchQuery },
        { headers: { "Content-Type": "application/json" } }
      )

      console.log("Response:", res.data)
      setPolicies(res.data)
    } catch (err: any) {
      console.error("Error during search:", err)
      setError("Something went wrong while fetching policies. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  const sampleQueries = [
    "What are the latest government schemes for farmers?",
    "How can I apply for a crop loan?",
    "Are there any subsidies for organic farming?",
    "What are the eligibility criteria for government schemes?",
  ]



  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
       <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find the Right Bank Policies</h1>
        <p className="text-gray-600 text-lg">Search and access policies tailored to your needs</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Type your query here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <Mic className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 
              ${loading
                ? "bg-green-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Sample Queries */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Sample Queries</h3>
          <div className="flex flex-wrap gap-3">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(query)}
                disabled={loading}
                className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Expanded Details View at the Top */}
      {expandedScheme !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setExpandedScheme(null)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-black">Scheme Details - {policies[expandedScheme].name}</h4>
                  <button
                    onClick={() => setExpandedScheme(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-black mb-2">Description</h5>
                      <p className="text-gray-700 text-sm leading-relaxed">{policies[expandedScheme].description}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">Eligibility</h5>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {Array.isArray(policies[expandedScheme].eligibility) 
                          ? policies[expandedScheme].eligibility.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))
                          : <li>{policies[expandedScheme].eligibility || "No eligibility info available"}</li>
                        }
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">Benefits</h5>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {Array.isArray(policies[expandedScheme].benefits) 
                          ? policies[expandedScheme].benefits.map((benefit, idx) => (
                              <li key={idx}>{benefit}</li>
                            ))
                          : <li>{policies[expandedScheme].benefits || "No benefits listed"}</li>
                        }
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-black mb-2">Interest Rate</h5>
                      <p className="text-gray-700 text-sm">{policies[expandedScheme].interest_rate}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">Loan Amount</h5>
                      <p className="text-gray-700 text-sm">{policies[expandedScheme].loan_amount}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">Provider</h5>
                      <p className="text-gray-700 text-sm">{policies[expandedScheme].provider}</p>
                    </div>

                    <div>
                      <h5 className="font-medium text-black mb-2">Type</h5>
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        {policies[expandedScheme].type}
                      </span>
                    </div>

                    {policies[expandedScheme].source_url && (
                      <div>
                        <h5 className="font-medium text-black mb-2">More Information</h5>
                        <a
                          href={policies[expandedScheme].source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                        >
                          Visit Official Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {policies.length > 0 && policies.map((scheme, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-black mb-1">{scheme.name}</h3>
              <p className="text-gray-500 text-sm mb-3">{scheme.provider}</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                {scheme.type}
              </span>
            </div>

            {/* Key Details */}
            <div className="space-y-2 mb-6">
              <div className="text-sm">
                <span className="font-medium text-black">Interest Rate: </span>
                <span className="text-black">{scheme.interest_rate}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-black">Max Amount: </span>
                <span className="text-black">{scheme.loan_amount}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-black">Benefits: </span>
                <span className="text-black">{truncateText(scheme.benefits.join(", "), 50)}...</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedScheme(index)}
                className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
              >
                View Details
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
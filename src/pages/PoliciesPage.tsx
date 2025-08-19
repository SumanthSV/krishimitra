import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import axios from 'axios';

import {
  Search,
  FileText,
  ExternalLink,
  Building,
  Users,
  Gift,
  CheckCircle,
  Loader2,
  AlertCircle,
  Mic,
  DollarSign,
  GraduationCap,
  Building2,
  Globe
} from 'lucide-react';
import VoiceInput from '../components/VoiceInput.tsx';



const PoliciesPage: React.FC = () => {
  const { language } = useLanguage();


  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  type Scheme = {
    type: string;
    name: string;
    department: string;
    description: string;
    benefits: string;
    eligibility: string;
    website: string;
  };

  const [policyData, setPolicyData] = useState<Scheme[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/schemes_query`,
        { query, language }
      );
      setPolicyData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'searchError');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setQuery(transcript);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearch();
    }
  };
  
  const getTypeIcon = (type: string) => {
    if (type.includes("Financial")) return <DollarSign className="w-5 h-5" />
    if (type.includes("Technical")) return <GraduationCap className="w-5 h-5" />
    return <Users className="w-5 h-5" />
  }

  const getTypeColor = (type: string) => {
    if (type.includes("Financial")) return "bg-green-100 text-green-800 border-green-200"
    if (type.includes("Technical")) return "bg-emerald-100 text-emerald-800 border-emerald-200"
    return "bg-teal-100 text-teal-800 border-teal-200"
  }


  const sampleQueries = [
   "Are there any government subsidies for organic farming in India?",
   "What financial assistance is available for small farmers?",
   "can i get any subsidy for ornamental fishing in haryana",
   "i am growing medicinal plants in himachal pradesh, are there any schemes for me?",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div> */}
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2">Schemes Recommendations</p>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">Search and access government schemes that best match your requirements.</p>
        </div>

        {/* Search Section */}
        <div className="text-gray-600 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative flex items-center flex-row">
                {/* <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                <input type="text"
                  className="text-black w-full p-2 border-2 border-gray-200 rounded-lg resize-none transition-all 
              placeholder-gray-400 "
             placeholder="Type your query here..."
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyPress={handleKeyPress}
             disabled={isLoading}
                />
                {/* <textarea
                  rows={2}
                /> */}
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <VoiceInput onResult={handleVoiceResult} disabled={isLoading} />
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !query.trim() || isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Get your policies"
                )}
              </button>
            </div>
          </div>

          {/* Sample Queries */}
          <div className="mt-4">
            {/* <p className="text-sm font-medium text-gray-700 mb-2">{t('policies.sampleQueries')}</p> */}
            <p className="text-sm font-medium text-gray-700 mb-2">Sample Queries</p>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sampleQuery, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(sampleQuery)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {sampleQuery}
                </button>
              ))}
            </div>
          </div>
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

        {/* Policy Results */}
       <div className="grid gap-6 md:grid-cols-2">
        {policyData.map((scheme, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">{getTypeIcon(scheme.type)}</div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(scheme.type)}`}

                    >
                      {scheme.type}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">{scheme.name}</h3>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{scheme.department}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{scheme.description}</p>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Key Benefits
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{scheme.benefits}</p>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Eligibility Criteria
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{scheme.eligibility}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Globe className="w-4 h-4" />
                  Visit Official Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* No Results State */}
        {!isLoading && !policyData && !error && query && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results</h3>
            <p className="text-gray-500">Try a different query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
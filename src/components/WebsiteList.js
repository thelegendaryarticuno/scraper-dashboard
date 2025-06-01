import { useTheme } from "./ThemeProvider";
import { useState, useEffect } from 'react';

export default function WebsiteList({ onSelectWebsite, selectedWebsite }) {
  const { theme } = useTheme();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await fetch('/api/contacts');
        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          setError('Invalid JSON response');
          setLoading(false);
          return;
        }
        // If the API returns an error object, handle it gracefully
        if (data && typeof data === 'object' && !Array.isArray(data) && data.code) {
          setError(data.message || 'API Error');
        } else if (Array.isArray(data)) {
          setWebsites(data);
        } else {
          setError('Invalid data format received');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch websites');
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const filteredWebsites = websites.filter(website =>
    typeof website?.sourceUrl === 'string' &&
    website.sourceUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6822d0] dark:border-[#759cff]"></div>
    </div>
  );

  if (error && typeof error === 'string') return (
    <div className="text-[#FA7D67] p-4 rounded-lg bg-[#FA7D67]/10">{error}</div>
  );

  // Helper to count contacts for a website
  function getContactCount(website) {
    // Try to count emails + phones + otherLinks if present, else fallback to 0
    let count = 0;
    if (Array.isArray(website?.email)) count += website.email.length;
    if (Array.isArray(website?.phone)) count += website.phone.length;
    if (Array.isArray(website?.otherLinks)) count += website.otherLinks.length;
    return count;
  }

  return (
    <div className="bg-[#181e2a] rounded-lg shadow-none h-full p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-white font-semibold text-sm tracking-wide">Websites</span>
        <button
          className="bg-[#7c3aed] hover:bg-[#a78bfa] transition-colors rounded-md p-1.5 flex items-center justify-center"
          title="Add Website"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
        </button>
      </div>
      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search or add website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded bg-[#23293a] text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] border border-[#23293a] focus:border-[#7c3aed] transition"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {/* Website List */}
      <div className="space-y-2 px-0 pb-2">
        {filteredWebsites.map((website) => {
          const isSelected = selectedWebsite?._id === website?._id;
          const contactCount = getContactCount(website);
          return (
            <div
              key={website?._id || website?.sourceUrl || Math.random()}
              onClick={() => onSelectWebsite(website)}
              className={`mx-2 rounded-md cursor-pointer transition-all duration-200 px-3 py-2.5
                ${isSelected
                  ? 'bg-[#2d2250] border border-[#7c3aed]'
                  : 'bg-[#23293a] hover:bg-[#2d2250] border border-transparent'
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-[#a5b4fc] hover:underline truncate max-w-[160px]">
                    {typeof website?.sourceUrl === 'string' ? website.sourceUrl : 'Unknown URL'}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#a78bfa] mr-1"></span>
                    <span className="text-xs text-[#bdbdbd]">
                      {website?.savedAt ? new Date(website.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="bg-[#1e293b] text-[#34d399] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#334155]">
                    {contactCount} contact{contactCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
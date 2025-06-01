import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import WebsiteList from './WebsiteList';
import ThemeToggle from './ThemeToggle';

export default function Dashboard() {
  const { theme } = useTheme();
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleWebsiteSelect = (website) => {
    setSelectedWebsite(website);
    if (window.innerWidth < 768) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121724] flex">
      {/* Sidebar Icons */}
      <div className="w-16 bg-[#e8e9fb] dark:bg-[#1a1f2e] p-4 flex flex-col items-center gap-6 border-r border-gray-200 dark:border-[#2a2f3e]">
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#2a2f3e] transition-colors"
          title="Refresh"
        >
          <svg className="w-6 h-6 text-[#6822d0] dark:text-[#759cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <ThemeToggle />

        <div className="p-2 rounded-lg bg-white dark:bg-[#2a2f3e]" title="User">
          <svg className="w-6 h-6 text-[#6822d0] dark:text-[#759cff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#e8e9fb] dark:bg-[#121724]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <WebsiteList onSelectWebsite={handleWebsiteSelect} selectedWebsite={selectedWebsite} />
            </div>
            <div className="md:col-span-2 hidden md:block">
              {selectedWebsite ? (
                <WebsiteDetails website={selectedWebsite} />
              ) : (
                <div className="bg-white dark:bg-[#1a1f2e] rounded-xl p-8 shadow-lg h-full flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-[#7460FF] to-[#6822d0] flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-[#121724] dark:text-white mb-2">No Website Selected</h2>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Select a website from the list to view its details, including contact information, phone numbers, and other links.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 md:hidden">
          <div className="bg-white dark:bg-[#121724] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#e8e9fb] dark:hover:bg-[#2a2f3e]"
            >
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {selectedWebsite && <WebsiteDetails website={selectedWebsite} />}
          </div>
        </div>
      )}
    </div>
  );
}

function WebsiteDetails({ website }) {
  if (!website) return null;

  // Ensure all data is properly formatted
  const emails = Array.isArray(website?.email) ? website.email : [];
  const phones = Array.isArray(website?.phone) ? website.phone : [];
  const otherLinks = Array.isArray(website?.otherLinks) ? website.otherLinks : [];

  // Helper to safely render primitive or string values only
  function renderPrimitive(val) {
    if (val == null) return '';
    if (typeof val === 'object') {
      // Try to render .code if present, else JSON.stringify
      if ('code' in val && typeof val.code !== 'object') {
        return String(val.code);
      }
      return JSON.stringify(val);
    }
    return String(val);
  }

  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-lg h-full flex flex-col">
      {/* Header Section - Fixed styling like the image */}
      <div className="p-6 border-b border-gray-200 dark:border-[#2a2f3e] bg-[#161b2a] rounded-t-xl">
        <div className="text-lg font-medium text-[#759cff] mb-1">
          {website?.sourceUrl || 'Website URL'}
        </div>
        <div className="text-sm text-gray-400">
          Last scraped: {website?.savedAt ? new Date(website.savedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) + ' at ' + new Date(website.savedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : 'Unknown'}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Phone Numbers Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#6822d0] rounded-full"></div>
            <h3 className="text-lg font-semibold text-[#121724] dark:text-white">Phone Numbers</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {phones.length > 0 ? (
              phones.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${renderPrimitive(phone)}`}
                  className="bg-[#1e2532] hover:bg-[#2a3441] text-[#e8e9fb] px-3 py-2 rounded-lg text-sm font-mono transition-colors border border-[#2a3441] hover:border-[#759cff]"
                >
                  {renderPrimitive(phone)}
                </a>
              ))
            ) : (
              <div className="col-span-full p-4 rounded-lg bg-[#1e2532] text-gray-400 text-center">
                No phone numbers found
              </div>
            )}
          </div>
        </div>

        {/* Email Addresses Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#6822d0] rounded-full"></div>
            <h3 className="text-lg font-semibold text-[#121724] dark:text-white">Email Addresses</h3>
          </div>
          <div className="space-y-3">
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${renderPrimitive(email)}`}
                  className="block bg-[#1e2532] hover:bg-[#2a3441] text-[#5FFAB8] px-4 py-3 rounded-lg transition-colors border border-[#2a3441] hover:border-[#5FFAB8]"
                >
                  {renderPrimitive(email)}
                </a>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-[#1e2532] text-gray-400 text-center">
                No email addresses found
              </div>
            )}
          </div>
        </div>

        {/* Discovered Links Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-[#6822d0] rounded-full"></div>
            <h3 className="text-lg font-semibold text-[#121724] dark:text-white">Discovered Links</h3>
          </div>
          <div className="space-y-3">
            {otherLinks.length > 0 ? (
              otherLinks.map((link, linkIdx) => {
                const linkText = renderPrimitive(link?.text) || 'Visit Link';
                const linkUrl = renderPrimitive(link?.url);
                return (
                  <a
                    key={link?._id || linkIdx}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#1e2532] hover:bg-[#2a3441] p-4 rounded-lg transition-colors border border-[#2a3441] hover:border-[#759cff] group"
                  >
                    <div className="text-[#759cff] font-medium text-sm mb-1 group-hover:text-[#759cff]">
                      {linkUrl}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {linkText}
                    </div>
                    {Array.isArray(link?.matchedKeywords) && link.matchedKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {link.matchedKeywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded bg-[#759cff]/10 text-[#759cff] border border-[#759cff]/20"
                          >
                            {renderPrimitive(keyword)}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                );
              })
            ) : (
              <div className="p-4 rounded-lg bg-[#1e2532] text-gray-400 text-center">
                No other links found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AUTH } from "@/services/authService";
import EBAY from '@/services/ebayService';

export default function EbayAuth() {
  const location = useLocation();
  const [status, setStatus] = useState("Processing eBay authentication...");
  const [code, setCode] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [synced, setSynced] = useState(0);

  useEffect(() => {
    // Get full URL including fragments (#)
    const fullUrl = window.location.href;

    // Extract code whether it’s in query or after #
    let extractedCode: string | null = null;
    const queryMatch = fullUrl.match(/[?&]code=([^#&]+)/);
    const fragmentMatch = fullUrl.match(/code=([^#]+)/);

    if (queryMatch) extractedCode = decodeURIComponent(queryMatch[1]);
    else if (fragmentMatch) extractedCode = decodeURIComponent(fragmentMatch[1]);

    console.log("Extracted full code:", extractedCode);

    if (extractedCode) {
      setCode(extractedCode);
      setStatus("⏳ Finalizing eBay store connection...");

      const sendCodeToBackend = async () => {
        const response = await AUTH.oauth(extractedCode);
        if (response && (response.status === 200 || response.status === 201)) {
          setStatus("✅ Your eBay store is connected and synced with the system!");
        } else {
          setStatus("❌ Something went wrong! Please try again later.");
        }
      };

      sendCodeToBackend();
    } else {
      // No code found, check connection status
      const checkConnection = async () => {
        const response = await AUTH.oauth(null);
        if (response && response.status === 201) {
          setStatus("✅ Your eBay store is already connected!");
        } else {
          setStatus("⚠️ Missing or invalid authentication code.");
        }
      };
      checkConnection();
    }
    setDisabled(false)
  }, [location.search]);

  const handleSync = async (e) => {
    let p = 1, tp = 1, s = 0;
    setDisabled(true);

    while (p <= tp) {
      setStatus(`
        ⏳ Syncing products... (Page ${p} of ${tp})\n
        ⏳ Synced ${s} products so far...\n
        ⏳ Please do not close this window.
      `);
      const response = await EBAY.syncProducts(p, tp);
      if (response && response.status === 200) {
        const data = response.data;
        p++;
        tp = data.totalPages;
        s = data.synced;
        setSynced(s);
        setPage(p);
        setTotalPages(tp);
      } else {
        setStatus("❌ Error during product sync. Please try again later.");
        setDisabled(false);
        return;
      }
    }

    setStatus("✅ Product sync completed successfully!\nTotal products synced: " + s);

    setDisabled(false);
  }

  const handleReconnect = () => {
    const EBAY_OAUTH_URL = import.meta.env.VITE_EBAY_OAUTH_URL;
    window.location.href = EBAY_OAUTH_URL;
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      {/* Top Action Bar */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">eBay OAuth Screen</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            disabled={disabled}
            className="px-5 py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-50 bg-blue-600 hover:bg-blue-700 transition-all"
            onClick={handleSync}
          >
            Sync Products
          </button>
          <button
            disabled={disabled}
            className="px-5 py-2.5 rounded-xl text-white font-medium shadow-md disabled:opacity-50 bg-gray-800 hover:bg-gray-900 transition-all"
            onClick={handleReconnect}
          >
            Re-connect eBay
          </button>
        </div>
      </div>

      {/* Status Bar - full width */}
      <div className="w-full max-w-3xl bg-blue-50 border border-blue-200 text-blue-700 text-left px-4 py-4 rounded-xl shadow-sm font-medium mb-6">
        <pre className="whitespace-pre-wrap">{status}</pre>
      </div>


      {/* Code Box */}
      {code && (
        <div className="w-full max-w-3xl bg-white border rounded-xl p-5 shadow">
          <p className="text-xs text-gray-600 break-all font-mono">Code: {code}</p>
        </div>
      )}
    </div>
  );
}

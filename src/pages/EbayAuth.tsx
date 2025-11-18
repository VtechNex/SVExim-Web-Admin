import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AUTH } from "@/services/authService";

export default function EbayAuth() {
  const location = useLocation();
  const [status, setStatus] = useState("Processing eBay authentication...");
  const [code, setCode] = useState<string | null>(null);

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
      setStatus("Finalizing eBay store connection...");

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
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-2xl font-bold mb-4">eBay Authentication</h1>
      <p className="text-center max-w-md text-gray-700">{status}</p>

      {code && (
        <div className="mt-6 text-left">
          <p className="text-sm text-gray-500 break-all">Code: {code}</p>
        </div>
      )}
    </div>
  );
}

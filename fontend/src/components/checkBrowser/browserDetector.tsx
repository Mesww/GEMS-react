import { useEffect, useState } from "react";

const BrowserDetector = () => {
  const [hasPrompted, setHasPrompted] = useState(false); // Track if we've already shown the confirm dialog

  useEffect(() => {
    if (isInAppBrowser() && !hasPrompted) {
      const userConfirmed = window.confirm(
        "You're using an in-app browser. Would you like to open this page in your default browser for a better experience?"
      );
      setHasPrompted(true); // Ensure that the confirm only happens once
      if (userConfirmed) {
        openInDefaultBrowser();
      }
    }
  }, [hasPrompted]);

  // Function to detect in-app browser (Facebook, Line, Twitter, etc.)
  function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor;
    return (
      ua.indexOf("FBAN") > -1 || 
      ua.indexOf("FBAV") > -1 || 
      ua.indexOf("Twitter") > -1 ||
      ua.indexOf("Line") > -1 ||
      ua.indexOf("Instagram") > -1 ||
      ua.indexOf("KAKAOTALK") > -1 ||
      /\bFB[\w_]+\//.test(ua) ||
      /\bMessenger\//.test(ua)
    );
  }

  // Function to open the current URL in the default browser
  function openInDefaultBrowser() {
    const currentURL = window.location.href;

    if (isIOS()) {
      // For iOS devices, open in Safari
      window.location.href = `x-safari-${currentURL}`;
    } else if (isAndroid()) {
      // For Android devices, open in Chrome using intent scheme
      window.location.href = `intent:${currentURL}#Intent;action=android.intent.action.VIEW;end`;
    } else {
      // Fallback for other platforms (opens in a new tab)
      window.open(currentURL, '_system');
    }
  }

  // Function to detect if it's an iOS device
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Function to detect if it's an Android device
  function isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  return null; // This component doesn't render anything
};

export default BrowserDetector;

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { dataLayerPush } from "./assets/js/main";

function PageTracker() {
  const location = useLocation();

  // Prevent duplicate log in StrictMode
  const loggedRef = useRef(false);

  //  Push to GTM dataLayer
  useEffect(() => {
    
    if (loggedRef.current) return; // already logged once
    loggedRef.current = true;

    dataLayerPush("page_view");
  }, [location]);

  return null;
}

export default PageTracker;
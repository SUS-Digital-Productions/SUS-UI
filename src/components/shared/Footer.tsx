import { useState, useEffect } from "react";
import { Link } from "react-router";

const FOOTER_STORAGE_KEY = "sus_app_footer_expanded";

const Footer = () => {
  // Default to false (closed), but read from localStorage
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem(FOOTER_STORAGE_KEY);
    return saved === "true";
  });

  // Save to localStorage whenever expanded state changes
  useEffect(() => {
    localStorage.setItem(FOOTER_STORAGE_KEY, String(expanded));
  }, [expanded]);
  
  return (
    <footer
      className="w-full border-t py-4 md:py-6 lg:py-8 mt-auto fixed bottom-0 left-0 z-50 bg-background cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{ color: 'inherit' }}
    >
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold ml-2">SUS Digital Productions</h2>
            {expanded && (
              <p className="mt-2 ml-2">
                SUS Digital Productions is a small code hobby group interested in the blockchain stack.
              </p>
            )}
          </div>
          {expanded && (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              <div>
                <h3 className="font-semibold text-lg">Quick Links</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link to={"/"}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to={"/about"}>
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support Us</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link to={"#"}>
                      Donations
                    </Link>
                  </li>
                  <li>
                    <Link to={"#"}>
                      Affiliate Code
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        {expanded && (
          <div className="text-center mt-8 border-t pt-4">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} SUS Digital Productions. All rights
              reserved.
            </p>
            <div className="text-sm">Version: v0.1.0</div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
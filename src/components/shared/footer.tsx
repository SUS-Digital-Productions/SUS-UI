import { useState } from "react";
import { Link } from "react-router";

const Footer = () => {
  const [expanded, setExpanded] = useState(true);
  return (
    <footer
      className="bg-secondary text-primary-foreground py-2 md:py-6 lg:py-8"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="container mx-auto px-2 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold ml-2">SUS Digital Productions</h2>
            {expanded && (
              <p className="text-gray-400 mt-2 ml-2">
                {" "}
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
                    <Link to={"/"} className="text-gray-400 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/about"}
                      className="text-gray-400 hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Support Us</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link to={"#"} className="text-gray-400 hover:text-white">
                      Donations
                    </Link>
                  </li>
                  <li>
                    <Link to={"#"} className="text-gray-400 hover:text-white">
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
          <div className="text-center mt-8 border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SUS Digital Productions. All rights
              reserved.
            </p>
            <div className="text-sm text-gray-400">Version: v0.1.0</div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;

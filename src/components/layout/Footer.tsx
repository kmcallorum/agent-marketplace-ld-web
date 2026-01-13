import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Agent Marketplace</h3>
            <p className="text-sm">
              Discover, share, and install AI agents built with pytest-agents.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="hover:text-white transition-colors">
                  Browse Agents
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/trending" className="hover:text-white transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/publish" className="hover:text-white transition-colors">
                  Publish Agent
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="http://localhost:8000/docs"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API Docs
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/kmcallorum/agent-marketplace-ld-web"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Web Source
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/kmcallorum/agent-marketplace-ld-api"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API Source
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/kmcallorum"
                className="hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Kevin McAllorum. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';

const footerLinks = {
  services: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'Driver', 'Maid'],
  company: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'],
  support: ['Help Center', 'Safety', 'Terms of Service', 'Privacy Policy', 'FAQs'],
};

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-2xl font-extrabold text-white">
                Ghar<span className="text-accent-400">Sathi</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Har Ghar Ka Sathi — connecting you with trusted home service professionals.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <HiOutlinePhone className="w-5 h-5 text-accent-400" />
                <span>+91 1800-123-GHAR</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <HiOutlineMail className="w-5 h-5 text-accent-400" />
                <span>help@gharsathi.in</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <HiOutlineLocationMarker className="w-5 h-5 text-accent-400" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((item) => (
                <li key={item}>
                  <Link href={`/services/${item.toLowerCase()}`} className="hover:text-accent-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-accent-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold mt-6 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-accent-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Download Our App</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the GharSathi app for faster booking and real-time tracking.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 bg-primary-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-primary-700 transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white"><path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h.5l10.5 10L5 22h-.5c-.83 0-1.5-.67-1.5-1.5zM17 13.5l-3.5-3.5L17 6.5 21 10l-4 3.5z"/></svg>
                <div>
                  <div className="text-xs text-gray-400">Download on</div>
                  <div className="text-sm font-semibold text-white">Google Play</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-primary-800 rounded-lg px-4 py-3 cursor-pointer hover:bg-primary-700 transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.67-.79 1.75-1.33 2.69-1.33.2 1.01-.3 2.01-.87 2.71-.58.73-1.58 1.24-2.53 1.24-.22-1 .24-1.98.71-2.62"/></svg>
                <div>
                  <div className="text-xs text-gray-400">Download on</div>
                  <div className="text-sm font-semibold text-white">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2026 GharSathi. All rights reserved. Har Ghar Ka Sathi.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
              <a key={social} href="#" className="text-gray-400 hover:text-accent-400 transition-colors text-sm">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

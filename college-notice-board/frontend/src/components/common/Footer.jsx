import React from 'react';
import { Link } from 'react-router-dom';
import { FaUniversity, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <FaUniversity className="text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">Excel College</p>
                <p className="text-xs text-gray-400">of Arts & Science</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students with knowledge and opportunity since 1985. A centre of excellence in education and research.
            </p>
            <div className="flex gap-3 mt-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/announcements', 'Announcements'], ['/notices', 'Notices'], ['/downloads', 'Downloads']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-primary-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic */}
          <div>
            <h4 className="font-semibold text-white mb-4">Academics</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Academic Calendar', 'Exam Schedule', 'Results', 'Syllabus', 'Student Portal'].map((item) => (
                <li key={item}><a href="#" className="hover:text-primary-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 text-primary-400 flex-shrink-0" />
                <span>123 College Road, Education District, City — 400001</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-primary-400 transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <a href="mailto:info@excelcollege.edu" className="hover:text-primary-400 transition-colors">info@excelcollege.edu</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Excel College. All rights reserved.</p>
          <p>College Digital Notice Board — Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
}

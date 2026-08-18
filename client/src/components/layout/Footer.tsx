import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink text-parchment pt-16 pb-12 border-t border-slate font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Promise Guarantee Band */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 mb-12 border-b border-slate/60 text-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-slate text-sage-light flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-white mb-1">Rigorously Verified</h4>
              <p className="text-xs text-sage-subtle leading-relaxed">
                Government photo ID confirmation, trade certificate verification, and active background checks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-slate text-sage-light flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-white mb-1">People Behind the Work</h4>
              <p className="text-xs text-sage-subtle leading-relaxed">
                Direct connection with independent local craftsmen and professionals who take pride in quality work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-slate text-sage-light flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-base text-white mb-1">Trusted Guarantee</h4>
              <p className="text-xs text-sage-subtle leading-relaxed">
                Transparent pricing, authentic customer reviews, and escrow protection for every booking.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
          <div className="col-span-2">
            <div className="mb-4">
              <Logo size="lg" onDark />
            </div>
            <p className="text-xs text-sage-subtle leading-relaxed max-w-sm mb-4">
              Trusted professionals for the jobs that matter — from everyday home services to personal and professional help.
            </p>
            <span className="inline-block text-[11px] uppercase tracking-widest text-mineral font-semibold">
              Good work starts with the right hands.
            </span>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-sage-light mb-4">Services</h5>
            <ul className="space-y-2.5 text-xs text-mist font-normal">
              <li><RouterLink to="/services/cleaning" className="hover:text-white transition-colors">Home Cleaning</RouterLink></li>
              <li><RouterLink to="/services/electrical" className="hover:text-white transition-colors">Electrical</RouterLink></li>
              <li><RouterLink to="/services/carpentry" className="hover:text-white transition-colors">Carpentry</RouterLink></li>
              <li><RouterLink to="/services/painting" className="hover:text-white transition-colors">Painting</RouterLink></li>
              <li><RouterLink to="/services/plumbing" className="hover:text-white transition-colors">Plumbing</RouterLink></li>
              <li><RouterLink to="/services/beauty" className="hover:text-white transition-colors">Beauty & Wellness</RouterLink></li>
              <li><RouterLink to="/services/tutoring" className="hover:text-white transition-colors">Tutoring</RouterLink></li>
              <li><RouterLink to="/services/appliance" className="hover:text-white transition-colors">Appliance Repair</RouterLink></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-sage-light mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs text-mist font-normal">
              <li><RouterLink to="/about" className="hover:text-white transition-colors">About Us</RouterLink></li>
              <li><RouterLink to="/how-it-works" className="hover:text-white transition-colors">How It Works</RouterLink></li>
              <li><RouterLink to="/how-it-works#provider" className="hover:text-white transition-colors">Become a Provider</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-white transition-colors">Contact Us</RouterLink></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-sage-light mb-4">Support & Legal</h5>
            <ul className="space-y-2.5 text-xs text-mist font-normal">
              <li><RouterLink to="/faq" className="hover:text-white transition-colors">FAQ</RouterLink></li>
              <li><RouterLink to="/contact" className="hover:text-white transition-colors">Help Center</RouterLink></li>
              <li><RouterLink to="/faq#terms" className="hover:text-white transition-colors">Terms of Service</RouterLink></li>
              <li><RouterLink to="/faq#privacy" className="hover:text-white transition-colors">Privacy Policy</RouterLink></li>
            </ul>
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-8 border-t border-slate/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-subtle">
          <p>&copy; 2026 Trusted Hands. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

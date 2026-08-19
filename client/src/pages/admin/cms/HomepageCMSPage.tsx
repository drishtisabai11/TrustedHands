import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import Button from '../../../components/ui/Button';

export const HomepageCMSPage: React.FC = () => {
  const [formData, setFormData] = useState({
    heroEyebrow: 'VERIFIED LOCAL SERVICES',
    heroHeadline: 'Trusted Local Professionals For Every Home Need',
    heroDescription: 'Book certified electricians, plumbers, carpenters, and technicians with clear pricing and guaranteed satisfaction.',
    primaryCtaText: 'Find a Professional',
    secondaryCtaText: 'Become a Provider',
    trustHeading: 'Why Homeowners Choose Trusted Hands',
    trustText: 'Every provider passes background verification, credential checks, and real customer rating audits.',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCMS();
  }, []);

  const loadCMS = async () => {
    setIsLoading(true);
    try {
      const sections = await adminService.getCMSContent();
      const hero = sections.find((s: any) => s.sectionKey === 'homepage_hero');
      if (hero) {
        setFormData({
          heroEyebrow: hero.subtitle || 'VERIFIED LOCAL SERVICES',
          heroHeadline: hero.title || 'Trusted Local Professionals For Every Home Need',
          heroDescription: hero.bodyContent || 'Book certified electricians, plumbers, carpenters, and technicians.',
          primaryCtaText: hero.metadata?.primaryCta || 'Find a Professional',
          secondaryCtaText: hero.metadata?.secondaryCta || 'Become a Provider',
          trustHeading: hero.metadata?.trustHeading || 'Why Homeowners Choose Trusted Hands',
          trustText: hero.metadata?.trustText || 'Every provider passes background verification.',
        });
      }
    } catch (err) {
      console.error('Failed to load CMS content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateCMSContent({
        sectionKey: 'homepage_hero',
        title: formData.heroHeadline,
        subtitle: formData.heroEyebrow,
        bodyContent: formData.heroDescription,
        metadata: {
          primaryCta: formData.primaryCtaText,
          secondaryCta: formData.secondaryCtaText,
          trustHeading: formData.trustHeading,
          trustText: formData.trustText,
        },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'CMS Save failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-crimson" /> Homepage Content Management (CMS)
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">
            Update marketing messaging, hero copy, call-to-action buttons, and trust section content without code edits
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link to="/admin/content/faq">
            <Button variant="outline" size="sm">
              Manage FAQs
            </Button>
          </Link>
          <Link to="/admin/content/about">
            <Button variant="outline" size="sm">
              Manage About CMS
            </Button>
          </Link>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-seafoam/20 border border-seafoam rounded-xl text-ink text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-seafoam" /> Homepage CMS Content Saved Successfully!
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading CMS section...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bone border border-mist rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-ink font-bold border-b border-mist pb-2">Hero Section Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Hero Eyebrow Text</label>
                <input
                  type="text"
                  required
                  value={formData.heroEyebrow}
                  onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Hero Headline</label>
                <input
                  type="text"
                  required
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Hero Sub-Description</label>
              <textarea
                rows={3}
                required
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Primary CTA Button Label</label>
                <input
                  type="text"
                  required
                  value={formData.primaryCtaText}
                  onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Secondary CTA Button Label</label>
                <input
                  type="text"
                  required
                  value={formData.secondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-mist/80">
            <h3 className="font-serif text-lg text-ink font-bold border-b border-mist pb-2">Trust & Safety Section</h3>
            
            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Trust Section Title</label>
              <input
                type="text"
                required
                value={formData.trustHeading}
                onChange={(e) => setFormData({ ...formData, trustHeading: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Trust Philosophy Body Copy</label>
              <textarea
                rows={3}
                required
                value={formData.trustText}
                onChange={(e) => setFormData({ ...formData, trustText: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-mist/80">
            <Button type="submit" variant="cta" size="md">
              <Save className="w-4 h-4 mr-2" /> Save Homepage CMS Content
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

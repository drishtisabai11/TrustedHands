import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import Button from '../../../components/ui/Button';

export const AboutCMSPage: React.FC = () => {
  const [formData, setFormData] = useState({
    missionTitle: 'Our Mission & Commitment',
    missionBody: 'To build India’s most reliable, transparent, and verified local services marketplace that empowers skilled professionals while providing homeowners with total peace of mind.',
    storyTitle: 'The Trusted Hands Philosophy',
    storyBody: 'We started Trusted Hands after witnessing how difficult it was to find punctual, skilled, and honest service professionals. We built a platform grounded in strict verification, upfront pricing, and uncompromised quality.',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAboutCMS();
  }, []);

  const loadAboutCMS = async () => {
    setIsLoading(true);
    try {
      const sections = await adminService.getCMSContent();
      const about = sections.find((s) => s.sectionKey === 'about_mission');
      if (about) {
        setFormData({
          missionTitle: about.title || 'Our Mission & Commitment',
          missionBody: about.bodyContent || 'To build India’s most reliable marketplace...',
          storyTitle: about.metadata?.storyTitle || 'The Trusted Hands Philosophy',
          storyBody: about.metadata?.storyBody || 'We started Trusted Hands after witnessing...',
        });
      }
    } catch (err) {
      console.error('Failed to load About CMS:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateCMSContent({
        sectionKey: 'about_mission',
        title: formData.missionTitle,
        bodyContent: formData.missionBody,
        metadata: {
          storyTitle: formData.storyTitle,
          storyBody: formData.storyBody,
        },
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/content" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to CMS Overview
      </Link>

      <div className="border-b border-mist pb-4">
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-crimson" /> About Page Content Management
        </h2>
        <p className="text-xs text-charcoal-muted mt-1">Configure company story, mission statement, and core brand values</p>
      </div>

      {isSaved && (
        <div className="p-4 bg-seafoam/20 border border-seafoam rounded-xl text-ink text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-seafoam" /> About CMS Content Saved Successfully!
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading About CMS...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bone border border-mist rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-ink font-bold border-b border-mist pb-2">Mission Section</h3>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Mission Headline</label>
              <input
                type="text"
                required
                value={formData.missionTitle}
                onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Mission Statement Body</label>
              <textarea
                rows={4}
                required
                value={formData.missionBody}
                onChange={(e) => setFormData({ ...formData, missionBody: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-mist/80">
            <h3 className="font-serif text-lg text-ink font-bold border-b border-mist pb-2">Brand Story Section</h3>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Philosophy Title</label>
              <input
                type="text"
                required
                value={formData.storyTitle}
                onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-charcoal mb-1">Story Narrative Copy</label>
              <textarea
                rows={4}
                required
                value={formData.storyBody}
                onChange={(e) => setFormData({ ...formData, storyBody: e.target.value })}
                className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-mist/80">
            <Button type="submit" variant="cta" size="md">
              <Save className="w-4 h-4 mr-2" /> Save About Copy
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Camera, Plus, Trash2, ShieldCheck, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { providerApi } from '../../services/dashboardService';
import { Provider } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export const ProviderProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(650);
  const [yearsOfExperience, setYearsOfExperience] = useState(10);
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [serviceRadius, setServiceRadius] = useState(15);
  const [skills, setSkills] = useState('Wiring, MCB Breakers, Safety Inspection');
  const [languages, setLanguages] = useState('English, Hindi, Marathi');

  // Portfolio Modal State
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portImage, setPortImage] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await providerApi.getProfile();
      const p = data?.provider;
      if (p) {
        setProvider(p);
        setBusinessName(p.businessName || '');
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setHourlyRate(p.hourlyRate || 650);
        setYearsOfExperience(p.yearsOfExperience || 10);
        setCity(p.location?.city || 'Mumbai');
        setState(p.location?.state || 'Maharashtra');
        setServiceRadius(p.serviceAreaRadiusKm || 15);
        setSkills(p.skills?.join(', ') || 'Wiring, MCB Breakers, Safety Audit');
        setLanguages(p.languages?.join(', ') || 'English, Hindi, Marathi');
      }
    } catch (err) {
      console.error('Error fetching provider profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await providerApi.updateProfile({
        businessName,
        headline,
        bio,
        hourlyRate,
        yearsOfExperience,
        city,
        state,
        serviceAreaRadiusKm: serviceRadius,
        skills: skills.split(',').map((s) => s.trim()),
        languages: languages.split(',').map((l) => l.trim()),
      });
      await fetchProfile();
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portDesc || !portImage) return;
    try {
      await providerApi.addPortfolioItem({
        title: portTitle,
        description: portDesc,
        imageUrl: portImage,
      });
      await fetchProfile();
      setIsPortfolioModalOpen(false);
      setPortTitle('');
      setPortDesc('');
      setPortImage('');
    } catch (err) {
      console.error('Error adding portfolio item:', err);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm('Delete this portfolio project?')) return;
    try {
      await providerApi.deletePortfolioItem(id);
      await fetchProfile();
    } catch (err) {
      console.error('Error deleting portfolio item:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="h-64 bg-bone rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Provider Profile & Portfolio</h1>
        <p className="text-sm text-charcoal-muted mt-1">Manage your public partner credentials, bio, and showcase of past work.</p>
      </div>

      {/* HEADER AVATAR CARD */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <Avatar name={user?.name || provider?.user?.name || 'Provider'} src={user?.avatar} size="xl" />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-ink text-xl">{user?.name || provider?.user?.name}</h2>
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Government ID Verified
              </Badge>
            </div>
            <p className="text-xs font-semibold text-brand">{headline || 'Licensed Tradesperson'}</p>
            <p className="text-xs text-charcoal-muted">
              {city}, {state} · {yearsOfExperience} Years Experience
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" type="button">
          <Camera className="w-3.5 h-3.5 mr-1.5" /> Update Photo
        </Button>
      </div>

      {/* EDIT PROFILE FORM */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        <h3 className="font-serif text-xl font-bold text-slate">Professional Details</h3>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          {successMsg && (
            <div className="p-3 bg-sage/20 border border-sage text-sage-dark rounded-lg text-xs font-semibold flex items-center">
              <Check className="w-4 h-4 mr-2" /> Provider profile saved successfully.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                Business / Entity Name (Optional)
              </label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Kumar Electrical Solutions" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                Professional Headline
              </label>
              <Input value={headline} onChange={(e) => setHeadline(e.target.value)} required placeholder="Master Electrician with 10 Yrs Experience" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Professional Biography & Expertise
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-mist bg-bone text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Hourly Rate (₹)</label>
              <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Yrs Experience</label>
              <Input type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Service Radius (km)</label>
              <Input type="number" value={serviceRadius} onChange={(e) => setServiceRadius(Number(e.target.value))} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Skills (Comma Separated)</label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Wiring, MCB Breakers, Smart Lighting" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Languages Spoken</label>
              <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Hindi, Marathi" />
            </div>
          </div>

          <div className="pt-4 border-t border-mist flex justify-end">
            <Button variant="primary" size="md" type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>

      {/* PORTFOLIO SHOWCASE SECTION */}
      <div className="bg-bone border border-mist rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-mist pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-slate">Work Portfolio Showcase</h3>
            <p className="text-xs text-charcoal-muted">Photos of completed installations and past craftsmanship</p>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsPortfolioModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Project Photo
          </Button>
        </div>

        {provider?.portfolio && provider.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {provider.portfolio.map((item) => (
              <div key={item.id} className="border border-mist rounded-xl overflow-hidden bg-parchment/40 relative group">
                <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-3 space-y-1">
                  <h4 className="font-serif font-bold text-ink text-sm">{item.title}</h4>
                  <p className="text-xs text-charcoal-muted line-clamp-2">{item.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePortfolio(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-bone/90 text-brand rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-charcoal-muted">
            <p className="text-sm">No portfolio items added yet.</p>
          </div>
        )}
      </div>

      {/* ADD PORTFOLIO MODAL */}
      <Modal isOpen={isPortfolioModalOpen} onClose={() => setIsPortfolioModalOpen(false)} title="Add Work Portfolio Item">
        <form onSubmit={handleAddPortfolio} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Project Title</label>
            <Input value={portTitle} onChange={(e) => setPortTitle(e.target.value)} required placeholder="DB Panel Upgrade & Rewiring" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Description</label>
            <textarea
              rows={3}
              value={portDesc}
              onChange={(e) => setPortDesc(e.target.value)}
              required
              placeholder="Brief description of work done..."
              className="w-full p-3 rounded-lg border border-mist bg-bone text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Photo Image URL</label>
            <Input
              value={portImage}
              onChange={(e) => setPortImage(e.target.value)}
              required
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-mist">
            <Button variant="outline" size="md" type="button" onClick={() => setIsPortfolioModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Add to Portfolio
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderProfilePage;

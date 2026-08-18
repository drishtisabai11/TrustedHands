import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Trash2, ArrowRight, Search } from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Provider } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const CustomerSavedPage: React.FC = () => {
  const [savedProviders, setSavedProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const data = await customerApi.getSavedProviders();
        setSavedProviders(data || []);
      } catch (err) {
        console.error('Error fetching saved providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleRemove = async (providerId: string) => {
    try {
      await customerApi.removeSavedProvider(providerId);
      setSavedProviders(savedProviders.filter((p) => p.id !== providerId));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-bone rounded-xl"></div>
          <div className="h-40 bg-bone rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Saved Professionals</h1>
        <p className="text-sm text-charcoal-muted mt-1">Keep track of top-rated service partners you love working with.</p>
      </div>

      {savedProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedProviders.map((pro) => (
            <div
              key={pro.id}
              className="bg-bone border border-mist rounded-xl p-5 hover:border-brand/40 hover:shadow-subtle transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={
                    pro.user?.avatar ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={pro.user?.name || pro.businessName || 'Provider'}
                  className="w-14 h-14 rounded-xl object-cover border border-mist"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-ink text-base">
                      {pro.user?.name || pro.businessName || 'Service Specialist'}
                    </h3>
                    <Badge variant="verified">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  </div>

                  <p className="text-xs text-brand font-medium line-clamp-1">{pro.headline}</p>

                  <div className="flex items-center space-x-3 text-xs text-charcoal-muted pt-1">
                    <span className="flex items-center font-bold text-slate">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500 mr-1" /> {pro.rating || 4.9}
                    </span>
                    <span>({pro.reviewCount || 100}+ reviews)</span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-brand mr-0.5" /> {pro.location?.city || 'Mumbai'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-mist/80">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block">Rate from</span>
                  <span className="text-sm font-serif font-bold text-slate">₹{pro.hourlyRate || 499}/hr</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleRemove(pro.id)}
                    className="p-2 text-charcoal-subtle hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link to={`/providers/${pro.id}`}>
                    <Button variant="primary" size="sm">
                      View Profile <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center space-y-3">
          <h2 className="font-serif text-xl font-bold text-slate">Your trusted list starts here.</h2>
          <p className="text-sm text-charcoal-muted max-w-sm mx-auto">
            Save professionals you would like to work with again for quick booking in the future.
          </p>
          <div className="pt-2">
            <Link to="/providers">
              <Button variant="primary" size="md">
                <Search className="w-4 h-4 mr-2" /> Browse Professionals
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSavedPage;

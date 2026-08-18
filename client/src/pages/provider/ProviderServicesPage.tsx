import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { providerApi } from '../../services/dashboardService';
import { Service } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { MOCK_CATEGORIES } from '../../data/mockData';

export const ProviderServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0]?.id || 'cat-electrical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(499);
  const [priceType, setPriceType] = useState<'FIXED' | 'HOURLY'>('FIXED');
  const [duration, setDuration] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await providerApi.getServices();
      setServices(data || []);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setTitle('');
    setDescription('');
    setBasePrice(499);
    setPriceType('FIXED');
    setDuration(60);
    setIsModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setTitle(srv.title);
    setDescription(srv.description);
    setBasePrice(srv.basePrice);
    setPriceType(srv.priceType as any || 'FIXED');
    setDuration(srv.estimatedDurationMinutes || 60);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !basePrice) return;
    setSubmitting(true);
    try {
      if (editingService) {
        await providerApi.updateService(editingService.id, {
          title,
          description,
          basePrice,
          priceType,
          estimatedDurationMinutes: duration,
        });
      } else {
        await providerApi.createService({
          categoryId,
          title,
          description,
          basePrice,
          priceType,
          estimatedDurationMinutes: duration,
          includedTasks: ['Visual inspection', 'Operational test'],
        });
      }
      await fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Deactivate this service? Customers will no longer be able to book it.')) return;
    try {
      await providerApi.deleteService(id);
      await fetchServices();
    } catch (err) {
      console.error('Error deactivating service:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-bone rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-36 bg-bone rounded-xl"></div>
          <div className="h-36 bg-bone rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Services Offered</h1>
          <p className="text-sm text-charcoal-muted mt-1">Manage the specific service catalog and pricing you offer to customers.</p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add New Service
        </Button>
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div key={srv.id} className="bg-bone border border-mist rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-ink text-base">{srv.title}</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand px-2 py-0.5 bg-brand/10 rounded">
                    ₹{srv.basePrice} {srv.priceType === 'HOURLY' ? '/hr' : 'fixed'}
                  </span>
                </div>

                <p className="text-xs text-charcoal line-clamp-2">{srv.description}</p>

                <div className="flex items-center space-x-3 text-xs text-charcoal-muted pt-1">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 text-brand mr-1" /> Est. {srv.estimatedDurationMinutes} mins
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-mist/80">
                <button
                  type="button"
                  onClick={() => openEditModal(srv)}
                  className="px-3 py-1.5 border border-mist hover:border-brand text-xs font-semibold text-charcoal rounded-lg flex items-center"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeactivate(srv.id)}
                  className="px-3 py-1.5 border border-mist hover:border-brand/40 text-xs font-semibold text-brand rounded-lg flex items-center hover:bg-brand/10"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Deactivate
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center space-y-3">
          <h2 className="font-serif text-xl font-bold text-slate">No services offered yet.</h2>
          <p className="text-sm text-charcoal-muted max-w-sm mx-auto">
            Add the services you offer to start receiving relevant customer bookings.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          </div>
        </div>
      )}

      {/* ADD / EDIT SERVICE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? 'Edit Service' : 'Add New Service'}>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          {!editingService && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
                Category
              </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={MOCK_CATEGORIES.map((c) => ({ label: c.name, value: c.id }))}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Service Title
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ceiling Fan & Light Installation" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Service Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe scope of work..."
              className="w-full p-3 rounded-lg border border-mist bg-bone text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            ></textarea>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Price (₹)</label>
              <Input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Pricing Model</label>
              <Select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                options={[
                  { label: 'Fixed Price', value: 'FIXED' },
                  { label: 'Hourly Rate', value: 'HOURLY' },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Est. Minutes</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-mist">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Service'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderServicesPage;

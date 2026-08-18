import React, { useEffect, useState } from 'react';
import { MapPin, Plus, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { customerApi } from '../../services/dashboardService';
import { Address } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const CustomerAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getAddresses();
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    setTitle('Home');
    setStreet('');
    setApartment('');
    setCity('Mumbai');
    setState('Maharashtra');
    setPostalCode('');
    setIsDefault(addresses.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setTitle(addr.title);
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setIsDefault(addr.isDefault);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !street || !city || !postalCode) return;
    setSubmitting(true);
    try {
      if (editingAddress) {
        await customerApi.updateAddress(editingAddress.id, {
          title,
          street,
          apartment,
          city,
          state,
          postalCode,
          isDefault,
        });
      } else {
        await customerApi.createAddress({
          title,
          street,
          apartment,
          city,
          state,
          postalCode,
          country: 'India',
          isDefault,
        });
      }
      await fetchAddresses();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving address:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      await customerApi.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await customerApi.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
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
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate">Service Addresses</h1>
          <p className="text-sm text-charcoal-muted mt-1">Manage locations for home visits and service arrivals.</p>
        </div>

        <Button variant="primary" size="md" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-bone border rounded-xl p-5 shadow-subtle flex flex-col justify-between space-y-4 transition-all ${
                addr.isDefault ? 'border-brand/50 ring-1 ring-brand/20' : 'border-mist'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-ink text-base flex items-center">
                    <MapPin className="w-4 h-4 text-brand mr-1.5" /> {addr.title}
                  </span>

                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand px-2 py-0.5 rounded-md border border-brand/20">
                      Default Address
                    </span>
                  )}
                </div>

                <div className="text-xs text-charcoal space-y-0.5 pl-6 font-medium">
                  <p>{addr.street}</p>
                  {addr.apartment && <p>{addr.apartment}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-mist/80 text-xs">
                {!addr.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-brand font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-sage-dark font-medium flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Active Default
                  </span>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(addr)}
                    className="p-1.5 text-charcoal hover:text-brand hover:bg-parchment rounded-md"
                    title="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-charcoal hover:text-brand hover:bg-brand/10 rounded-md"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl p-12 text-center space-y-3">
          <h2 className="font-serif text-xl font-bold text-slate">No saved addresses yet.</h2>
          <p className="text-sm text-charcoal-muted max-w-sm mx-auto">
            Add your primary residential or office address for seamless service booking.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" /> Add Address
            </Button>
          </div>
        </div>
      )}

      {/* ADD / EDIT ADDRESS MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Address Label (e.g. Home, Office, Studio)
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Home" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Street & House / Building Name
            </label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="B-402, Green Ridge, Hiranandani" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">
              Flat / Apartment / Floor (Optional)
            </label>
            <Input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Flat 402, Floor 4" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">State</label>
              <Input value={state} onChange={(e) => setState(e.target.value)} required placeholder="Maharashtra" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-subtle mb-1">Postal Code</label>
            <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="400607" />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isDefaultCheck"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-brand focus:ring-brand"
            />
            <label htmlFor="isDefaultCheck" className="text-xs font-medium text-ink cursor-pointer">
              Set as default address for future bookings
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-mist">
            <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerAddressesPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Plus } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    basePrice: 500,
    priceType: 'FIXED',
    estimatedDurationMinutes: 60,
    includedTasks: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [srvRes, catRes] = await Promise.all([adminService.getServices(), adminService.getCategories()]);
      setServices(srvRes || []);
      setCategories(catRes || []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: categories[0]?._id || '',
      description: '',
      basePrice: 500,
      priceType: 'FIXED',
      estimatedDurationMinutes: 60,
      includedTasks: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (srv: any) => {
    setEditingService(srv);
    setFormData({
      title: srv.title,
      category: srv.category?._id || srv.category,
      description: srv.description || '',
      basePrice: srv.basePrice || 500,
      priceType: srv.priceType || 'FIXED',
      estimatedDurationMinutes: srv.estimatedDurationMinutes || 60,
      includedTasks: (srv.includedTasks || []).join(', '),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      includedTasks: formData.includedTasks.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingService) {
        await adminService.updateService(editingService._id, payload);
      } else {
        await adminService.createService(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleToggleActive = async (srv: any) => {
    try {
      await adminService.updateService(srv._id, { isActive: !srv.isActive });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Toggle status failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <Wrench className="w-6 h-6 text-crimson" /> Service Management
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">Configure offered marketplace services, pricing models, and inclusions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/services/categories">
            <Button variant="outline" size="sm" className="text-xs">
              Manage Categories
            </Button>
          </Link>
          <Button variant="cta" size="sm" onClick={handleOpenCreate} className="text-xs">
            <Plus className="w-4 h-4 mr-1" /> Create New Service
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading services catalog...</div>
      ) : (
        <div className="bg-bone border border-mist rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-parchment text-charcoal font-semibold border-b border-mist uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Service Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Est. Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist/60">
              {services.map((srv) => (
                <tr key={srv._id} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-ink">{srv.title}</td>
                  <td className="py-3.5 px-4 font-semibold text-charcoal">{srv.category?.name || 'General'}</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-ink">₹{srv.basePrice} ({srv.priceType})</td>
                  <td className="py-3.5 px-4 text-charcoal-muted">{srv.estimatedDurationMinutes} mins</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        srv.isActive ? 'bg-seafoam/20 text-seafoam' : 'bg-crimson/10 text-crimson'
                      }`}
                    >
                      {srv.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(srv)}
                      className="px-2.5 py-1 bg-parchment border border-mist rounded hover:border-crimson text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        srv.isActive ? 'bg-crimson/10 text-crimson' : 'bg-seafoam text-parchment'
                      }`}
                    >
                      {srv.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Service Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bone border border-mist rounded-xl shadow-modal w-full max-w-lg p-6 space-y-4 font-sans animate-in zoom-in-95">
            <h3 className="font-serif text-xl text-ink font-bold">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Price Type</label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                  >
                    <option value="FIXED">FIXED</option>
                    <option value="HOURLY">HOURLY</option>
                    <option value="QUOTE">QUOTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Included Tasks (comma separated)</label>
                <input
                  type="text"
                  value={formData.includedTasks}
                  onChange={(e) => setFormData({ ...formData, includedTasks: e.target.value })}
                  placeholder="e.g. Wire check, Socket replacement, Safety testing"
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="cta" size="sm">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

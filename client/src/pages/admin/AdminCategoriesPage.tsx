import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Plus, ArrowLeft } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Button from '../../components/ui/Button';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    iconName: 'Wrench',
    imageUrl: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', iconName: 'Wrench', imageUrl: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      iconName: cat.iconName || 'Wrench',
      imageUrl: cat.imageUrl || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory._id, formData);
      } else {
        await adminService.createCategory(formData);
      }
      setShowModal(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleToggleActive = async (cat: any) => {
    try {
      await adminService.updateCategory(cat._id, { isActive: !cat.isActive });
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Category safety check failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <Link to="/admin/services" className="text-xs font-semibold text-crimson hover:underline inline-flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Services Directory
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-mist pb-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-crimson" /> Service Category Management
          </h2>
          <p className="text-xs text-charcoal-muted mt-1">Manage marketplace service categories, descriptions, icons, and SEO configuration</p>
        </div>
        <Button variant="cta" size="sm" onClick={handleOpenCreate} className="text-xs">
          <Plus className="w-4 h-4 mr-1" /> Create New Category
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-bone border border-mist rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-serif text-lg font-bold text-ink">{cat.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cat.isActive ? 'bg-seafoam/20 text-seafoam' : 'bg-crimson/10 text-crimson'
                    }`}
                  >
                    {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted">{cat.description}</p>
                <div className="text-[11px] text-mineral mt-2">Slug: /{cat.slug} • Icon: {cat.iconName}</div>
              </div>

              <div className="pt-3 border-t border-mist/60 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-3 py-1 bg-parchment border border-mist rounded hover:border-crimson font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(cat)}
                  className={`px-3 py-1 rounded font-semibold ${
                    cat.isActive ? 'bg-crimson/10 text-crimson' : 'bg-seafoam text-parchment'
                  }`}
                >
                  {cat.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bone border border-mist rounded-xl shadow-modal w-full max-w-md p-6 space-y-4 font-sans animate-in zoom-in-95">
            <h3 className="font-serif text-xl text-ink font-bold">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Slug (URL Segment)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. electrical-work"
                  className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                />
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-parchment border border-mist rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="cta" size="sm">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

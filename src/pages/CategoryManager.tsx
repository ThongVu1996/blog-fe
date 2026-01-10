import { useState } from 'react';
import {
  Edit2, Trash2, Save, X, Loader2,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { useCategories } from '../hooks';
import { categoryService } from '../services/category.service';

const CategoryManager = () => {
  // Get categories from React Query
  const { data: categories = [], refetch: refetchCategories, isLoading } = useCategories();

  const [catName, setCatName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string | null; type: 'success' | 'error' | null }>({ message: null, type: null });

  const fetchCategories = () => {
    // Use refetch from React Query instead of manual fetch
    refetchCategories();
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: null }), 3000);
  };



  // ... (existing imports)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setIsSaving(true);

    try {
      if (editingId) {
        await categoryService.update(editingId, catName);
        showToast("Cập nhật thành công!", "success");
      } else {
        await categoryService.create(catName);
        showToast("Thêm mới thành công!", "success");
      }
      setCatName('');
      setEditingId(null);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    try {
      await categoryService.delete(showDeleteModal);
      showToast("Xóa chuyên mục thành công.", "success");
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showToast(err.message, "error");
    } finally {
      setShowDeleteModal(null);
    }
  };

  const startEdit = (cat: { id: number; name: string }) => {
    setEditingId(cat.id);
    setCatName(cat.name);
  };

  if (isLoading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={48} />
    </div>
  );

  return (
    <div className="category-manager-view animate-fade container">
      {toast.message && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <h1 className="category-header">List Categories</h1>

      <form className="category-editor-form" onSubmit={handleSave}>
        <h3 className="category-form-title">
          {editingId ? "Edit Category" : "Add New Category"}
        </h3>
        <div className="form-group">
          <input
            className="form-input"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Category name (e.g., Docker, CI/CD...)"
            required
          />
        </div>

        <div className="category-form-actions">
          <button className="btn-primary" disabled={isSaving}>
            {isSaving ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            <span>{editingId ? "Update" : "Save"}</span>
          </button>
          {editingId && (
            <button className="btn-outline" type="button" onClick={() => { setEditingId(null); setCatName(''); }}>
              <X size={16} /> <span>Cancel</span>
            </button>
          )}
        </div>
      </form>

      {/* Bảng Full Width với Kẻ dòng rõ ràng */}
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map(cat => (
              <tr key={cat.id}>
                <td className="category-name-cell">{cat.name}</td>
                <td className="category-action-cell">
                  <div className="category-action-group">
                    {
                      cat.id != 1 ? <>
                        <button className="btn-table-action" onClick={() => startEdit(cat)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="btn-table-action btn-table-delete" onClick={() => setShowDeleteModal(cat.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </> : null
                    }

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            <h3 className="modal-title">Confirm Delete?</h3>
            <p className="modal-text">Related data will be affected. Are you sure you want to delete?</p>
            <div className="modal-buttons">
              <button className="btn-outline" onClick={() => setShowDeleteModal(null)}>Cancel</button>
              <button className="btn-delete" onClick={handleDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
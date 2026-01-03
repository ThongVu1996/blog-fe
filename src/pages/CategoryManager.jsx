import { useState } from 'react';
import { 
  Edit2, Trash2, Save, X, Loader2, 
  AlertTriangle, CheckCircle, XCircle 
} from 'lucide-react';
import { API_BASE_URL, STORAGE_KEY } from '../config/constants';

const CategoryManager = ({setCategories, categories}) => {
  const [loading, setLoading] = useState(false);
  
  const [catName, setCatName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [toast, setToast] = useState({ message: null, type: null });

  const fetchCategories = () => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(result => {
        setCategories(result.data || []);
        setLoading(false);
      });
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null, type: null }), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setIsSaving(true);

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_BASE_URL}/categories/${editingId}` : `${API_BASE_URL}/categories`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}`
        },
        body: JSON.stringify({ name: catName })
      });

      if (res.ok) {
        showToast(editingId ? "Cập nhật thành công!" : "Thêm mới thành công!", "success");
        setCatName('');
        setEditingId(null);
        fetchCategories();
      } else {
        showToast("Thao tác thất bại.", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${showDeleteModal}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` }
      });

      if (res.ok) {
        showToast("Xóa chuyên mục thành công.", "success");
        fetchCategories();
      } else {
        showToast("Không thể xóa chuyên mục này.", "error");
      }
    } catch (err) {
      showToast("Lỗi kết nối mạng.", "error");
    } finally {
      setShowDeleteModal(null);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setCatName(cat.name);
  };

  if (loading) return (
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
            <button className="btn-outline" type="button" onClick={() => {setEditingId(null); setCatName('');}}>
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
                        </> :  null
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
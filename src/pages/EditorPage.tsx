import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Image as ImageIcon, Github, Download, Star, CheckCircle2 } from 'lucide-react';
import { getImageUrl } from '../config/constants';
import Toast from '../components/Toast';
import { useCategories, useCreatePost, useUpdatePost } from '../hooks';
import { postService } from '../services/post.service';

const EditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get categories from React Query instead of props
  const { data: categories = [] } = useCategories();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  // State quản lý Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  const [formData, setFormData] = useState({
    title: '', excerpt: '', slug: '', content: '',
    category_id: 1, author: 'ThongDev', image: null,
    type: 'html', toc: '', status: 'published',
    is_featured: false, featured_order: ''
  });

  const [githubLink, setGithubLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (id) {
      postService.getById(id)
        .then(data => {
          if (!data) {
            throw new Error('Invalid response: missing data');
          }
          setFormData({
            ...data,
            excerpt: data.excerpt || '',
            author: data.author || '',
            toc: data.toc || '',
            is_featured: Boolean(data.is_featured),
            featured_order: data.featured_order ? String(data.featured_order) : '',
            status: data.status || 'published',
            image: null
          });
          if (data.image) setPreviewUrl(getImageUrl(data.image));
        })
        .catch(error => {
          console.error('Error loading post:', error);
          showToast(`Không thể tải bài viết: ${error.message}`, 'error');
          // Navigate back after showing error
          setTimeout(() => navigate('/'), 2000);
        });
    }
  }, [id, navigate]);

  const slugify = (str: string) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .toLowerCase().trim().replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const importMarkdown = async () => {
    if (!githubLink) return showToast("Vui lòng dán link GitHub .md", "error");
    setIsImporting(true);

    // Chuyển đổi link GitHub sang link Raw để fetch nội dung
    const rawUrl = githubLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    const basePath = githubLink.substring(0, githubLink.lastIndexOf('/') + 1);

    try {
      let markdownText = await postService.importFromUrl(rawUrl);

      // 1. Xử lý đường dẫn ảnh nội bộ (Relative paths) sang link GitHub Raw
      markdownText = markdownText.replace(/!\[([^\]]*)\]\((?!http|https)([^)]+)\)/g, (_: string, alt: string, path: string) => {
        const cleanPath = path.replace(/^\.\//, '');
        return `![${alt}](${basePath}${cleanPath}?raw=true)`;
      });

      // 2. Đồng bộ hóa các Anchor link trong mục lục (Tùy chọn)
      markdownText = markdownText.replace(/\[([^\]]+)\]\(#([^\)]+)\)/g, (_: string, text: string, anchor: string) => {
        return `[${text}](#${slugify(anchor)})`;
      });

      /* ĐÃ LOẠI BỎ: Bước tự động thêm {#id} vào sau tiêu đề (headings).
      Nội dung các thẻ như ## **1. TỔNG QUAN...** sẽ giữ nguyên định dạng Markdown gốc.
      */

      setFormData(prev => ({ ...prev, content: markdownText, type: 'markdown' }));
      showToast("Nhập Markdown thành công!", "success");
    } catch (error: any) {
      showToast("Lỗi Import: " + error.message, "error");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        const typedKey = key as keyof typeof formData;
        let value = formData[typedKey];
        if (key === 'is_featured') value = formData[typedKey] ? 1 : 0;
        if (value !== null && value !== undefined) data.append(key, String(value));
      }
    });

    if (imageFile) data.append('image', imageFile);
    if (id) data.append('_method', 'PUT');

    try {
      if (id) {
        await updatePost.mutateAsync({ id, formData: data });
        showToast("Cập nhật bài viết thành công!");
      } else {
        await createPost.mutateAsync(data);
        showToast("Lưu bài viết mới thành công!");
      }
      setTimeout(() => navigate('/'), 1000);
    } catch (e: any) {
      console.error(e);
      showToast(e.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-container animate-fade">
      {/* Hiển thị Toast nếu có message */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSave}>
        <h2 className="editor-header">{id ? 'Cập nhật bài viết' : 'Viết bài mới'}</h2>

        <div className="form-group">
          <label className="form-label">TIÊU ĐỀ</label>
          <input className="form-input" value={formData.title} onChange={e => setFormData({
            ...formData, title:
              e.target.value
          })} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">SLUG (URL TĨNH)</label>
            <input className="form-input" value={formData.slug} onChange={e => setFormData({
              ...formData, slug:
                e.target.value
            })} required />
          </div>
          <div className="form-group">
            <label className="form-label">ĐỊNH DẠNG NỘI DUNG</label>
            <select className="form-select" value={formData.type} onChange={e => setFormData({
              ...formData, type:
                e.target.value
            })}>
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        </div>

        {/* BOX FEATURED CONFIG */}
        <div className="featured-config-card">
          <label className="featured-checkbox-wrapper">
            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({
              ...formData, is_featured:
                e.target.checked
            })} />
            <div className="checkbox-custom-content">
              <Star size={18} fill={formData.is_featured ? "#b45309" : "none"} color="#b45309" />
              <span>Đặt làm bài viết Tiêu điểm (Featured Grid)</span>
            </div>
          </label>

          {formData.is_featured && (
            <div className="featured-options animate-slide-down">
              <label className="form-label mini">VỊ TRÍ HIỂN THỊ</label>
              <select className="form-select" value={formData.featured_order} onChange={e => setFormData({
                ...formData,
                featured_order: e.target.value
              })} required>
                <option value="">-- Chọn vị trí --</option>
                <option value="1">Vị trí 1 (Lớn nhất)</option>
                <option value="2">Vị trí 2 (Nhỏ trên)</option>
                <option value="3">Vị trí 3 (Nhỏ dưới)</option>
              </select>
            </div>
          )}
        </div>

        {/* BOX IMPORT GITHUB */}
        <div className="import-github-card">
          <label className="form-label mini">
            <Github size={14} className="inline mr-1" /> IMPORT TỪ GITHUB
          </label>
          <div className="import-controls">
            <input type="text" className="form-input" placeholder="Paste GitHub .md link..." value={githubLink}
              onChange={e => setGithubLink(e.target.value)} />
            <button type="button" onClick={importMarkdown} disabled={isImporting} className="btn-import">
              {isImporting ?
                <Loader2 className="spin" size={16} /> :
                <Download size={16} />}
              <span>Import</span>
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">CHUYÊN MỤC</label>
            <select className="form-select" value={formData.category_id} onChange={e => setFormData({
              ...formData,
              category_id: parseInt(e.target.value)
            })}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">TÁC GIẢ</label>
            <input className="form-input" value={formData.author} onChange={e => setFormData({
              ...formData, author:
                e.target.value
            })} />
          </div>
          <div className="form-group">
            <label className="form-label">TRẠNG THÁI</label>
            <select className="form-select" value={formData.status} onChange={e => setFormData({
              ...formData, status:
                e.target.value
            })}>
              <option value="published">Công khai</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">MÔ TẢ NGẮN (EXCERPT)</label>
          <textarea className="form-textarea" value={formData.excerpt} onChange={e => setFormData({
            ...formData, excerpt:
              e.target.value
          })} rows={3} />
        </div>

        <div className="image-upload-section">
          <label className="form-label">ẢNH ĐẠI DIỆN</label>
          <div className="image-preview-box">
            {previewUrl ? <img src={previewUrl} alt="Preview" className="preview-img" /> :
              <div className="preview-placeholder">
                <ImageIcon size={32} /><span>Chưa chọn ảnh</span>
              </div>}
          </div>
          <input type="file" accept="image/*" onChange={e => {
            const file = e.target.files?.[0];
            if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
          }} />
        </div>

        <div className="form-group">
          <label className="form-label">NỘI DUNG ({formData.type.toUpperCase()})</label>
          <textarea
            className="form-textarea content-editor"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">MỤC LỤC (TOC)</label>
          <textarea
            className="form-textarea toc-editor"
            value={formData.toc}
            onChange={e => setFormData({ ...formData, toc: e.target.value })}
          />
        </div>

        <button type="submit" className="btn-save-post" disabled={isSaving}>
          {isSaving ?
            <Loader2 className="spin" size={20} /> :
            <CheckCircle2 size={20} />}
          <span>{id ? 'Cập nhật bài viết' : 'Lưu bài viết mới'}</span>
        </button>
      </form>
    </div>
  );
};

export default EditorPage;

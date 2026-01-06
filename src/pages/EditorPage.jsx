import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, Image as ImageIcon, Github, Download } from 'lucide-react';
import { API_BASE_URL, STORAGE_KEY, getImageUrl } from '../config/constants';

const EditorPage = ({ categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    slug: '',
    content: '',
    category_id: 1,
    author: 'ThongDev',
    image: null,
    type: 'html',
    toc: ''
  });

  const [githubLink, setGithubLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`${API_BASE_URL}/posts/${id}`)
        .then(res => res.json())
        .then(result => {
          setFormData(result.data);
          if (result.data.image) {
            setPreviewUrl(getImageUrl(result.data.image));
          }
        });
    }
  }, [id]);

  // const importMarkdown = async () => {
  // if (!githubLink) return alert("Please paste a GitHub .md link first.");
  // setIsImporting(true);
  //
  // const rawUrl = githubLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  // const basePath = githubLink.substring(0, githubLink.lastIndexOf('/') + 1);
  //
  // try {
  // const response = await fetch(rawUrl);
  // if (!response.ok) throw new Error("Failed to download Markdown file.");
  // let markdownText = await response.text();
  //
  // const fixedMarkdown = markdownText.replace(
  // /!\[([^\]]*)\]\((?!http|https)([^)]+)\)/g,
  // (match, alt, path) => {
  // const cleanPath = path.replace(/^\.\//, '');
  // return `![${alt}](${basePath}${cleanPath}?raw=true)`;
  // }
  // );
  //
  // setFormData(prev => ({ ...prev, content: fixedMarkdown, type: 'markdown' }));
  // alert("Markdown imported successfully!");
  // } catch (error) {
  // alert("Error: " + error.message);
  // } finally {
  // setIsImporting(false);
  // }
  // };

  const slugify = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD') // Tách các dấu khỏi chữ cái (ví dụ: á -> a + ´)
      .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu vừa tách
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt trừ chữ, số, khoảng trắng và gạch ngang
      .replace(/[\s_-]+/g, '-') // Thay khoảng trắng và gạch dưới bằng gạch ngang
      .replace(/^-+|-+$/g, ''); // Xóa gạch ngang thừa ở đầu và cuối
  };
  const importMarkdown = async () => {
    if (!githubLink) return alert("Please paste a GitHub .md link first.");
    setIsImporting(true);

    const rawUrl = githubLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    const basePath = githubLink.substring(0, githubLink.lastIndexOf('/') + 1);

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Failed to download Markdown file.");
      let markdownText = await response.text();

      // --- BẮT ĐẦU XỬ LÝ CHUYỂN ĐỔI ---

      // 1. Sửa đường dẫn ảnh (Giữ nguyên logic cũ của bạn)
      markdownText = markdownText.replace(
        /!\[([^\]]*)\]\((?!http|https)([^)]+)\)/g,
        (match, alt, path) => {
          const cleanPath = path.replace(/^\.\//, '');
          return `![${alt}](${basePath}${cleanPath}?raw=true)`;
        }
      );

      // 2. Chuyển đổi Anchor trong Mục lục: (#1-tổng-quan...) -> (#1-tong-quan...)
      // Tìm cấu trúc [Nội dung](#anchor)
      markdownText = markdownText.replace(/\[([^\]]+)\]\(#([^\)]+)\)/g, (match, text, anchor) => {
        return `[${text}](#${slugify(anchor)})`;
      });

      // 3. Thêm ID vào sau các Tiêu đề: ## Tiêu đề -> ## Tiêu đề {#slug-khong-dau}
      // Hỗ trợ từ # đến ######
      markdownText = markdownText.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
        // Loại bỏ các ký tự định dạng markdown như ** trong tiêu đề khi tạo ID
        const cleanTitle = title.replace(/\*\*|\*/g, '');
        const id = slugify(cleanTitle);

        // Kiểm tra nếu tiêu đề chưa có ID thì mới thêm để tránh lặp
        if (!title.includes('{#')) {
          return `${hashes} ${title} {#${id}}`;
        }
        return match;
      });

      // --- KẾT THÚC XỬ LÝ ---

      setFormData(prev => ({ ...prev, content: markdownText, type: 'markdown' }));
      alert("Markdown imported successfully with clean IDs!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- PHẦN THAY ĐỔI QUAN TRỌNG NHẤT ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();

    // 1. Duyệt qua các trường dữ liệu, BỎ QUA key 'image' của formData
    Object.keys(formData).forEach(key => {
      if (key !== 'image' && formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    // 2. Chỉ đưa file ảnh vào form nếu có file mới được chọn
    if (imageFile) {
      data.append('image', imageFile);
    }

    // 3. Xử lý phương thức cho Laravel Update
    if (id) {
      data.append('_method', 'PUT');
    }

    try {
      const res = await fetch(id ? `${API_BASE_URL}/posts/${id}` : `${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
        body: data // Trình duyệt sẽ tự động xử lý Content-Type và boundary
      });

      if (res.ok) {
        navigate('/');
      } else {
        const err = await res.json();
        console.error("Save error:", err);
        alert("Không thể lưu bài viết.");
      }
    } catch (e) {
      alert("Lỗi kết nối");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="editor-container animate-fade">
      <form onSubmit={handleSave}>
        <h2 className="editor-header">{id ? 'Update Post' : 'Write New Post'}</h2>

        <div className="form-group">
          <label className="form-label">Tiêu đề</label>
          <input className="form-input" value={formData.title} onChange={e => setFormData({
            ...formData, title:
              e.target.value
          })}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Slug (URL tĩnh)</label>
            <input className="form-input" value={formData.slug} onChange={e => setFormData({
              ...formData, slug:
                e.target.value
            })}
              placeholder="vd: huong-dan-docker"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Định dạng nội dung</label>
            <select className="form-select" value={formData.type} onChange={e => setFormData({
              ...formData, type:
                e.target.value
            })}
            >
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        </div>

        {/* GitHub Import Section */}
        <div style={{
          marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Github size={16} /> Import từ GitHub
          </label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <input type="text" className="form-input" style={{ marginBottom: 0 }} placeholder="Paste GitHub .md link..."
              value={githubLink} onChange={e => setGithubLink(e.target.value)}
            />
            <button type="button" onClick={importMarkdown} disabled={isImporting} className="btn-secondary" style={{
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {isImporting ?
                <Loader2 className="spin" size={16} /> :
                <Download size={16} />}
              Import
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select className="form-select" value={formData.category_id} onChange={e => setFormData({
              ...formData,
              category_id: parseInt(e.target.value)
            })}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input className="form-input" value={formData.author} onChange={e => setFormData({
              ...formData, author:
                e.target.value
            })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <textarea className="form-textarea" value={formData.excerpt} onChange={e => setFormData({
            ...formData, excerpt:
              e.target.value
          })}
          />
        </div>

        <div className="image-upload-section">
          <label className="form-label">Post Image</label>
          <div className="image-preview-box">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-img" />
            ) : (
              <div className="preview-placeholder">
                <ImageIcon size={32} />
                <span>Chưa có ảnh</span>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung ({formData.type.toUpperCase()})</label>
          <textarea className="form-textarea" value={formData.content} onChange={e => setFormData({
            ...formData, content:
              e.target.value
          })}
            required
            style={{ minHeight: '400px', fontFamily: formData.type === 'markdown' ? 'monospace' : 'inherit' }}
          />
        </div>


        <div className="form-group">
          <label className="form-label">Mục lục ({formData.type.toUpperCase()})</label>
          <textarea className="form-textarea" value={formData.toc} onChange={e => setFormData({
            ...formData, toc:
              e.target.value
          })}
            required
            style={{ minHeight: '400px', fontFamily: formData.type === 'markdown' ? 'monospace' : 'inherit' }}
          />
        </div>

        <button type="submit" className="btn-primary editor-submit-btn" disabled={isSaving}>
          {isSaving ?
            <Loader2 className="spin" size={18} /> :
            <Save size={18} />} Save Post
        </button>
      </form>
    </div>
  );
};

export default EditorPage;

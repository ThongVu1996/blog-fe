// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Save, Loader2, Image as ImageIcon } from 'lucide-react';
// import { API_BASE_URL, STORAGE_KEY, getImageUrl } from '../config/constants';

// const EditorPage = ({ categories }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({ 
//     title: '', 
//     excerpt: '', 
//     slug: '', 
//     content: '', 
//     category_id: 1, 
//     author: 'ThongDev',
//     image: null // Link ảnh từ server
//   });
  
//   const [imageFile, setImageFile] = useState(null); // File ảnh mới chọn local
//   const [previewUrl, setPreviewUrl] = useState(''); // URL để hiển thị ảnh
//   const [isSaving, setIsSaving] = useState(false);

//   // 1. Lấy dữ liệu bài viết cũ nếu là chế độ Edit
//   useEffect(() => {
//     if (id) {
//       fetch(`${API_BASE_URL}/posts/${id}`)
//         .then(res => res.json())
//         .then(result => {
//           setFormData(result.data);
//           // Nếu bài viết đã có ảnh, gán URL từ server vào previewUrl
//           if (result.data.image) {
//             setPreviewUrl(getImageUrl(result.data.image));
//           }
//         });
//     }
//   }, [id]);

//   // 2. Xử lý khi chọn file ảnh mới từ máy tính
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       // Tạo URL tạm thời để hiển thị ảnh vừa chọn
//       const localUrl = URL.createObjectURL(file);
//       setPreviewUrl(localUrl);
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
    
//     const data = new FormData();
//     Object.keys(formData).forEach(key => {
//       if (formData[key] !== null) {
//         data.append(key, formData[key]);
//       }
//     });

//     if (imageFile) {
//       data.append('image', imageFile);
//     }
    
//     if (id) {
//       data.append('_method', 'PUT');
//     }

//     try {
//       const res = await fetch(id ? `${API_BASE_URL}/posts/${id}` : `${API_BASE_URL}/posts`, {
//         method: 'POST',
//         headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
//         body: data
//       });

//       if (res.ok) {
//         navigate('/');
//       } else {
//         alert("Không thể lưu bài viết.");
//       }
//     } catch (e) {
//       alert("Lỗi kết nối");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="editor-container animate-fade">
//       <form onSubmit={handleSave}>
//         <h2 className="editor-header">{id ? 'Update Post' : 'Write New Post'}</h2>
        
//         <div className="form-group">
//           <label className="form-label">Tiêu đề</label>
//           <input 
//             className="form-input" 
//             value={formData.title} 
//             onChange={e => setFormData({...formData, title: e.target.value})} 
//             required 
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Slug (URL tĩnh)</label>
//           <input 
//             className="form-input" 
//             value={formData.slug} 
//             onChange={e => setFormData({...formData, slug: e.target.value})} 
//             placeholder="vd: huong-dan-docker" 
//             required 
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label className="form-label">Chuyên mục</label>
//             <select 
//               className="form-select" 
//               value={formData.category_id} 
//               onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
//             >
//               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//           </div>
//           <div className="form-group">
//             <label className="form-label">Tác giả</label>
//             <input 
//               className="form-input" 
//               value={formData.author} 
//               onChange={e => setFormData({...formData, author: e.target.value})} 
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">Excerpt</label>
//           <textarea 
//             className="form-textarea" 
//             value={formData.excerpt} 
//             onChange={e => setFormData({...formData, excerpt: e.target.value})} 
//           />
//         </div>

//         {/* Phần hiển thị và chọn ảnh */}
//         <div className="image-upload-section">
//           <label className="form-label">Post Image</label>
          
//           <div className="image-preview-box">
//             {previewUrl ? (
//               <img src={previewUrl} alt="Preview" className="preview-img" />
//             ) : (
//               <div className="preview-placeholder">
//                 <ImageIcon size={32} />
//                 <span>Chưa có ảnh</span>
//               </div>
//             )}
//           </div>

//           <input 
//             type="file" 
//             accept="image/*" 
//             onChange={handleImageChange} 
//           />
//         </div>

//         <div className="form-group">
//           <label className="form-label">Content (HTML)</label>
//           <textarea 
//             className="form-textarea" 
//             value={formData.content} 
//             onChange={e => setFormData({...formData, content: e.target.value})} 
//             required 
//             style={{ minHeight: '350px' }} // inline tạm để đảm bảo độ cao, có thể chuyển vào css
//           />
//         </div>

//         <button type="submit" className="btn-primary editor-submit-btn" disabled={isSaving}>
//           {isSaving ? <Loader2 className="spin" size={18} /> : <Save size={18} />} Save Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditorPage;



import React, { useState, useEffect } from 'react';
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
    type: 'html' // 1. Thêm trường type mặc định là html
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

  // Logic Import Markdown từ GitHub
  const importMarkdown = async () => {
    if (!githubLink) return alert("Please paste a GitHub .md link first.");
    setIsImporting(true);

    const rawUrl = githubLink.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    const basePath = githubLink.substring(0, githubLink.lastIndexOf('/') + 1);

    try {
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error("Failed to download Markdown file.");
      let markdownText = await response.text();

      const fixedMarkdown = markdownText.replace(
        /!\[([^\]]*)\]\((?!http|https)([^)]+)\)/g, 
        (match, alt, path) => {
          const cleanPath = path.replace(/^\.\//, '');
          return `![${alt}](${basePath}${cleanPath}?raw=true)`;
        }
      );

      setFormData(prev => ({ ...prev, content: fixedMarkdown, type: 'markdown' })); // Tự chuyển type sang markdown khi import
      alert("Markdown imported successfully!");
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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) data.append('image', imageFile);
    if (id) data.append('_method', 'PUT');

    try {
      const res = await fetch(id ? `${API_BASE_URL}/posts/${id}` : `${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
        body: data
      });

      if (res.ok) {
        navigate('/');
      } else {
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
          <input 
            className="form-input" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
        </div>

        {/* 2. Đưa Slug và Type vào cùng một hàng */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Slug (URL tĩnh)</label>
            <input 
              className="form-input" 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
              placeholder="vd: huong-dan-docker" 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Định dạng nội dung</label>
            <select 
              className="form-select" 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Chuyên mục</label>
            <select 
              className="form-select" 
              value={formData.category_id} 
              onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tác giả</label>
            <input 
              className="form-input" 
              value={formData.author} 
              onChange={e => setFormData({...formData, author: e.target.value})} 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Excerpt</label>
          <textarea 
            className="form-textarea" 
            value={formData.excerpt} 
            onChange={e => setFormData({...formData, excerpt: e.target.value})} 
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
          <textarea 
            className="form-textarea" 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            required 
            style={{ minHeight: '400px', fontFamily: formData.type === 'markdown' ? 'monospace' : 'inherit' }}
          />
        </div>

        <button type="submit" className="btn-primary editor-submit-btn" disabled={isSaving}>
          {isSaving ? <Loader2 className="spin" size={18} /> : <Save size={18} />} Save Post
        </button>
      </form>
    </div>
  );
};

export default EditorPage;
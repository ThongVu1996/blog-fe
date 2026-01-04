// import { useEffect, useRef, useLayoutEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeHighlight from 'rehype-highlight';
// import rehypeRaw from 'rehype-raw';
// import rehypeSlug from 'rehype-slug';
// import mermaid from 'mermaid';

// import 'github-markdown-css/github-markdown-light.css';
// import 'highlight.js/styles/github.css';

// mermaid.initialize({
//   startOnLoad: false,
//   theme: 'base', // Dùng base để dễ tùy chỉnh màu
//   themeVariables: {
//     primaryColor: '#e6f3ff',
//     lineColor: '#333',
//   },
//   securityLevel: 'loose',
// });

// const Markdown = ({ content }) => {
//   const renderRef = useRef(null);

// // useEffect(() => {
// //     // Hàm này cực kỳ quan trọng: 
// //     // Nó bắt Mermaid quét lại toàn bộ các thẻ div có class "mermaid" sau mỗi lần content thay đổi
// //     const renderMermaid = async () => {
// //       try {
// //         await mermaid.run({
// //           nodes: document.querySelectorAll('.mermaid'),
// //         });
// //       } catch (error) {
// //         console.error("Mermaid render error:", error);
// //       }
// //     };

// //     if (content) {
// //       renderMermaid();
// //     }
// //   }, [content]);
// useEffect(() => {
//   const renderMermaid = async () => {
//     // Đợi 1 nhịp để React hoàn tất Render DOM
//     setTimeout(async () => {
//       try {
//         // Xóa thuộc tính data-processed để Mermaid render lại từ đầu nếu cần
//         const nodes = document.querySelectorAll('.mermaid');
//         nodes.forEach(node => node.removeAttribute('data-processed'));
        
//         await mermaid.run({
//           nodes: nodes,
//         });
//       } catch (error) {
//         console.error("Mermaid error:", error);
//       }
//     }, 0); 
//   };

//   if (content) {
//     renderMermaid();
//   }
// }, [content]);

//   return (
//     <div className="markdown-container" style={{ padding: '20px', background: '#fff' }}>
//       <div className="markdown-body">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]} // Hỗ trợ Table, Checkbox của GitHub
//           rehypePlugins={[
//             rehypeRaw,      // Cho phép render HTML thuần nếu có
//             rehypeHighlight, // Tô màu code snippet
//             rehypeSlug      // Tự tạo ID cho tiêu đề để làm Mục lục (Anchors)
//           ]}
//           components={{
//             // Tùy chỉnh cách hiển thị thẻ <code>
//             code({ node, inline, className, children, ...props }) {
//               const match = /language-mermaid/.exec(className || '');
              
//               // Nếu là block code mermaid: render ra div đặc biệt cho mermaid.js
//               if (!inline && match) {
//                 return (
//                   <div className="mermaid">
//                     {String(children).replace(/\n$/, '')}
//                   </div>
//                 );
//               }

//               // Nếu là code bình thường: render theo chuẩn react-markdown
//               return (
//                 <code className={className} {...props}>
//                   {children}
//                 </code>
//               );
//             },
//             // Giúp hình ảnh co giãn tốt
//             img({ node, ...props }) {
//               return <img style={{ maxWidth: '100%', height: 'auto' }} {...props} alt={props.alt || 'image'} />;
//             }
//           }}
//         >
//           {content}
//         </ReactMarkdown>
//       </div>
//     </div>
//   );
// };

// export default Markdown;


import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import MermaidChart from './MermaidChart'; // Import component vừa tạo

import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';

const Markdown = ({ content }) => {
  return (
    <div className="markdown-body" style={{ padding: '30px' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-mermaid/.exec(className || '');
            
            // Nếu là mermaid, dùng Component riêng để render
            if (!inline && match) {
              return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
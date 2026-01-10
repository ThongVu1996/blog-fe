import { useNavigate } from 'react-router-dom';
import { Rocket, Home } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '20px'
        }}>
            <div style={{
                fontSize: '8rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #0ea5e9, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                marginBottom: '20px',
                fontFamily: "'Orbitron', sans-serif"
            }}>
                404
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)'
            }}>
                <Rocket size={64} color="#e2e8f0" />
            </div>

            <h2 style={{
                fontSize: '2rem',
                marginBottom: '15px',
                fontWeight: '700'
            }}>
                LẠC VÀO HỐ ĐEN?
            </h2>

            <p style={{
                color: '#94a3b8',
                fontSize: '1.1rem',
                maxWidth: '500px',
                marginBottom: '40px',
                lineHeight: '1.6'
            }}>
                Trang bạn tìm kiếm không tồn tại hoặc đã bị hút vào không gian khác.
                Hãy quay trở lại căn cứ an toàn.
            </p>

            <button
                onClick={() => navigate('/')}
                className="btn-primary"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    fontSize: '1rem'
                }}
            >
                <Home size={20} />
                <span>Về Trang Chủ</span>
            </button>
        </div>
    );
};

export default NotFoundPage;

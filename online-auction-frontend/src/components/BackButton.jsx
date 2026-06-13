import { useNavigate } from 'react-router-dom';

function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="btn-back mb-3"
      onClick={() => navigate(-1)}
    >
      ← {label}
    </button>
  );
}

export default BackButton;
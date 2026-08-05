import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Mail, Lock, UserPlus, Loader2, User, ShieldCheck } from "lucide-react";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (error) {
      if (error.message.includes("invalid format")) {
        setError("올바른 이메일 형식이 아닙니다.");
      } else {
        setError(`회원가입에 실패했습니다: 올바른 정보를 입력했는지 확인해주세요.`);
      }
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError("이미 가입된 이메일 주소입니다.");
    } else {
      alert("회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.");
      navigate("/login");
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>
        <p className="auth-subtitle">새로운 계정을 만들어 시작해보세요</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSignup} noValidate>
          <div className="input-group">
            <label htmlFor="name">이름 (또는 닉네임)</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="auth-input"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="auth-input"
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="최소 6자 이상"
                className="auth-input"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <div className="input-wrapper">
              <ShieldCheck className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력해주세요"
                className="auth-input"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus />}
            <span>{loading ? "처리 중..." : "가입하기"}</span>
          </button>
        </form>
        
        <div className="auth-footer">
          이미 계정이 있으신가요? 
          <Link to="/login" className="auth-link">로그인</Link>
        </div>
      </div>
    </div>
  );
}

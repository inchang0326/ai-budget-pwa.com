import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 클라이언트 단 유효성 검사 (한국어)
    if (!email.trim() || !email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Email not confirmed") {
        setError("이메일 인증을 완료해 주세요. 발송된 메일함을 확인해 주시기 바랍니다.");
      } else if (error.message === "Invalid login credentials") {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else if (error.message.includes("invalid format")) {
        setError("올바른 이메일 형식이 아닙니다.");
      } else {
        setError(`로그인에 실패했습니다: 올바른 정보를 입력했는지 확인해주세요.`);
      }
    } else {
      navigate("/");
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">환영합니다</h2>
        <p className="auth-subtitle">서비스를 이용하기 위해 로그인해주세요</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleLogin} noValidate>
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
                placeholder="••••••••"
                className="auth-input"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
            <span>{loading ? "로그인 중..." : "로그인"}</span>
          </button>
        </form>
        
        <div className="auth-footer">
          계정이 없으신가요? 
          <Link to="/signup" className="auth-link">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

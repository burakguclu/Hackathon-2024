import React, { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { auth } from '../Firebase';
import '../css/Login.css'
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      if (user) {
        navigate("/home");
      }
    } catch (error) {
      toast.error("Giriş yapılamadı. Hata mesajı: " + error.message);
    }
  }

  const loginWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(response);
      const token = credential.accessToken;
      const user = response.user;
      if (user) {
        navigate("/home");
      }
    } catch (error) {
      toast.error("Giriş yapılamadı. Hata mesajı: " + error.message);
    }
  }

  return (
    <body class="login-body">
      <div className='login'>
        <h1>Giriş Yap</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder='E-mail'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaEnvelope className='icon' />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Şifre"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>

        <div className='google-login'>
          <button onClick={loginWithGoogle} className='google-button'><FaGoogle className='google-logo' /> Google ile giriş yap</button>
        </div>

        <div className="register-link">
          <p>Hesabın yok mu? <a href="/register">Kayıt ol</a></p>
        </div>


      </div>
    </body>
  )
}

export default Login
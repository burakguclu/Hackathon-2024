import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';
import '../css/Register.css'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            if (user) {
                toast.success("Kullanıcı oluşturuldu");
                navigate("/home");
            }
        } catch (error) {
            toast.error("Kayıt yapılamadı. Hata mesajı: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <body className='register-body'>
            <div className='register'>
                <h1>Kayıt Ol</h1>

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
                        placeholder='Şifre'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className='icon' />
                </div>

                <button onClick={handleRegister} disabled={loading}>
                    {loading ? 'Kayıt Olunuyor, Lütfen Bekleyiniz...' : 'Kayıt Ol'}
                </button>

                <div className="register-link">
                    <p>Zaten hesabın var mı? <a href="/">Giriş yap</a></p>
                </div>
            </div>
        </body>
    )
}

export default Register;
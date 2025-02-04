import { useEffect, useState } from 'react';
import '../css/Sidebar.css';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const menuItems = [
        {
            text: "Konu Çalış",
            icon: "/icons/message.svg",
            path: "/home"
        },
        {
            text: "Kısa Sınav Oluştur",
            icon: "/icons/pie-chart.svg",
            path: "/quizApp"
        },
    ];

    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [userpic, setUserpic] = useState('');
    const [userState, setUserstate] = useState(false);
    const [isExpanded, setExpendState] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                setUserstate(true);
                setUser(userCredential.displayName || userCredential.email);
                setUserpic(userCredential.photoURL || "icons/admin-avatar.svg");
            } else {
                setUserstate(false);
                setUserpic("");
            }
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        setExpendState(false);
        toast.success("Çıkış yapılıyor");
        setTimeout(async () => {
            await signOut(auth);
            navigate('/');
            setUserstate(false);
            setUserpic("");
            setUser("");
        }, 3000);
    };

    return (
        <div className={isExpanded ? 'side-nav-container' : "side-nav-container side-nav-container-NX"}>
            <div className='nav-upper'>
                <div className='nav-heading'>
                    {isExpanded && (
                        <div className='nav-brand'>
                            <img src="icons/Logo.svg" alt="" />
                            <h2>Ders Uygulaması</h2>
                        </div>
                    )}
                    <button
                        className={isExpanded ? 'hamburger hamburger-in' : "hamburger hamburger-out"}
                        onClick={() => setExpendState(!isExpanded)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div className="nav-menu">
                    {menuItems.map(({ text, icon, path }, index) => (
                        <a
                            key={index}
                            className={isExpanded ? "menu-item" : "menu-item menu-item-NX"}
                            href={path}
                        >
                            <img className="menu-item-icon" src={icon} alt="" />
                            {isExpanded && <p>{text}</p>}
                            {!isExpanded && <div className="tooltip">{text}</div>}
                        </a>
                    ))}
                </div>
            </div>
            <div className="nav-footer">
                <div className="nav-details">
                    <p className={isExpanded ? "nav-details" : "nav-details nav-details-NX"}>
                        <img className="menu-item-icon" src={userpic} alt="" />
                        {isExpanded && (
                            <div className="nav-footer-info">
                                <p className="nav-footer-user-name">{user}</p>
                            </div>
                        )}
                    </p>
                </div>
                {userState && (
                    <a
                        className={isExpanded ? "menu-item" : "menu-item menu-item-NX"}
                        onClick={logout}
                    >
                        <img className="menu-item-icon" src="icons/logout.svg" alt="" />
                        {isExpanded && <p>Çıkış yap</p>}
                        {!isExpanded && <div className="tooltip">Çıkış yap</div>}
                    </a>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
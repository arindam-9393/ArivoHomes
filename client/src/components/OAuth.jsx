import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. ACCEPT 'role' PROP HERE
const OAuth = ({ role }) => { 
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            
            // 2. SEND ROLE TO BACKEND
            const res = await axios.post('http://localhost:3000/user/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
                role: role || 'tenant' // Send the selected role!
            });

            localStorage.setItem('user', JSON.stringify(res.data));
            navigate('/dashboard');

        } catch (error) {
            console.error("Could not sign in with Google", error);
        }
    };

    return (
        <button 
            type="button" 
            onClick={handleGoogleClick}
            style={{ 
                backgroundColor: '#db4437', 
                color: 'white', 
                padding: '12px', 
                borderRadius: '8px', 
                border: 'none', 
                width: '100%', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                marginBottom: '15px',
                marginTop: '10px'
            }}
        >
            CONTINUE WITH GOOGLE
        </button>
    );
}

export default OAuth;
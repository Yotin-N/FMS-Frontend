import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Snackbar, Alert } from "@mui/material";

const AuthStatusHandler = () => {
    const navigate = useNavigate();
    const {isAuthenticated, logout} = useAuth();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        
        const authError = localStorage.getItem('authError');
        if (authError) {
            setMessage(authError);
            setOpen(true);
            localStorage.removeItem('authError');
    
            if(isAuthenticated) {
                logout();
                navigate('/login', {state: {error: authError}});
            }
        }
    
      
        const checkAuthState = async () => {
            try {
              
            } catch (error) {
                if (error?.response?.status === 401 && isAuthenticated) {
                    logout();
                    navigate('/login', {state: {error: "Session expired"}});
                }
            }
        };
        
  
        checkAuthState();
    }, [isAuthenticated, logout, navigate]);

    const handleClose = () => {
        setOpen(false)
    };
    

    return (
        <Snackbar
            open= {open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleClose} severity="error" sx={{width: '100%'}} >
                    {message}
                </Alert>
    
        </Snackbar>
    )
    
}



export default AuthStatusHandler
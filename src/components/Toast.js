import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // auto-close in 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getBackground = () => {
        switch (type) {
            case 'success':
                return '#d4edda';
            case 'error':
                return '#f8d7da';
            case 'info':
                return '#d1ecf1';
            case 'warning':
                return '#fff3cd';
            default:
                return '#f8f9fa';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return '#155724';
            case 'error':
                return '#721c24';
            case 'info':
                return '#0c5460';
            case 'warning':
                return '#856404';
            default:
                return '#333';
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: '70px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: getBackground(),
                color: getTextColor(),
                padding: '12px 24px',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                zIndex: 1000,
                border: '1px solid #ccc',
                minWidth: '250px',
                textAlign: 'center',
            }}
        >
            {message}
        </div>
    );
};

export default Toast;

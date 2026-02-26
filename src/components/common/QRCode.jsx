import { QRCodeSVG } from 'qrcode.react';

const QRCode = ({ value, size = 128, className = '' }) => {
    return (
        <div className={`inline-block p-4 bg-white rounded-xl shadow-card ${className}`}>
            <QRCodeSVG
                value={value}
                size={size}
                level="M"
                includeMargin={false}
                fgColor="#1e293b"
                bgColor="#ffffff"
            />
        </div>
    );
};

export default QRCode;

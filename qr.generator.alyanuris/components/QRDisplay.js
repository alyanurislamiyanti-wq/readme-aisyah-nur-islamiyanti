function QRDisplay({ qrUrl, qrData, onDownload }) {
    const [framedUrl, setFramedUrl] = React.useState('');
    const [framedJpgUrl, setFramedJpgUrl] = React.useState('');
    const frame = qrData.frame || {};

    const characters = {
        bunny: { face: '🐰', ears: '˘ ᵕ ˘' },
        bear: { face: '🐻', ears: 'ʕ ᵕ ᴥ ᵕ ʔ' },
        cat: { face: '🐱', ears: 'ฅ^•ﻌ•^ฅ' },
        panda: { face: '🐼', ears: '◕ ᴥ ◕' }
    };

    React.useEffect(() => {
        if (!qrUrl) return;
        const image = new Image();
        image.onload = () => {
            const logoImage = qrData.logo ? new Image() : null;
            const renderCanvas = () => {
            const canvas = document.createElement('canvas');
            const padding = frame.padding || 52;
            const infoPosition = frame.infoPosition || 'bottom';
            const hasInfo = frame.showLabel;
            const infoSize = frame.showLabel ? 150 : 0;
            const qrSize = image.width + (padding * 2);
            const horizontalInfo = infoPosition === 'top' || infoPosition === 'bottom';
            const canvasWidth = horizontalInfo ? qrSize : qrSize + infoSize;
            const canvasHeight = horizontalInfo ? qrSize + infoSize : qrSize;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            const context = canvas.getContext('2d');
            const radius = frame.radius || 28;
            const style = frame.style || 'classic';
            const background = style === 'midnight' ? '#17202a' : (frame.background || '#fff7f7');
            const accent = frame.color || '#e8747c';

            context.fillStyle = background;
            context.beginPath();
            context.roundRect(0, 0, canvas.width, canvas.height, radius);
            context.fill();
            if (style === 'soft') {
                context.fillStyle = accent;
                context.globalAlpha = 0.12;
                context.beginPath();
                context.arc(canvas.width, 0, canvas.width * 0.42, 0, Math.PI * 2);
                context.fill();
                context.globalAlpha = 1;
            }
            const qrX = infoPosition === 'left' ? infoSize : 0;
            const qrY = infoPosition === 'top' ? infoSize : 0;
            context.drawImage(image, qrX + padding, qrY + padding, image.width, image.height);
            if (logoImage && logoImage.naturalWidth) {
                const logoSize = image.width * 0.22;
                const logoX = qrX + padding + (image.width - logoSize) / 2;
                const logoY = qrY + padding + (image.height - logoSize) / 2;
                context.fillStyle = '#ffffff';
                context.beginPath();
                context.roundRect(logoX - 12, logoY - 12, logoSize + 24, logoSize + 24, 18);
                context.fill();
                context.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            }
            if (hasInfo) {
                context.fillStyle = style === 'midnight' ? '#ffffff' : accent;
                context.textAlign = 'center';
                const centerX = infoPosition === 'left' ? infoSize / 2 : infoPosition === 'right' ? qrSize + infoSize / 2 : canvas.width / 2;
                const centerY = infoPosition === 'top' ? infoSize / 2 : infoPosition === 'bottom' ? qrSize + infoSize / 2 : canvas.height / 2;
                const character = characters[frame.character];
                const fontSize = frame.fontSize || 24;
                if (character) {
                    context.font = `${fontSize + 14}px Arial, sans-serif`;
                    context.fillText(character.face, centerX, centerY - 10);
                }
                context.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
                if (infoPosition === 'left' || infoPosition === 'right') {
                    context.save();
                    context.translate(centerX, centerY + (character ? 40 : 8));
                    context.rotate(-Math.PI / 2);
                    context.fillText((frame.label || 'SCAN ME').toUpperCase(), 0, 0);
                    context.restore();
                } else {
                    context.fillText((frame.label || 'SCAN ME').toUpperCase(), centerX, centerY + (character ? 42 : 8));
                }
            }
            setFramedUrl(canvas.toDataURL('image/png'));
            setFramedJpgUrl(canvas.toDataURL('image/jpeg', 0.94));
            };
            if (logoImage) {
                logoImage.onload = renderCanvas;
                logoImage.src = qrData.logo;
            } else {
                renderCanvas();
            }
        };
        image.src = qrUrl;
    }, [qrUrl, frame, qrData.logo]);

    const downloadQR = (format) => {
        try {
            const link = document.createElement('a');
            link.download = `qr-code-${Date.now()}.${format}`;
            link.href = format === 'jpg' ? (framedJpgUrl || framedUrl || qrUrl) : (framedUrl || qrUrl);
            link.click();
            onDownload();
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    return (
        <section className="card text-center" data-name="qr-display" data-file="components/QRDisplay.js">
            <h2 className="text-lg font-bold mb-6">Pratinjau QR Code</h2>
            
            <div className="relative group mb-6 inline-block w-full max-w-[300px] aspect-square flex items-center justify-center">
                {framedUrl ? (
                    <img src={framedUrl} alt="QR Code dengan frame" className="w-full h-full object-contain shadow-lg rounded-2xl" />
                ) : (
                    <div className="flex flex-col items-center text-rose-300">
                        <div className="icon-loader animate-spin text-3xl mb-2"></div>
                        <p className="text-sm">Menghasilkan...</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => downloadQR('png')} className="btn btn-primary">
                    <div className="icon-download"></div>
                    PNG
                </button>
                <button onClick={() => downloadQR('jpg')} className="btn btn-outline">
                    <div className="icon-image"></div>
                    JPG
                </button>
            </div>

            <p className="text-xs text-slate-500 bg-rose-50 p-3 rounded-lg border border-rose-100 italic">
                Tips: Pastikan kontras warna cukup tinggi agar mudah dipindai oleh perangkat kamera.
            </p>
        </section>
    );
}
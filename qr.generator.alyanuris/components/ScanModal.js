function ScanModal({ onClose }) {
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const [cameraError, setCameraError] = React.useState('');
    const [result, setResult] = React.useState('');
    const [isScanning, setIsScanning] = React.useState(false);

    React.useEffect(() => {
        let stream;
        let scanTimer;
        const startCamera = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraError('Browser ini tidak mendukung akses kamera. Gunakan upload gambar QR.');
                return;
            }
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setIsScanning(true);
                    scanTimer = window.setInterval(scanVideo, 180);
                }
            } catch (error) {
                setCameraError('Kamera belum diizinkan. Anda tetap bisa memilih gambar QR dari perangkat.');
            }
        };
        const scanVideo = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState < 2 || !window.jsQR) return;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = window.jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' });
            if (code) setResult(code.data);
        };
        startCamera();
        return () => {
            if (scanTimer) window.clearInterval(scanTimer);
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const readImage = (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        const image = new Image();
        image.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = window.jsQR ? window.jsQR(pixels.data, pixels.width, pixels.height, { inversionAttempts: 'attemptBoth' }) : null;
            setResult(code ? code.data : 'QR Code tidak ditemukan di gambar ini.');
            URL.revokeObjectURL(image.src);
        };
        image.src = URL.createObjectURL(file);
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-rose-400">QR Scanner</p><h2 className="mt-1 text-2xl font-black text-slate-800">Scan QR Code</h2></div>
                    <button onClick={onClose} className="icon-x rounded-full p-2 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Tutup scanner"></button>
                </div>
                <div className="space-y-4 p-6">
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline></video>
                        <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-white/80 shadow-[0_0_0_999px_rgba(15,23,42,.25)]"></div>
                        {!isScanning && <div className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-white/80">Menyiapkan kamera...</div>}
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {cameraError && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{cameraError}</p>}
                    {result && (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <div className="mb-1 flex items-center gap-2 text-sm font-bold text-emerald-700"><div className="icon-circle-check"></div> QR berhasil dibaca</div>
                            <p className="break-all text-sm text-slate-600">{result}</p>
                            {/^(https?:\/\/|mailto:|tel:)/i.test(result) && <a href={result} target="_blank" rel="noreferrer" className="btn btn-primary mt-3 w-full">Buka hasil <div className="icon-external-link"></div></a>}
                        </div>
                    )}
                    <div className="flex items-center gap-3"><div className="h-px flex-1 bg-slate-100"></div><span className="text-xs font-semibold uppercase tracking-widest text-slate-400">atau</span><div className="h-px flex-1 bg-slate-100"></div></div>
                    <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className="btn btn-outline w-full"><div className="icon-image-up"></div> Pilih gambar QR</button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={readImage} />
                </div>
            </div>
        </div>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center max-w-md">
                        <div className="icon-triangle-alert text-red-500 text-6xl mx-auto mb-4"></div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
                        <p className="text-gray-600 mb-6">Aplikasi mengalami kendala teknis. Silakan muat ulang halaman.</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary w-full">Muat Ulang</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function App() {
    const [showIntro, setShowIntro] = React.useState(true);
    const [showScanner, setShowScanner] = React.useState(false);
    const [qrData, setQrData] = React.useState({
        type: 'url',
        content: '',
        color: '#475569',
        bgColor: '#ffffff',
        margin: 4,
        width: 1024,
        errorLevel: 'H',
        logo: null,
        frame: {
            style: 'classic',
            color: '#e8747c',
            background: '#fff7f7',
            label: 'SCAN ME',
            showLabel: true,
            fontSize: 24,
            infoPosition: 'bottom',
            character: 'bunny',
            radius: 28,
            padding: 52
        }
    });

    const [qrUrl, setQrUrl] = React.useState('');
    const [history, setHistory] = React.useState([]);

    React.useEffect(() => {
        generateQR();
    }, [qrData]);

    const generateQR = async () => {
        try {
            const dataString = qrUtils.formatData(qrData.type, qrData.content, qrData);
            const url = await qrUtils.createQR(dataString, {
                color: {
                    dark: qrData.color,
                    light: qrData.bgColor
                },
                margin: qrData.margin,
                width: qrData.width,
                errorCorrectionLevel: qrData.errorLevel
            });
            setQrUrl(url);
        } catch (err) {
            console.error("QR Generation failed", err);
        }
    };

    const handleDataChange = (newData) => {
        setQrData(prev => ({ ...prev, ...newData }));
    };

    const handleFrameChange = (newFrame) => {
        setQrData(prev => ({ ...prev, frame: { ...prev.frame, ...newFrame } }));
    };

    const saveToHistory = () => {
        const newEntry = {
            id: Date.now(),
            ...qrData,
            qrUrl,
            timestamp: new Date().toISOString()
        };
        setHistory([newEntry, ...history.slice(0, 9)]);
    };

    return (
        <div className="min-h-screen flex flex-col" data-name="app-container" data-file="app.js">
            {showIntro && (
                <div className="intro-screen fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto px-6 py-10">
                    <div className="intro-grid absolute inset-0"></div>
                    <div className="intro-scanline absolute left-0 right-0 top-1/2 z-[1]"></div>
                    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center py-4">
                        <div className="intro-layout grid w-full items-center gap-8 md:grid-cols-[1fr_.82fr] lg:gap-14">
                        <div className="intro-copy">
                            <div className="intro-item intro-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-rose-600 shadow-sm backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                                QRGen Studio
                            </div>
                            <h1 className="intro-item intro-delay-2 max-w-xl text-5xl font-black leading-[.98] tracking-tight text-slate-800 md:text-7xl">Bagikan ide.<br /><span className="intro-accent text-rose-500">Satu scan.</span></h1>
                            <p className="intro-item intro-delay-3 mt-6 max-w-lg text-lg leading-8 text-slate-600">Buat QR Code yang rapi, personal, dan siap dipakai untuk tautan, email, Wi-Fi, kontak, sampai WhatsApp.</p>
                            <button onClick={() => setShowIntro(false)} className="intro-item intro-delay-4 btn btn-primary intro-cta mt-8 px-6 py-3 text-base">
                                Mulai membuat QR <div className="icon-arrow-right"></div>
                            </button>
                            <div className="intro-item intro-delay-5 mt-5 flex items-center gap-3 text-sm text-slate-500"><div className="icon-shield-check text-emerald-500"></div> Gratis, cepat, dan berjalan di browser</div>
                        </div>
                        <div className="intro-preview relative mx-auto w-full max-w-md md:max-w-[360px] lg:max-w-md">
                            <div className="intro-badge absolute -right-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-rose-200/50"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">Ready to share</div><div className="mt-1 flex items-center gap-2 font-bold text-slate-700"><div className="icon-sparkles text-rose-400"></div> Made with care</div></div>
                            <div className="qr-orbit absolute -inset-5 rounded-[2.5rem] border border-dashed border-rose-300/60"></div>
                            <div className="relative rounded-[2rem] border-8 border-white bg-white p-8 shadow-[0_30px_80px_rgba(205,76,111,.2)]">
                                <div className="mb-6 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-rose-400">Your moment</div><div className="mt-1 text-xl font-black text-slate-800">Scan the good stuff</div></div><div className="icon-qr-code text-3xl text-slate-700"></div></div>
                                <div className="intro-qr relative mx-auto grid aspect-square max-w-[250px] place-items-center rounded-3xl bg-slate-800 p-5">
                                    <div className="qr-scan-beam absolute left-3 right-3 top-4 z-10 h-1 rounded-full bg-rose-300 shadow-[0_0_16px_4px_rgba(255,111,145,.7)]"></div>
                                    <div className="grid aspect-square w-full grid-cols-7 gap-1.5">
                                        {[1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,0,1,1].map((cell, index) => <span key={index} className={cell ? 'rounded-sm bg-white' : 'rounded-sm bg-transparent'}></span>)}
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-500"><div className="intro-status h-2 w-2 rounded-full bg-emerald-400"></div><div className="icon-scan-line text-rose-400"></div> Simple. Beautiful. Yours.</div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
            <Header onScan={() => setShowScanner(true)} />
            <Sidebar onScan={() => setShowScanner(true)} />
            <main className="flex-1 xl:ml-64 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-yellow-50 to-sky-100 rounded-[2rem] p-8 mb-8 border-2 border-white shadow-[0_12px_30px_rgba(255,111,145,.12)]">
                        <div className="relative z-10">
                            <div className="text-center">
                                <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Halo, Selamat Datang! ✨</h1>
                                <p className="text-slate-600">Buat QR Code cantikmu sekarang dengan mudah dan cepat.</p>
                            </div>
                        </div>
                    </div>

                    <section className="card relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                <div className="icon-pencil text-xl"></div>
                            </div>
                            <h2 className="text-xl font-bold">Input Data</h2>
                        </div>
                        <InputForm qrData={qrData} onDataChange={handleDataChange} />
                    </section>

                    <section className="card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                <div className="icon-settings text-xl"></div>
                            </div>
                            <h2 className="text-xl font-bold">Kustomisasi</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Warna QR</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={qrData.color} 
                                        onChange={(e) => handleDataChange({color: e.target.value})}
                                        className="h-10 w-20 rounded cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={qrData.color} 
                                        onChange={(e) => handleDataChange({color: e.target.value})}
                                        className="flex-1 px-3 py-2 border rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Warna Background</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={qrData.bgColor} 
                                        onChange={(e) => handleDataChange({bgColor: e.target.value})}
                                        className="h-10 w-20 rounded cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={qrData.bgColor} 
                                        onChange={(e) => handleDataChange({bgColor: e.target.value})}
                                        className="flex-1 px-3 py-2 border rounded-lg uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                <div className="icon-panels-top-left text-xl"></div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Frame Estetik</h2>
                                <p className="text-sm text-slate-500">Buat QR lebih menonjol dan siap dibagikan.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Gaya frame</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'classic', label: 'Classic', icon: 'icon-square-dashed' },
                                        { id: 'soft', label: 'Soft', icon: 'icon-scan-line' },
                                        { id: 'midnight', label: 'Midnight', icon: 'icon-moon-star' }
                                    ].map(style => (
                                        <button key={style.id} onClick={() => handleFrameChange({ style: style.id })} className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${qrData.frame.style === style.id ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-rose-200 hover:bg-rose-50'}`}>
                                            <div className={`${style.icon} text-xl`}></div>
                                            {style.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Warna aksen</label>
                                <div className="flex gap-2">
                                    <input type="color" value={qrData.frame.color} onChange={(e) => handleFrameChange({color: e.target.value})} className="h-10 w-16 rounded cursor-pointer" />
                                    <input type="text" value={qrData.frame.color} onChange={(e) => handleFrameChange({color: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg uppercase" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Warna frame</label>
                                <div className="flex gap-2">
                                    <input type="color" value={qrData.frame.background} onChange={(e) => handleFrameChange({background: e.target.value})} className="h-10 w-16 rounded cursor-pointer" />
                                    <input type="text" value={qrData.frame.background} onChange={(e) => handleFrameChange({background: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg uppercase" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Logo di tengah QR</label>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="btn btn-outline cursor-pointer">
                                        <div className="icon-upload"></div>
                                        {qrData.logo ? 'Ganti logo' : 'Unggah logo'}
                                        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = (event) => handleDataChange({logo: event.target.result});
                                            reader.readAsDataURL(file);
                                        }} />
                                    </label>
                                    {qrData.logo && (
                                        <button onClick={() => handleDataChange({logo: null})} className="btn text-rose-600 hover:bg-rose-50">
                                            <div className="icon-trash-2"></div>
                                            Hapus logo
                                        </button>
                                    )}
                                    <span className="text-xs text-slate-500">PNG transparan paling cocok untuk hasil bersih.</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Label bawah QR</label>
                                <div className="flex gap-3">
                                    <input type="text" value={qrData.frame.label} maxLength="24" onChange={(e) => handleFrameChange({label: e.target.value})} className="input-field" placeholder="SCAN ME" />
                                    <label className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-600">
                                        <input type="checkbox" checked={qrData.frame.showLabel} onChange={(e) => handleFrameChange({showLabel: e.target.checked})} className="h-4 w-4 accent-rose-400" />
                                        Tampilkan
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Posisi info</label>
                                <select value={qrData.frame.infoPosition} onChange={(e) => handleFrameChange({infoPosition: e.target.value})} className="input-field">
                                    <option value="top">Di atas QR</option>
                                    <option value="bottom">Di bawah QR</option>
                                    <option value="left">Di kiri QR</option>
                                    <option value="right">Di kanan QR</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Karakter frame</label>
                                <select value={qrData.frame.character} onChange={(e) => handleFrameChange({character: e.target.value})} className="input-field">
                                    <option value="bunny">Kelinci imut</option>
                                    <option value="bear">Beruang manis</option>
                                    <option value="cat">Kucing ceria</option>
                                    <option value="panda">Panda kecil</option>
                                    <option value="none">Tanpa karakter</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2"><span>Sudut frame</span><span className="text-rose-500">{qrData.frame.radius}px</span></label>
                                <input type="range" min="8" max="48" value={qrData.frame.radius} onChange={(e) => handleFrameChange({radius: Number(e.target.value)})} className="w-full accent-rose-400" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center justify-between text-sm font-medium text-slate-700 mb-2"><span>Ukuran font info</span><span className="text-rose-500">{qrData.frame.fontSize}px</span></label>
                                <input type="range" min="14" max="48" value={qrData.frame.fontSize} onChange={(e) => handleFrameChange({fontSize: Number(e.target.value)})} className="w-full accent-rose-400" />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <QRDisplay qrUrl={qrUrl} qrData={qrData} onDownload={saveToHistory} />
                    
                    {history.length > 0 && (
                        <section className="card">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <div className="icon-clock text-rose-300"></div>
                                Riwayat Terakhir
                            </h3>
                            <div className="space-y-3">
                                {history.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                                        <img src={item.qrUrl} className="w-12 h-12 rounded border" alt="history-qr" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.content}</p>
                                            <p className="text-xs text-rose-300 uppercase">{item.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <footer className="py-8 border-t bg-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    <p className="font-semibold text-slate-700">Dibuat oleh Aisyah Nur Islamiyanti</p>
                    <p className="mt-1">Siswi kelas 12 ITCP 2 MAM 1 Paciran</p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
                        <a href="mailto:alyanurislamiyanti@gmail.com" className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors">
                            <div className="icon-mail"></div>
                            alyanurislamiyanti@gmail.com
                        </a>
                        <a href="https://instagram.com/alyanurisreal_1826" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors">
                            <div className="icon-instagram"></div>
                            @alyanurisreal_1826
                        </a>
                        <a href="https://www.aisyahnurislamiyanti.my.id/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-rose-600 transition-colors">
                            <div className="icon-globe"></div>
                            www.aisyahnurislamiyanti.my.id
                        </a>
                    </div>
                </div>
            </footer>
            {showScanner && <ScanModal onClose={() => setShowScanner(false)} />}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
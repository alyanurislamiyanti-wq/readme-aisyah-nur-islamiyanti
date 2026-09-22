function Header({ onScan }) {
    return (
        <header className="bg-white/90 backdrop-blur-md border-b-2 border-pink-100 sticky top-0 z-50" data-name="header" data-file="components/Header.js">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-pink-400 via-orange-300 to-yellow-300 rounded-xl rotate-3 flex items-center justify-center shadow-sm">
                        <div className="icon-qr-code text-white text-lg"></div>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                        QRGen
                    </span>
                </div>
                
                <nav className="flex items-center gap-3">
                    <button onClick={onScan} className="btn btn-outline px-3 py-2 text-sm"><div className="icon-scan-line"></div> Scan QR</button>
                </nav>

                <button className="md:hidden text-slate-600">
                    <div className="icon-menu text-2xl"></div>
                </button>
            </div>
        </header>
    );
}
function Sidebar({ onScan }) {
    const menuItems = [
        { icon: 'icon-house', label: 'Beranda', active: true },
        { icon: 'icon-history', label: 'Riwayat QR' },
        { icon: 'icon-star', label: 'Favorit' },
    ];

    const stats = [
        { label: 'QR Dibuat', value: '128', icon: 'icon-chart-bar' },
        { label: 'Penyimpanan', value: '85%', icon: 'icon-hard-drive' },
    ];

    return (
        <aside className="hidden xl:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white border-r p-6 overflow-y-auto" data-name="sidebar" data-file="components/Sidebar.js">
            <div className="space-y-8">
                <div>
                    <h3 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-4 px-2">Menu Utama</h3>
                    <nav className="space-y-1">
                        {menuItems.map((item, idx) => (
                            <a 
                                key={idx} 
                                href="#" 
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${item.active ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'}`}
                            >
                                <div className={`${item.icon} text-lg`}></div>
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>

                <button onClick={onScan} className="btn btn-primary w-full"><div className="icon-scan-line"></div> Scan QR Code</button>

                <div>
                    <h3 className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-4 px-2">Statistik Anda</h3>
                    <div className="space-y-4">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`${stat.icon} text-rose-300`}></div>
                                    <span className="text-xs font-bold text-rose-600">{stat.value}</span>
                                </div>
                                <p className="text-xs text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
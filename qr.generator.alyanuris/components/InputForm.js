function InputForm({ qrData, onDataChange }) {
    const types = [
        { id: 'url', label: 'Tautan', icon: 'icon-link' },
        { id: 'text', label: 'Teks', icon: 'icon-file-text' },
        { id: 'email', label: 'Email', icon: 'icon-mail' },
        { id: 'wifi', label: 'WiFi', icon: 'icon-wifi' },
        { id: 'vcard', label: 'Kontak', icon: 'icon-user' },
        { id: 'whatsapp', label: 'WhatsApp', icon: 'icon-message-circle' }
    ];

    const renderInputs = () => {
        switch(qrData.type) {
            case 'url':
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">URL Tujuan</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 icon-globe text-rose-300"></div>
                            <input 
                                type="url" 
                                placeholder="https://example.com" 
                                className="input-field pl-12"
                                value={qrData.content}
                                onChange={(e) => onDataChange({content: e.target.value})}
                            />
                        </div>
                    </div>
                );
            case 'text':
                return (
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">Teks Bebas</label>
                        <textarea 
                            rows="4"
                            placeholder="Ketik pesan atau informasi di sini..."
                            className="input-field resize-none"
                            value={qrData.content}
                            onChange={(e) => onDataChange({content: e.target.value})}
                        ></textarea>
                    </div>
                );
            case 'whatsapp':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor HP</label>
                            <input 
                                type="tel" 
                                placeholder="628123456789" 
                                className="input-field"
                                value={qrData.phone || ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onDataChange({phone: val, content: `https://wa.me/${val}`});
                                }}
                            />
                        </div>
                    </div>
                );
            case 'email':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat email</label>
                            <input type="email" placeholder="nama@contoh.com" className="input-field" value={qrData.content || ''} onChange={(e) => onDataChange({content: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
                            <input type="text" placeholder="Subjek pesan" className="input-field" value={qrData.emailSubject || ''} onChange={(e) => onDataChange({emailSubject: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
                            <input type="text" placeholder="Isi pesan" className="input-field" value={qrData.emailBody || ''} onChange={(e) => onDataChange({emailBody: e.target.value})} />
                        </div>
                    </div>
                );
            case 'wifi':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Wi-Fi (SSID)</label>
                            <input type="text" placeholder="Nama jaringan" className="input-field" value={qrData.wifiSsid || ''} onChange={(e) => onDataChange({wifiSsid: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Keamanan</label>
                            <select className="input-field" value={qrData.wifiSecurity || 'WPA'} onChange={(e) => onDataChange({wifiSecurity: e.target.value})}>
                                <option value="WPA">WPA / WPA2 / WPA3</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Tanpa password</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input type="text" placeholder="Password jaringan" className="input-field" value={qrData.wifiPassword || ''} onChange={(e) => onDataChange({wifiPassword: e.target.value})} disabled={qrData.wifiSecurity === 'nopass'} />
                        </div>
                        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm text-slate-600">
                            <input type="checkbox" checked={Boolean(qrData.wifiHidden)} onChange={(e) => onDataChange({wifiHidden: e.target.checked})} className="h-4 w-4 accent-rose-400" />
                            Jaringan tersembunyi
                        </label>
                    </div>
                );
            case 'vcard':
                return (
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama lengkap</label>
                            <input type="text" placeholder="Aisyah Nur" className="input-field" value={qrData.contactName || ''} onChange={(e) => onDataChange({contactName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor telepon</label>
                            <input type="tel" placeholder="081234567890" className="input-field" value={qrData.contactPhone || ''} onChange={(e) => onDataChange({contactPhone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" placeholder="nama@contoh.com" className="input-field" value={qrData.contactEmail || ''} onChange={(e) => onDataChange({contactEmail: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Organisasi</label>
                            <input type="text" placeholder="Nama sekolah atau perusahaan" className="input-field" value={qrData.contactOrg || ''} onChange={(e) => onDataChange({contactOrg: e.target.value})} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div data-name="input-form" data-file="components/InputForm.js">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
                {types.map(t => (
                    <button 
                        key={t.id}
                        onClick={() => onDataChange({type: t.id, content: '', emailSubject: '', emailBody: '', wifiSsid: '', wifiPassword: '', wifiSecurity: 'WPA', wifiHidden: false, contactName: '', contactPhone: '', contactEmail: '', contactOrg: ''})}
                        className={`tab-btn ${qrData.type === t.id ? 'active' : ''}`}
                    >
                        <div className={`${t.icon} text-2xl`}></div>
                        <span className="text-xs font-semibold">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="min-h-[160px]">
                {renderInputs()}
            </div>
        </div>
    );
}
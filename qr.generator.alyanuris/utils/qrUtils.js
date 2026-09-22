const qrUtils = {
    createQR: async (text, options) => {
        try {
            return await QRCode.toDataURL(text, {
                ...options,
                errorCorrectionLevel: options.errorCorrectionLevel || 'H',
                type: 'image/png',
                rendererOpts: {
                    quality: 1
                }
            });
        } catch (err) {
            throw err;
        }
    },

    formatData: (type, content, data = {}) => {
        const escapeValue = (value) => String(value || '').replace(/([\\;,:])/g, '\\$1').replace(/\r?\n/g, '\\n');
        if (type === 'wifi') {
            const security = data.wifiSecurity || 'WPA';
            return `WIFI:T:${security};S:${escapeValue(data.wifiSsid)};P:${security === 'nopass' ? '' : escapeValue(data.wifiPassword)};H:${data.wifiHidden ? 'true' : 'false'};;`;
        }
        if (type === 'vcard') {
            const name = data.contactName || '';
            const nameParts = name.trim().split(/\s+/);
            const lastName = nameParts.length > 1 ? nameParts.pop() : '';
            const firstName = nameParts.join(' ');
            return `BEGIN:VCARD\nVERSION:3.0\nN:${escapeValue(lastName)};${escapeValue(firstName)};;;\nFN:${escapeValue(name)}\nTEL:${escapeValue(data.contactPhone)}\nEMAIL:${escapeValue(data.contactEmail)}\nORG:${escapeValue(data.contactOrg)}\nEND:VCARD`;
        }
        if (!content && type !== 'email') return ' ';
        switch(type) {
            case 'url':
                return content.startsWith('http') ? content : `https://${content}`;
            case 'email':
                return `mailto:${content || ''}?subject=${encodeURIComponent(data.emailSubject || '')}&body=${encodeURIComponent(data.emailBody || '')}`;
            case 'whatsapp':
                return content;
            case 'wifi':
                // Simple pattern for testing: WIFI:S:Name;T:WPA;P:pass;;
                return content;
            default:
                return content;
        }
    }
};
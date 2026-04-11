// ============================================
// COMPONENT: BottomNav
// ============================================

const BottomNav = ({ active, onNavigate }) => {
    const navItems = [
        { id: 'home', icon: 'fa-home', label: 'Beranda' },
        { id: 'explore', icon: 'fa-compass', label: 'Jelajahi' },
        { id: 'library', icon: 'fa-layer-group', label: 'Koleksi' },
        { id: 'premium', icon: 'fa-crown', label: 'Premium' },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => (
                <div
                    key={item.id}
                    className={`nav-item ${active === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                >
                    <i className={`fas ${item.icon}`}></i>
                    <span>{item.label}</span>
                </div>
            ))}
        </nav>
    );
};
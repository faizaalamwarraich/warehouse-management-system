import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarLinks: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <ul className="nav nav-pills flex-column gap-1">
    <li className="nav-item">
      <NavLink onClick={onNavigate} to="/" end className={({isActive}) => `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : 'bg-transparent'}`}>
        <i className="bi bi-speedometer2" aria-hidden="true"></i><span className="label">Dashboard</span>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink onClick={onNavigate} to="/products" className={({isActive}) => `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : 'bg-transparent'}`}>
        <i className="bi bi-box-seam" aria-hidden="true"></i><span className="label">Products</span>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink onClick={onNavigate} to="/salesmen" className={({isActive}) => `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : 'bg-transparent'}`}>
        <i className="bi bi-people" aria-hidden="true"></i><span className="label">Salesmen</span>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink onClick={onNavigate} to="/assignments" className={({isActive}) => `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : 'bg-transparent'}`}>
        <i className="bi bi-arrow-left-right" aria-hidden="true"></i><span className="label">Assignments</span>
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink onClick={onNavigate} to="/settings" className={({isActive}) => `nav-link text-white d-flex align-items-center gap-2 ${isActive ? 'active bg-primary' : 'bg-transparent'}`}>
        <i className="bi bi-gear" aria-hidden="true"></i><span className="label">Settings</span>
      </NavLink>
    </li>
  </ul>
);

const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('wms.ui.sidebarCollapsed') === '1'; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem('wms.ui.sidebarCollapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <button className="btn btn-outline-light me-2 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#wmsSidebar" aria-controls="wmsSidebar" aria-label="Open sidebar">
            <span className="navbar-toggler-icon" />
          </button>
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img src="/logo1.png" alt="WMS" height={45} width={45} />
          </Link>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button className="btn btn-outline-light d-none d-lg-inline-flex" type="button" onClick={() => setCollapsed(c => !c)} aria-label="Toggle sidebar">
              <i className={`bi ${collapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'}`} aria-hidden="true"></i>
            </button>
            <span className="text-light small d-none d-sm-inline">{user?.username}</span>
            <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Offcanvas Sidebar (mobile/tablet) */}
      <div className="offcanvas offcanvas-start text-bg-dark" tabIndex={-1} id="wmsSidebar" aria-labelledby="wmsSidebarLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title d-flex align-items-center gap-2" id="wmsSidebarLabel">
            <img src="/logo1.png" alt="WMS" height={45} width={45} />
            <span>Navigation</span>
          </h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <SidebarLinks onNavigate={() => {
            // close offcanvas after navigate
            const el = document.getElementById('wmsSidebar');
            if (el) {
              const bs = (window as any).bootstrap;
              const off = bs?.Offcanvas?.getInstance?.(el);
              off?.hide?.();
            }
          }} />
        </div>
      </div>

      {/* Desktop layout (lg+) */}
      <div className="d-none d-lg-flex flex-grow-1">
        <aside className={`sidebar bg-dark text-white p-3 ${collapsed ? 'collapsed' : ''}`}>
          <SidebarLinks />
        </aside>
        <main className="content flex-grow-1 px-3 px-md-4 py-3 content-wrap">
          <Outlet />
        </main>
      </div>

      {/* Footer removed as requested */}
    </div>
  );
};

export default Layout;

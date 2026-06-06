'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  SmilePlus,
  BookHeart,
  BarChart3,
  Wind,
  Bot,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/check-in', label: 'Check-in', icon: SmilePlus },
  { href: '/journal', label: 'Journal', icon: BookHeart },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/exercises', label: 'Exercises', icon: Wind },
  { href: '/coach', label: 'AI Coach', icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className="mobile-header"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          zIndex: 100,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#1E293B',
          }}
        >
          <Image src="/MindPrep.png" alt="MindPrep Logo" width={32} height={32} style={{ borderRadius: '6px' }} />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            MindPrep
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none',
            border: 'none',
            color: '#1E293B',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 199,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: '260px',
          minHeight: '100vh',
          background: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          transition: 'transform 0.3s ease',
          zIndex: 200,
          boxShadow: '1px 0 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: '#1E293B',
            marginBottom: '2rem',
            padding: '0.5rem',
          }}
        >
          <Image src="/MindPrep.png" alt="MindPrep — Mental Wellness for Exam Warriors" width={44} height={44} style={{ borderRadius: '8px' }} />
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MindPrep
            </h1>
            <p
              style={{
                fontSize: '0.7rem',
                color: '#94A3B8',
                letterSpacing: '0.05em',
                marginTop: '2px',
              }}
            >
              TRACK · REFLECT · THRIVE
            </p>
          </div>
        </Link>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 0.5rem',
            borderTop: '1px solid #E2E8F0',
            marginTop: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              color: '#94A3B8',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            Made with 💚 for
            <br />
            Indian exam warriors
          </p>
        </div>
      </aside>

      {/* Responsive Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .mobile-header {
            display: flex !important;
          }
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          main {
            padding-top: 60px !important;
          }
        }
      `}</style>
    </>
  );
}

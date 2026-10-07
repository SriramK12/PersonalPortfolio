'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { DashboardIcon, Logo, MailIcon, ProfileIcon, ProjectIcon, RouteIcon, SegmentIcon } from './Icons';

const links = [
  { label: 'Home', href: '/', Icon: DashboardIcon },
  { label: 'Projects', href: '/projects/', Icon: ProjectIcon },
  { label: 'Experience', href: '/experience/', Icon: SegmentIcon },
  { label: 'Activities', href: '/activities/', Icon: RouteIcon },
  { label: 'Profile', href: '/profile/', Icon: ProfileIcon },
];

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

export default function Navigation() {
  const pathname = usePathname();
  const indicator = { type: 'spring', stiffness: 420, damping: 34 } as const;

  return (
    <>
      <motion.header
        className="topbar"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.1 }}
      >
        <Link className="brand" href="/" aria-label="Sriram Kakumanu, home">
          <Logo />
          <span>sriram</span>
        </Link>
        <nav className="topnav" aria-label="Main navigation">
          {links.map(({ label, href }) => {
            const current = isCurrent(pathname, href);
            return (
              <Link key={href} href={href} aria-current={current ? 'page' : undefined}>
                {label}
                {current && <motion.span className="topnav-bar" layoutId="topnav-bar" transition={indicator} />}
              </Link>
            );
          })}
        </nav>
        <Link className="follow-button" href="/profile/#contact">
          <MailIcon width={17} height={17} />
          Contact
        </Link>
      </motion.header>

      <nav className="tabbar" aria-label="Main navigation">
        {links.map(({ label, href, Icon }) => {
          const current = isCurrent(pathname, href);
          return (
            <Link key={href} href={href} aria-current={current ? 'page' : undefined}>
              {current && <motion.span className="tabbar-pill" layoutId="tabbar-pill" transition={indicator} />}
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

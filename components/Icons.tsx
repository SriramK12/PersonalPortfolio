// Inline icon set. All icons inherit currentColor and are hidden from assistive tech.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({ width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...props });

export const DashboardIcon = (p: P) => <svg {...base(p)}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M10 19.5V14h4v5.5" /></svg>;
export const ProjectIcon = (p: P) => <svg {...base(p)}><rect x="3.5" y="7" width="17" height="12.5" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" /></svg>;
export const PlaneIcon = (p: P) => <svg {...base(p)}><path d="M21 15.5v-2l-8-5V3.8a1.5 1.5 0 0 0-3 0v4.7l-8 5v2l8-2.5v4.8l-2.2 1.7V21l3.7-1 3.7 1v-1.5L13 17.8V13z" /></svg>;
export const SegmentIcon = (p: P) => <svg {...base(p)}><path d="M4 18c3-1 4-6 8-6s5 4 8 3" /><circle cx="4" cy="18" r="1.6" fill="currentColor" /><circle cx="20" cy="15" r="1.6" fill="currentColor" /></svg>;
export const RouteIcon = (p: P) => <svg {...base(p)}><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8" /></svg>;
export const ProfileIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c1.2-3.7 4-5.5 7.5-5.5s6.3 1.8 7.5 5.5" /></svg>;
export const KudosIcon = (p: P) => <svg {...base(p)}><path d="M7 21V10l4.5-7c1.6 0 2.5 1.2 2.1 2.8L12.8 9H19a2 2 0 0 1 2 2.3l-1.2 7.4A2.7 2.7 0 0 1 17.2 21H7Z" /><path d="M7 10H3.5v11H7" /></svg>;
export const ArrowIcon = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const BackIcon = (p: P) => <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
export const ExternalIcon = (p: P) => <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>;
export const PinIcon = (p: P) => <svg {...base(p)}><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>;
export const CheckIcon = (p: P) => <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
export const StopIcon = (p: P) => <svg {...base(p)}><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none" /></svg>;
export const GpsIcon = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="7.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" /></svg>;
export const GearIcon = (p: P) => <svg {...base(p)}><path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" /><path d="M7 9.5V14c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9.5" /><path d="M20 7.5V13" /></svg>;
export const ClubIcon = (p: P) => <svg {...base(p)}><circle cx="8" cy="9" r="3" /><circle cx="16.5" cy="9.5" r="2.5" /><path d="M2.5 19c.8-3 2.9-4.5 5.5-4.5s4.7 1.5 5.5 4.5M14 14.6c.8-.4 1.6-.6 2.5-.6 2.3 0 4 1.3 4.7 4" /></svg>;
export const TrophyIcon = (p: P) => <svg {...base(p)}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4v3h-4z" /></svg>;
export const GithubIcon = (p: P) => <svg {...base(p)}><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>;
export const MailIcon = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6 8.5 7 8.5-7" /></svg>;
export const LinkedinIcon = (p: P) => <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-1.7 1.1-3 2.7-3s2.3 1.1 2.3 3V17" /></svg>;
export const FileIcon = (p: P) => <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;

/** The site mark: a short orange route with a start point. */
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--orange)" />
      <path d="M9 23.5c4.5 0 4-6.5 7.5-6.5S19 22 23 22M9.5 10c3.5 0 4.5 4.5 8.5 4.5 2.4 0 3.4-1.7 5-4.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="9.5" cy="10" r="2.4" fill="#fff" />
    </svg>
  );
}

import { profile } from '@/content/site';

/** Round profile photo with an orange progress ring that draws itself in. */
export default function Avatar({ size = 64, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <span className={`avatar${ring ? ' has-ring' : ''}`} style={{ width: size, height: size }}>
      {/* A plain img keeps the static export simple; the file is already a small 480px JPEG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}${profile.avatar}`} alt={profile.name} width={size} height={size} />
      {ring && (
        <svg className="avatar-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="48" pathLength="1" />
        </svg>
      )}
    </span>
  );
}

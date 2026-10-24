import FlightDeck from '@/components/home/FlightDeck';
import { destinations, profile } from '@/content/site';

export default function Home() {
  // The plane starts at home (Frisco) on a first visit, then wherever it last landed.
  return <FlightDeck name={profile.name} roles={profile.roles} destinations={destinations} home="profile" />;
}

import Link from 'next/link'

export default function Home() {
  return (
    <main>
    <h1>Hello how are you</h1>
    <Link href = "/profile">Profile</Link>
    </main>
  );
}

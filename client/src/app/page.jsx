import Link from "next/link";
import Nav from "@/components/navbar/nav";

export default function Home() {
  return (
    <main>
      <h1>Hello how are you</h1>
      <Link href="/profile">Profile</Link>
      <Nav />
    </main>
  );
}

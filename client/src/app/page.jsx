import Link from "next/link";

export default function Home() {
  return (
    <>
        <div>
          <video
            className="h-full w-full object-cover"
            src="/cake.mp4"
            type="video/mp4"
            autoPlay
            muted
            loop
          ></video>
        </div>
    </>
  );
}

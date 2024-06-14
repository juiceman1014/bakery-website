import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <video
          className="h-full"
          src="/cake.mp4"
          type="video/mp4"
          width="600"
          height="400"
          controls
        ></video>
      </div>
    </>
  );
}

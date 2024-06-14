import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col">
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
      </div>
    </>
  );
}

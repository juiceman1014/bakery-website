import Link from "next/link";

export default function Home() {
  return (
    <>
      <container className="flex flex-col">
        <div className = "flex flex-row justify-end">
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
            <Link href="#about">About</Link>
          </button>
          <button className="hover:bg-orange-200 p-2 rounded-md text-sm font-medium">
          <Link href="#contact">Contact</Link>
          </button>
        </div>
        <video
          className="flex h-full w-full object-cover"
          src="/cake.mp4"
          type="video/mp4"
          autoPlay
          muted
          loop
        ></video>
        <about id="about" className="flex flex-row mt-10">
          <img src="/Baker.jpg" />
          <div className="flex flex-col justify-center w-full">
            <h1 className="font-bold text-center">About</h1>
            <p className="mt-10 ml-5">
              Hello Im Bin
            </p>
          </div>
        </about>

        <contact id = "contact" className = "my-10 flex flex-row">
          <div>
            <h1 className="font-bold text-center">Contact Information</h1>
          </div>
          <div className = "ml-[10%]">
            <h1>Email Address: emailname@gmail.com</h1>
            <h1>Phone Number: 408-123-4567</h1>
          </div>
        </contact>
      </container>
    </>
  );
}

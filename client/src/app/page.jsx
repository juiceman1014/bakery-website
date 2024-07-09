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
            Contact
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
              voluptatum laborum numquam blanditiis harum quisquam eius sed odit
              fugiat iusto fuga praesentium optio, eaque rerum! Provident
              similique accusantium nemo autem. Veritatis obcaecati tenetur iure
              eius earum ut molestias architecto voluptate aliquam nihil,
              eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
              tenetur error, harum nesciunt ipsum debitis quas aliquid.
              Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa
              laudantium molestias eos sapiente officiis modi at sunt excepturi
              expedita sint? Sed quibusdam recusandae alias error harum maxime
              adipisci amet laborum. Perspiciatis minima nesciunt dolorem!
              Officiis iure rerum voluptates a cumque velit quibusdam sed amet
              tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat,
              temporibus enim commodi iusto libero magni deleniti quod quam
              consequuntur! Commodi minima excepturi repudiandae velit hic
              maxime doloremque. Quaerat provident commodi consectetur veniam
              similique ad earum omnis ipsum saepe, voluptas, hic voluptates
              pariatur est explicabo fugiat, dolorum eligendi quam cupiditate
              excepturi mollitia maiores labore suscipit quas? Nulla, placeat.
              Voluptatem quaerat non architecto ab laudantium modi minima sunt
              esse temporibus sint culpa, recusandae aliquam numquam totam
              ratione voluptas quod exercitationem fuga. Possimus quis earum
              veniam quasi aliquam eligendi, placeat qui corporis!
            </p>
          </div>
        </about>

        <contact className = "my-10 flex flex-row">
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

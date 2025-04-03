export default function Home() {
  return (
    <div className="flex flex-col bg-orange-50">
      {/* Hero Section with Video */}
      <div className="relative w-full h-screen">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/cake.mp4"
          autoPlay
          muted
          loop
        ></video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-5xl font-bold">Welcome to Uyen's Bakery</h1>
          <p className="mt-4 text-lg">
            Delicious cakes and pastries made with love.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="flex flex-col md:flex-row items-center justify-center my-20 px-6"
      >
        <img
          src="/Baker.jpg"
          className="w-60 h-60 rounded-lg shadow-lg object-cover"
        />
        <div className="md:ml-10 text-center md:text-left mt-6 md:mt-0">
          <h1 className="text-3xl font-bold">About</h1>
          <p className="mt-4 text-lg max-w-lg">
            Hello, I'm Uyen! I love baking and creating delightful treats for
            every occasion.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="my-20 px-6 text-center">
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <div className="mt-4 text-lg">
          <p>
            Email:{" "}
            <a
              href="mailto:aunty4bakery@gmail.com"
              className="text-orange-600 hover:underline"
            >
              aunty4bakery@gmail.com
            </a>
          </p>
          <p>
            Phone: <span className="text-orange-600">669 250-4285</span>
          </p>
        </div>
      </div>
    </div>
  );
}

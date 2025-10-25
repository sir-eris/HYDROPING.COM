import Image from "next/image";


export default function Home() {
  return (
    <div className="relative">
      <main className="min-h-screen flex items-center justify-center py-24 pb-48">
        {/* center headline */}
        <div className="text-center">
          {/* headline */}
          <div className="w-fit mx-auto text-center bg-white/15 backdrop-blur-xs rounded-2xl border border-white/5">
            <h2 className="text-5xl md:text-7xl font-black py-2">Smart.</h2>
            <h2 className="text-5xl md:text-7xl font-black py-2">Reliable.</h2>
            <h2 className="text-5xl md:text-7xl font-black py-2">Affordable.</h2>
          </div>

          <br />
          <br />
          <br />

          {/* sub headline */}
          <h1 className="font-bold text-xl md:text-3xl w-3/5 mx-auto bg-white/15 backdrop-blur-xs rounded-2xl border border-white/5">A soil moisture stick that tells exactly when your plant needs water.</h1>

          <br />
          <br />
          <br />

          {/* summary info */}
          <div className="flex flex-col md:flex-row justify-around w-4/5 mx-auto px-4 font-medium bg-white/15 backdrop-blur-xs rounded-4xl border border-white/5 shadow/5">
            <h3 className="mb-4 py-6 border-b w-fit mx-auto px-4 border-gray-300 md:m-0 md:border-0 md:px-0">Invisibly Small</h3>
            <div className="hidden md:block h-6 w-[1px] rounded-full bg-gray-600 mt-6"></div>
            <h3 className="mb-4 py-6 border-b w-fit mx-auto px-4 border-gray-300 md:m-0 md:border-0 md:px-0">Lasts 5+ Years</h3>
            <div className="hidden md:block h-6 w-[1px] rounded-full bg-gray-600 mt-6"></div>
            <h3 className="mb-4 py-6 border-b w-fit mx-auto px-4 border-gray-300 md:m-0 md:border-0 md:px-0">Indoor and Outdoor Pots</h3>
            <div className="hidden md:block h-6 w-[1px] rounded-full bg-gray-600 mt-6"></div>
            <h3 className="mb-4 py-6 border-b w-fit mx-auto px-4 border-gray-300 md:m-0 md:border-0 md:px-0">Wi-Fi Chip Included</h3>
          </div>

          <br />
          <br />
          <br />
          <br />
          
          {/* pre-order box */}
          <div className="w-fit mx-auto bg-white/15 backdrop-blur-xs rounded-2xl border border-white/5">
            <div className="flex justify-center w-fit mx-auto text-blue-400 text-xl font-bold mb-6 gap-x-12">
              {/* <h3 className="underline underline-offset-8 hover:no-underline"><Link href="/about">Watch Ad</Link></h3> */}
              <a href="/order" className="underline underline-offset-8 hover:no-underline">Order Yours</a>
            </div>
            <div className="">
              <p className="text-xs text-gray-600 text-center">1.5% contributed to removing CO₂ from atmosphere.</p>
              <p className="text-xs text-gray-600 text-center">Free shipping and return. Cancel for free.</p>
              <p className="text-xs text-gray-600 text-center">U.S. only. Ships every 5000 orders.</p>
              <p className="text-xs text-gray-600 text-center"><a href="/terms" className="underline underline-offset-2 hover:no-underline">Terms & Conditions</a> apply.</p>
            </div>
          </div>
        </div>
      </main>

      {/* background graphics */}
      <div className="fixed top-0 left-0 w-screen min-h-screen -z-50">
        <Image
          src="/orange.png"
          alt="HydroPing orange colored soil moisture stick"
          width={500}
          height={200}
          className="absolute left-0 md:left-1/6 top-6"
      />
        <Image
          src="/okay.png"
          alt="HydroPing reference image 1"
          width={200}
          height={270}
          className="absolute left-12 top-1/4 -rotate-6"
      />
      <Image
          src="/chart.png"
          alt="HydroPing reference image 2"
          width={400}
          height={300}
          className="absolute left-0 md:left-1/12 bottom-1/6 rotate-6 rounded-4xl p-2 border-[1px] border-gray-300 shadow-xl shadow-gray-400/15"
      />
      <Image
          src="/soil.png"
          alt="HydroPing reference image 3"
          width={150}
          height={150}
          className="absolute right-0 md:right-1/4 top-1/12"
      />
        <Image
          src="/green.png"
          alt="HydroPing green colored soil moisture stick"
          width={600}
          height={500}
          className="absolute bottom-0 right-1/12"
      />
      <Image
          src="/black.png"
          alt="HydroPing black colored soil moisture stick"
          width={300}
          height={300}
          className="absolute top-0 right-6 -rotate-45"
      />
       <Image
          src="/blured_gray.png"
          alt="HydroPing reference image 4"
          width={100}
          height={100}
          className="absolute -bottom-10 left-1/3"
      />
      <Image
          src="/dry.png"
          alt="HydroPing reference image 5"
          width={170}
          height={100}
          className="absolute right-0 md:right-1/12 top-1/3 rotate-[15deg]"
      />
      </div>
    </div>
  );
}

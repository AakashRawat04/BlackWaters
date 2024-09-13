// export default function Home() {
// 	return (
// 		<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#1a1a1a] text-[#e0e0e0]">
// 			<h1 className="text-6xl font-bold mb-4 text-[#1E3A8A]">Black Waters</h1>
// 			<p className="text-xl text-center">
// 				The Realtime Telemetry Monitoring System You Love
// 			</p>
// 		</main>
// 	);
// }
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black w-full h-screen flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-6xl font-bold">
          <span className="text-[#b1ff00]">Black</span>{" "}
          <span className="text-gray-400">Water</span>
        </h1>
        <Image
          src="/assets/makhi_real.png" // Update to use the correct path from the public folder
          alt="Black Water Asset"
          width={150}
          height={150}
          className="object-contain"
        />
        <svg
          className="w-16 h-16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          
        </svg>
      </div>
    </div>
  )
}


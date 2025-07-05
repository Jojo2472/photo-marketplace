'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-purple-100 text-center px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">Welcome to Peakabooo</h1>
      <p className="mb-6">
        <span className="font-bold text-green-700">🦶 Buyers:</span> If you love feet, this is where you want to be!<br />
        <span className="font-bold text-purple-700">💅 Sellers:</span> Do you have pretty feet? Make money selling pictures of them — 
        you can remain <span className="italic">100% anonymous</span>!
      </p>

      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        <Link href="/register?role=buyer">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
            Register as Buyer
          </button>
        </Link>
        <Link href="/register?role=seller">
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
            Register as Seller
          </button>
        </Link>
        <Link href="/login">
          <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded hover:bg-purple-100 transition">
            Login
          </button>
        </Link>
      </div>

      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        <Image
          src="https://res.cloudinary.com/di1vhws6f/image/upload/e_blur:800,c_fill,l_text:Arial_40_bold:No%20Refunds,co_white,g_south,y_30,w_1000/v1751665553/02-get-healthy-pretty-summer-feet-bold-colors_ypaexb.jpg"
          alt="Blurred foot model preview"
          width={300}
          height={300}
          className="rounded-xl shadow"
        />
        <Image
          src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
          alt="Demo image 2"
          width={300}
          height={300}
          className="rounded-xl shadow"
        />
        <Image
          src="https://res.cloudinary.com/demo/image/upload/sample.jpg"
          alt="Demo image 3"
          width={300}
          height={300}
          className="rounded-xl shadow"
        />
      </div>

      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Featured Creators</h2>
      <div className="flex justify-center gap-6 mb-10 flex-wrap">
        {['User1', 'User2', 'User3', 'User4'].map((user, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow w-32">
            <div className="w-16 h-16 rounded-full bg-purple-200 mx-auto mb-2" />
            <p className="font-semibold text-sm">{user}</p>
            <p className="text-xs text-gray-500">Top Seller</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-purple-700">How It Works</h2>
      <p className="text-sm text-gray-600 mt-2">
        Buy and sell high-quality foot pictures securely and anonymously.
      </p>
    </main>
  );
}

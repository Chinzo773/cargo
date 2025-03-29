import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-400 py-16 flex flex-col items-center w-full absolute bottom-0 h-[250px]">
      <div className="flex justify-between w-full max-w-6xl px-8">
        <div className="text-left">
          <h2 className="text-lg font-semibold flex items-center text-white">
            <span className="mr-2">🧊</span>A&N
          </h2>
          <p className="text-sm mt-2">
            Энэ хотоос Эрдэнэт хот хүргэлт ачаа тээврийн үйлчилгээ
          </p>
          <p className="text-xs mt-4">© 2025 A&N</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-semibold flex items-center justify-end text-white">
            <span className="mr-2">❤️</span>
          </h2>
          <ul className="text-sm mt-2 space-y-2 flex flex-col">
            <li>
              <Link href="/">Эхлэл</Link>
            </li>
            <li>
              <a href="/tootsooluur">Тооцоолуур</a>
            </li>
            <li>
              <a href="/instructions.php">Заавар</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-xs mt-6 flex space-x-6">
        <a href="#" className="underline">
          Terms and conditions
        </a>
        <a href="#" className="underline">
          Privacy policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="whiteheader flex-column bg-white shadow-md">
      <nav className="flexrow">
        <div className="nav-logo">
          <Link href={"/"}>
            <img src="/images/logo.png"/>
          </Link>
        </div>
        <div className="flexrow">
          <Link href={"/personal-Info"}>
            <div className="nav-item font-medium">Хувийн мэдээлэл</div>
          </Link>
          <Link href={"/ilgeemj"}>
            <div className="nav-item font-medium">Илгээмж/Хүргэлт</div>
          </Link>
          <div className="flex gap-1.5 font-medium">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>
    </div>
  );
}

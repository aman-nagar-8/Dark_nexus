import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/login"></Link>
      <Link href="/signup"></Link>
      <Link href="/home"></Link>
    </>
  );
}

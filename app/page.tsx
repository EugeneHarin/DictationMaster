import DictationmasterLogo from '@/app/ui/dictation-master-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from "next/image";

import heroImageDesktop from '../public/hero-desktop.png';
import heroImageMobile from '../public/hero-mobile.png';
import heroImage from '../public/hero-image.png';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-[5.3125rem] shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <div className="container">
          <DictationmasterLogo />
        </div>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row container">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div
            className="h-0 w-0 border-b-[30px] border-l-[20px] border-r-[20px] border-b-black border-l-transparent border-r-transparent"
          />
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Dictation Master!</strong>
          </p>
          <p>At Dictation Master, we believe in the power of words and the magic of learning. Our platform bridges the gap between students&apos; aspirations and linguistic proficiency. Here, students can immerse themselves in a world of dictations meticulously crafted by expert teachers. Our <strong>cutting-edge algorithms and AI tools</strong> analyze each submission, offering personalized feedback and guidance tailored to each student&apos;s unique learning path.</p>
          <p>Whether you&apos;re a student eager to refine your language skills or a teacher passionate about shaping the future of education, you&apos;ve found your haven. Dictation Master is more than a learning platform; it&apos;s a community dedicated to the art of language and the pursuit of excellence.</p>
          <p><strong>Join us</strong>, and transform the way you learn, one word at a time!</p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src={heroImage}
            width={1000}
            height={760}
            className='hidden md:block rounded-2xl'
            alt="Screenshots of the dashboard project showing desktop version"
            placeholder="blur"
          />
          <Image
            src={heroImage}
            placeholder="blur"
            width={560}
            height={620}
            className='block md:hidden rounded-2xl'
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}

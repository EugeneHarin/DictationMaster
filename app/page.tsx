import DictationmasterLogo from '@/app/ui/dictation-master-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from "next/image";
import heroImage from '../public/hero-image.png';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-[5.3125rem] shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <div className="max-w-5xl w-full mx-auto">
          <DictationmasterLogo />
        </div>
      </div>
      <div className="mt-4 container rounded-lg bg-gray-50 px-6 py-10 lg:px-20">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          <h1 className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Dictation Master! </strong>
          </h1>
          <p>This is the innovative web application designed to revolutionize language learning for both <strong>teachers and students</strong>. At DictationMaster, we blend cutting-edge technology with educational best practices to offer a unique and interactive learning experience.</p>
          <div className="flex gap-6 [&_p]:mt-2 md:[&_p]:mt-1 md:[&_p]:indent-5 flex-wrap">
            <div className="w-full lg:w-[calc(50%-1.5rem)]">
              <h2 className="text-lg text-gray-800 font-bold md:text-xl">For Teachers:</h2>
              <p>DictationMaster empowers teachers to create and manage dictations in <strong>Ukrainian and English</strong> languages.</p>
              <p>Our platform utilizes <strong>Google Cloud Text-to-Speech AI</strong> to transform your dictations into clear, understandable speech, stored securely in <strong>Google Cloud Storage</strong> for repeated use.</p>
              <p>Customize the learning experience with <strong>adjustable reading speeds</strong> to suit your students&apos; needs. Our dynamic table interface allows you to easily create, update, remove, and view available dictations.</p>
              <p>Plus, gain insights into your <strong>students&apos; progress</strong> on the Results page, where you can sort and analyze results by name or score.</p>
            </div>
            <div className="w-full lg:w-[calc(50%-1.5rem)]">
              <h2 className="text-lg text-gray-800 font-bold md:text-xl">For Students:</h2>
              <p>As a student on DictationMaster, you&apos;ll engage in an <strong>immersive dictation experience</strong>. Choose a dictation and get a brief overview before diving in.</p>
              <p>Our <strong>AI-generated dictation audio</strong> will guide you through the exercise, repeating each sentence several times for optimal learning.</p>
              <p>After completing a dictation, visit the Results page to view your personal performance, where your work is evaluated using <strong>Google&apos;s advanced Diff algorithm</strong> for accurate and detailed feedback.</p>
            </div>
            <div className="order-first lg:order-none w-full lg:w-[calc(50%-1.5rem)]">
              <div className="flex items-center justify-center">
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
            <div className="w-full lg:w-[calc(50%-1.5rem)]">
              <h2 className="text-lg text-gray-800 font-bold md:text-xl">AI-Enhanced Feedback:</h2>
              <p>DictationMaster is at the forefront of AI in education. For English dictations, our <strong>AI Review feature</strong>, powered by <strong>Google Vertex AI</strong> and the <strong>PaLM 2</strong> foundation model, offers in-depth analysis of your errors.</p>
              <p>This cutting-edge technology not only highlights mistakes but also <strong>provides tailored advice for improvement</strong>, making learning more effective and personalized.</p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-4 flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Enter Your Classroom</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}

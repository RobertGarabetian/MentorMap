import { AuthTabs } from "@/components/auth/AuthTabs";

export default function Home() {
  return (
    <main className="grid grid-cols-1 grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 w-screen min-h-screen">
      <div className="row-span-1 col-span-1 flex flex-col items-center justify-center">
        <h2 className="text-4xl relative z-20 md:text-5xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">MentorMap</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className="">MentorMap</span>
            </div>
          </div>
        </h2>
        <p className="text-xs relative z-20 md:text-sm lg:text-xl font-bold text-center">
          Helping community college students <br />
          find career and transfer advice
        </p>
      </div>
      <div className="row-span-1 col-span-1 flex flex-col items-center justify-center">
        <AuthTabs />
      </div>
    </main>
  );
}

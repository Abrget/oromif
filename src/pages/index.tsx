import { type NextPage } from "next";
import Link from "next/link";
import { GlobeSvg } from "~/components/Svgs";
import React from "react";
import { LanguageHeader } from "~/components/LanguageHeader";
import { useLoginScreen, LoginScreen } from "~/components/LoginScreen";
import { LanguageCarousel } from "~/components/LanguageCarousel";
import { useTranslation } from "~/hooks/useTranslation";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useEffect} from "react";
import { useRouter } from "next/router";


const Home: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();
  const t = useTranslation();
  const username = useBoundStore((x) => x.username);
  const router = useRouter();
  useEffect(() => {
    if(username!==null){
      void router.push("/learn");
    }
  }, [username, router]);
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-transparent text-white bg-[url('/newphone.png')] md:bg-[url('/neww.png')] bg-cover bg-center"
    >
      <LanguageHeader />
      <div className="flex w-full flex-col items-center  gap-3 px-4 py-16 md:flex-row md:gap-36" style={{justifyContent: "end"}}>
        
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            {t.home.title}
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">

            <Link
              href="/register"
              className="w-full rounded-2xl border-b-4 border-green-700 bg-green-600 px-10 py-3 text-center font-bold uppercase transition hover:border-green-600 hover:bg-green-500 md:min-w-[320px]"
            >
              {t.home.getStarted}
            </Link>
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#042c60] bg-[#235390] px-8 py-3 font-bold uppercase transition hover:bg-[#204b82] md:min-w-[320px]"
              onClick={() => setLoginScreenState("LOGIN")}
            >
              {t.home.haveAccount}
            </button>
          </div>
        </div>
      </div>
      <LanguageCarousel />
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </main>
  );
};

export default Home;

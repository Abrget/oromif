import type { NextPage } from "next";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import {
  BronzeLeagueSvg,
  EditPencilSvg,
  EmptyFireSvg,
  FireSvg,
  LightningProgressSvg,
  EmptyMedalSvg,
  ProfileFriendsSvg,
  ProfileTimeJoinedSvg,
  SettingsGearSvg,
} from "~/components/Svgs";
import Link from "next/link";
import { Flag } from "~/components/Local-Flags";
import { useBoundStore } from "~/hooks/useBoundStore";
import { useEffect, useState } from "react";
import { db } from "~/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useTranslation } from "~/hooks/useTranslation";

const Profile: NextPage = () => {
  return (
    <div>
      <ProfileTopBar />
      <LeftBar selectedTab="Profile" />
      <div className="flex justify-center gap-3 pt-14 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex w-full max-w-4xl flex-col gap-5 p-5">
          <ProfileTopSection />
          <ProfileStatsSection />
          <ProfileFriendsSection />
        </div>
      </div>
      <div className="pt-[90px]"></div>
      <BottomBar selectedTab="Profile" />
    </div>
  );
};

export default Profile;

const ProfileTopBar = () => {
  const t = useTranslation();
  return (
    <div className="fixed left-0 right-0 top-0 flex h-16 items-center justify-between border-b-2 border-gray-200 bg-white px-5 text-xl font-bold text-gray-300 md:hidden">
      <div className="invisible" aria-hidden={true}>
        <SettingsGearSvg />
      </div>
      <span className="text-gray-400">{t.profile.profile}</span>
      <Link href="/settings/account">
        <SettingsGearSvg />
        <span className="sr-only">{t.profile.settings}</span>
      </Link>
    </div>
  );
};

const ProfileTopSection = () => {
  const router = useRouter();
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const name = useBoundStore((x) => x.name);
  const username = useBoundStore((x) => x.username);
  const joinedAt = useBoundStore((x) => x.joinedAt).format("MMMM YYYY");
  const followingCount = 0;
  const followersCount = 0;
  const language = useBoundStore((x) => x.language);
  const t = useTranslation();

  useEffect(() => {
    if (!loggedIn) {
      void router.push("/");
    }
  }, [loggedIn, router]);

  return (
    <section className="flex flex-row-reverse border-b-2 border-gray-200 pb-8 md:flex-row md:gap-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-400 text-3xl font-bold text-gray-400 md:h-44 md:w-44 md:text-7xl">
        {username.charAt(0).toUpperCase()}
      </div>
      <div className="flex grow flex-col justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <div className="text-sm text-gray-400">{username}</div>
          </div>
          <div className="flex items-center gap-3">
            <ProfileTimeJoinedSvg />
            <span className="text-gray-500">{t.profile.joined(joinedAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <ProfileFriendsSvg />
            <span className="text-gray-500">{t.profile.followingFollowers(followingCount, followersCount)}</span>
          </div>
        </div>

        <Flag language={language} width={40} />
      </div>
      <Link
        href="/settings/account"
        className="hidden items-center gap-2 self-start rounded-2xl border-b-4 border-blue-500 bg-blue-400 px-5 py-3 font-bold uppercase text-white transition hover:brightness-110 md:flex"
      >
        <EditPencilSvg />
        {t.profile.editProfile}
      </Link>
    </section>
  );
};

const ProfileStatsSection = () => {
  const t = useTranslation();
  const streak = useBoundStore((x) => x.streak);
  const username = useBoundStore((x) => x.username) || "guest";
  const language = useBoundStore((x) => x.language);

  const [totalXp, setTotalXp] = useState<number>(0);
  const [league, setLeague] = useState<string>("Bronze");
  const [top3Finishes, setTop3Finishes] = useState<number>(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const ref = doc(db, "userProgress", username, language.code);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as {
            xp?: number;
            league?: string;
            top3Finishes?: number;
          };
          setTotalXp(data.xp ?? 0);
          setLeague(data.league ?? "Bronze");
          setTop3Finishes(data.top3Finishes ?? 0);
        } else {
          await setDoc(
            ref,
            { xp: 0, league: "Bronze", top3Finishes: 0, updated_at: Date.now() },
            { merge: true },
          );
          setTotalXp(0);
          setLeague("Bronze");
          setTop3Finishes(0);
        }
      } catch (e) {
        console.error("Failed to load profile stats", e);
      }
    };
    void loadStats();
  }, [username, language.code]);

  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">{t.profile.statistics}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
          {streak === 0 ? <EmptyFireSvg /> : <FireSvg />}
          <div className="flex flex-col">
            <span
              className={[
                "text-xl font-bold",
                streak === 0 ? "text-gray-400" : "",
              ].join(" ")}
            >
              {streak}
            </span>
            <span className="text-sm text-gray-400 md:text-base">{t.profile.dayStreak}</span>
          </div>
        </div>
        <Link className="link-wallet" href="/WalletDashboard">
          <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
            {streak === 0 ? <EmptyFireSvg /> : <FireSvg />}
            <div className="flex flex-col">
              <span
                className={[
                  "text-xl font-bold",
                  streak === 0 ? "text-gray-400" : "",
                ].join(" ")}
              >
                {streak}
              </span>
              <span className="text-sm text-gray-400 md:text-base">{t.profile.balance}</span>
            </div>
          </div>
        </Link>
        <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
          <LightningProgressSvg size={35} />
          <div className="flex flex-col">
            <span className="text-xl font-bold">{totalXp}</span>
            <span className="text-sm text-gray-400 md:text-base">{t.profile.totalXp}</span>
          </div>
        </div>
        <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
          <BronzeLeagueSvg width={25} height={35} />
          <div className="flex flex-col">
            <span className="text-xl font-bold">{league}</span>
            <span className="text-sm text-gray-400 md:text-base">
              {t.profile.currentLeague}
            </span>
          </div>
        </div>
        <div className="flex gap-2 rounded-2xl border-2 border-gray-200 p-2 md:gap-3 md:px-6 md:py-4">
          {top3Finishes === 0 ? <EmptyMedalSvg /> : <EmptyMedalSvg />}
          <div className="flex flex-col">
            <span
              className={[
                "text-xl font-bold",
                top3Finishes === 0 ? "text-gray-400" : "",
              ].join(" ")}
            >
              {top3Finishes}
            </span>
            <span className="text-sm text-gray-400 md:text-base">{t.profile.top3Finishes}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProfileFriendsSection = () => {
  const [state, setState] = useState<"FOLLOWING" | "FOLLOWERS">("FOLLOWING");
  const t = useTranslation();
  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold">{t.profile.friends}</h2>
      <div className="rounded-2xl border-2 border-gray-200">
        <div className="flex">
          <button
            className={[
              "flex w-1/2 items-center justify-center border-b-2 py-3 font-bold uppercase hover:border-blue-400 hover:text-blue-400",
              state === "FOLLOWING"
                ? "border-blue-400 text-blue-400"
                : "border-gray-200 text-gray-400",
            ].join(" ")}
            onClick={() => setState("FOLLOWING")}
          >
            {t.profile.following}
          </button>
          <button
            className={[
              "flex w-1/2 items-center justify-center border-b-2 py-3 font-bold uppercase hover:border-blue-400 hover:text-blue-400",
              state === "FOLLOWERS"
                ? "border-blue-400 text-blue-400"
                : "border-gray-200 text-gray-400",
            ].join(" ")}
            onClick={() => setState("FOLLOWERS")}
          >
            {t.profile.followers}
          </button>
        </div>
        <div className="flex items-center justify-center py-10 text-center text-gray-500">
          {state === "FOLLOWING" ? t.profile.notFollowingYet : t.profile.noFollowersYet}
        </div>
      </div>
    </section>
  );
};

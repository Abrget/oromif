import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { db } from "~/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LeftBar } from "~/components/LeftBar";
import { RightBar } from "~/components/RightBar";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";
import { UpArrowSvg } from "~/components/Svgs";

type GuidebookUnit = {
  unitNumber: number;
  description: string;
  backgroundColor: `bg-${string}`;
  textColor: `text-${string}`;
  borderColor: `border-${string}`;
  keyPhrases?: Array<{ phrase: string; translation: string }>;
};

const GuidebookPage: NextPage = () => {
  const router = useRouter();
  const unitParam = router.query.unit as string | undefined;
  const unitId = useMemo(() => (unitParam ? String(unitParam) : undefined), [unitParam]);

  const [unit, setUnit] = useState<GuidebookUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) return;
    const run = async () => {
      try {
        const ref = doc(db, "units", unitId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUnit(snap.data() as GuidebookUnit);
        }
      } catch (e) {
        console.error("Failed to load unit", e);
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [unitId]);

  const phrases = useMemo(() => {
    if (unit?.keyPhrases && unit.keyPhrases.length > 0) return unit.keyPhrases;
    // Fallback demo content if keyPhrases not provided in Firestore
    return [
      { phrase: "Un niño come manzanas.", translation: "A boy eats apples." },
      { phrase: "Una niña bebe agua.", translation: "A girl drinks water." },
      { phrase: "La mujer bebe leche.", translation: "The woman drinks milk." },
      { phrase: "El hombre come pan.", translation: "The man eats bread." },
    ];
  }, [unit]);

  // Top bar colors fallback
  const topBarColors = unit
    ? { backgroundColor: unit.backgroundColor, borderColor: unit.borderColor }
    : { backgroundColor: "bg-[#58cc02]" as const, borderColor: "border-[#46a302]" as const };

  return (
    <>
      <TopBar backgroundColor={topBarColors.backgroundColor} borderColor={topBarColors.borderColor} />
      <LeftBar selectedTab="Learn" />
      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex max-w-2xl grow flex-col">
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <button className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800" onClick={() => router.push("/learn")}> 
              <span className="sr-only">Back</span>
              <UpArrowSvg />
              <span className="-rotate-90">Back</span>
            </button>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading guidebook…</div>
            ) : !unit ? (
              <div className="p-8 text-center text-gray-500">Unit not found</div>
            ) : (
              <>
                <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <div className={["flex h-14 w-14 items-center justify-center rounded-full text-white", unit.backgroundColor].join(" ")}>📘</div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Unit {unit.unitNumber} Guidebook</h1>
                    <p className="text-gray-600">Explore grammar tips and key phrases for this unit</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="pb-2 text-xs font-bold uppercase tracking-wide text-blue-600">Key Phrases</div>
                  <h2 className="mb-4 text-lg font-semibold">{unit.description}</h2>
                  <ul className="flex flex-col gap-3">
                    {phrases.map((p, i) => (
                      <li key={i} className="rounded-xl border border-gray-300 bg-white p-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">🔊</div>
                          <div className="flex flex-col">
                            <div className="font-semibold text-blue-700">{p.phrase}</div>
                            <div className="text-sm text-gray-500">{p.translation}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
        <RightBar />
      </div>
      <div className="pt-[90px]"></div>
      <BottomBar selectedTab="Learn" />
    </>
  );
};

export default GuidebookPage;

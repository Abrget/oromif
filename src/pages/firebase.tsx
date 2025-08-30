import { useState } from "react";
import { app, rtdb } from "~/lib/firebase";
import { ref, get, set, child, } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";

type AnyQuestion = Record<string, any>;

const FirebaseUploader = () => {
  const [jsonText, setJsonText] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const getNextId = async (): Promise<number> => {
    const baseRef = ref(rtdb, "lessons/or/questions/1/1");
    const snap = await get(baseRef);
    if (!snap.exists()) return 1;
    const val = snap.val() as Record<string, unknown>;
    let maxId = 0;
    for (const key of Object.keys(val)) {
      const n = parseInt(key, 10);
      if (!Number.isNaN(n) && n > maxId) maxId = n;
    }
    return maxId + 1;
  };

  const handleMigrateUnits = async () => {
    try {
      setStatus("Fetching units from Firestore…");
      const fs = getFirestore(app);
      const snap = await getDocs(collection(fs, "units"));
      const units = snap.docs.map((d) => d.data());
      setStatus(`Fetched ${units.length} unit(s). Writing to RTDB…`);
      await set(ref(rtdb, "units"), units);
      setStatus(`Done. Migrated ${units.length} unit(s) to RTDB.`);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  };

  const handleUpload = async () => {
    try {
      setStatus("Parsing JSON…");
      const parsed = JSON.parse(jsonText) as AnyQuestion[] | AnyQuestion;

      const items: AnyQuestion[] = Array.isArray(parsed) ? parsed : [parsed];

      setStatus("Computing next ID…");
      let nextId = await getNextId();

      setStatus(`Uploading ${items.length} item(s)…`);
      const baseRef = ref(rtdb, "lessons/or/questions/1/1");

      for (const item of items) {
        const idStr = String(nextId++);
        await set(child(baseRef, idStr), {
          ...item,
          // You can store the id field if you want:
          // id: idStr,
          uploaded_at: Date.now(),
        });
      }
      setStatus(`Done. Uploaded ${items.length} item(s).`);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e?.message || String(e)}`);
    }
  };

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl font-bold">Questions Upload (Oromo)</h1>
      <p className="mb-2 text-sm text-gray-500">
        Paste a JSON object or array of question objects below, then click Upload.
      </p>
      <textarea
        className="w-full min-h-[240px] rounded border p-2 font-mono"
        placeholder='Example: [{"type":"SELECT_1_OF_3","question":"...","answers":[...],"correctAnswer":0}]'
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
          onClick={handleUpload}
        >
          Upload
        </button>
        <button
          className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500"
          onClick={handleMigrateUnits}
        >
          Migrate Units (Firestore ➜ RTDB)
        </button>
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </main>
  );
};

export default FirebaseUploader;
import { useState } from "react";
import { db } from "~/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";

type AnyQuestion = Record<string, any>;

const FirebaseUploader = () => {
  const [jsonText, setJsonText] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const getNextId = async (): Promise<number> => {
    const colRef = collection(db, "lessons", "am", "questions");
    const snap = await getDocs(query(colRef));
    let maxId = 0;
    snap.forEach((d) => {
      const n = parseInt(d.id, 10);
      if (!isNaN(n) && n > maxId) maxId = n;
    });
    return maxId + 1;
  };

  const handleUpload = async () => {
    try {
      setStatus("Parsing JSON…");
      const parsed = JSON.parse(jsonText) as AnyQuestion[] | AnyQuestion;

      const items: AnyQuestion[] = Array.isArray(parsed) ? parsed : [parsed];

      setStatus("Computing next ID…");
      let nextId = await getNextId();

      setStatus(`Uploading ${items.length} item(s)…`);
      const colRef = collection(db, "lessons", "am", "questions");

      for (const item of items) {
        const idStr = String(nextId++);
        await setDoc(doc(colRef, idStr), {
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
        <span className="text-sm text-gray-600">{status}</span>
      </div>
    </main>
  );
};

export default FirebaseUploader;
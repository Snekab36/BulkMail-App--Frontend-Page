import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [emailList, setEmailList] = useState([]);
  const [status, setStatus] = useState(false);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: "A" });
      setEmailList(rows.map(r => r.A).filter(Boolean));
    };
    reader.readAsBinaryString(file);
  }

  async function sendEmails() {
    if (!subject || !msg || emailList.length === 0) {
      alert("All fields required");
      return;
    }

    setStatus(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/sendemail`,
        { subject, msg, emailList }
      );
      alert(res.data.success ? "Emails Sent!" : "Failed");
    } catch {
      alert("Server error");
    }
    setStatus(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-6">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-3xl space-y-4">

        <h1 className="text-3xl font-bold text-white text-center">
          Bulk Mail Sender
        </h1>

        <input
          placeholder="Email Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <textarea
          placeholder="Email Body"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="w-full h-32 p-3 rounded bg-slate-700 text-white"
        />

        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFile}
          className="text-white"
        />

        <p className="text-slate-400">
          Emails Loaded: {emailList.length}
        </p>

        <button
          onClick={sendEmails}
          disabled={status}
          className="bg-indigo-600 hover:bg-indigo-500 w-full py-2 rounded text-white font-bold"
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}

export default App;
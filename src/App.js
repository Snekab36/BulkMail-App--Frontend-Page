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
        "https://bulk-mail-app-backend-seven.vercel.app/sendemail",
        { subject, msg, emailList }
      );
      alert(res.data.success ? "Emails Sent!" : "Failed");
    } catch {
      alert("Server error");
    }
    setStatus(false);
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur rounded-2xl shadow-2xl p-8 space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">BulkMail</h1>
          <p className="text-slate-400 mt-2">
            Send personalized bulk emails easily
          </p>
        </div>

        {/* Message Box */}
        <div>
          <label className="text-sm text-slate-300 mb-1 block">
            Email Content
          </label>
          <textarea
            value={msg}
            onChange={handleMsg}
            placeholder="Hi {{name}}, welcome to our service..."
            className="w-full h-36 rounded-xl bg-slate-800 border border-slate-700 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-indigo-500 transition">
          <p className="text-slate-300 text-sm">
            Drag & drop your XLSX file here
          </p>
          <p className="text-xs text-slate-500 mt-1">or</p>
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFile}
            className="mt-3 text-sm text-slate-300 file:bg-slate-700 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-white hover:file:bg-slate-600"
          />
          <p className="text-xs text-slate-500 mt-2">
            Supported formats: .xlsx, .csv
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Stat title="Total Emails" value={emailList.length} />
          <Stat title="Status" value={status ? "Sending..." : "Ready"} />
          <Stat title="File" value={emailList.length ? "Loaded" : "Not uploaded"} />
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={send}
            disabled={status}
            className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold text-white disabled:opacity-50"
          >
            {status ? "Sending..." : "Send Emails"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

export default App;
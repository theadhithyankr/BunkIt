import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const defaultSubjects = [
  { name: "Math", attended: 20, total: 25, color: "#4caf50" },
  { name: "Physics", attended: 18, total: 24, color: "#2196f3" },
];

const App = () => {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("attendance-data");
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [name, setName] = useState("");
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  const [color, setColor] = useState("#673ab7");

  useEffect(() => {
    localStorage.setItem("attendance-data", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!name || total < attended) return;
    setSubjects([...subjects, { name, attended: +attended, total: +total, color }]);
    setName("");
    setAttended(0);
    setTotal(0);
  };

  const removeSubject = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const calculateStatus = (subject) => {
    const percent = (subject.attended / subject.total) * 100;
    const minRequired = Math.ceil((0.75 * subject.total - subject.attended) / 0.25);
    const maxBunkable = Math.floor((subject.attended / 0.75) - subject.total);
    return {
      percent: percent.toFixed(2),
      minRequired: minRequired > 0 ? minRequired : 0,
      maxBunkable: maxBunkable > 0 ? maxBunkable : 0,
    };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(subjects, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-data.json";
    a.click();
  };

  const importData = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const imported = JSON.parse(e.target.result);
      setSubjects(imported);
    };
    fileReader.readAsText(e.target.files[0]);
  };

  const data = {
    labels: subjects.map((s) => s.name),
    datasets: [
      {
        label: "% Attendance",
        data: subjects.map((s) => ((s.attended / s.total) * 100).toFixed(2)),
        backgroundColor: subjects.map((s) => s.color),
      },
    ],
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">BunkIt 📚</h1>

      <div className="grid gap-2 md:grid-cols-2 mb-4">
        <input
          type="text"
          placeholder="Subject"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Attended"
          value={attended}
          onChange={(e) => setAttended(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Total"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          className="border p-2"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2"
        />
      </div>

      <button
        onClick={addSubject}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add Subject
      </button>

      <div className="my-4">
        {subjects.map((subj, idx) => {
          const status = calculateStatus(subj);
          return (
            <div key={idx} className="border my-2 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold" style={{ color: subj.color }}>
                  {subj.name}
                </h2>
                <button
                  onClick={() => removeSubject(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
              <p>Attended: {subj.attended}</p>
              <p>Total: {subj.total}</p>
              <p>Attendance: {status.percent}%</p>
              <p>Classes you can still bunk: {status.maxBunkable}</p>
              <p>Classes you must attend to reach 75%: {status.minRequired}</p>
            </div>
          );
        })}
      </div>

      <div className="my-4">
        <Bar data={data} />
      </div>

      <div className="my-4 flex gap-2 flex-wrap">
        <button
          onClick={exportData}
          className="bg-green-500 text-white p-2 rounded"
        >
          Export Data
        </button>
        <input
          type="file"
          onChange={importData}
          className="border p-2"
        />
      </div>

      <footer className="text-center text-gray-600 mt-8">
        cooked by{" "}
        <a
          href="https://github.com/theadhithyankr"
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          theadhithyankr
        </a>
      </footer>
    </div>
  );
};

export default App;

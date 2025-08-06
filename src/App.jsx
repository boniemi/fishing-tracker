import React, { useState } from "react";

const speciesPoints = {
  "Musky": 300,
  "Lake Sturgeon": 250,
  "Brown Trout": 180,
  "Walleye": 140,
  "Northern Pike": 120,
  "Small/Largemouth": 60,
  "Crappie": 30,
  "Perch": 20,
  "Bluegill/Sunfish": 10,
  "Rock Bass": 5,
  "Other": 5,
};

const anglerNames = ["Austin", "Bo", "Buzz", "Jordan", "Kevin", "Matt", "Nick", "Sam"];

const sizeBonus = (length) => {
  if (length >= 35) return 100;
  if (length >= 30) return 75;
  if (length >= 25) return 50;
  if (length >= 20) return 30;
  if (length >= 15) return 20;
  if (length >= 10) return 10;
  if (length >= 6) return 5;
  return 0;
};

export default function App() {
  const localStorageKey = "fishing-tournament-entries";
  const [entries, setEntries] = useState(() => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [species, setSpecies] = useState("");
  const [length, setLength] = useState("");
  const [angler, setAngler] = useState("");
  const [tab, setTab] = useState("entry");

  const addEntry = () => {
    const base = speciesPoints[species] || 0;
    const bonus = sizeBonus(parseFloat(length));
    const total = base + bonus;
    const updated = [...entries, { angler, species, length, base, bonus, total }];
    setEntries(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setSpecies("");
    setLength("");
  };

  const deleteEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
  };

  const totalScore = (name) =>
    entries.filter((e) => e.angler === name).reduce((sum, e) => sum + e.total, 0);

  const filteredEntries = entries.filter((e) => e.angler === angler);

  return (
    <div>
      <h1>🎣 Fishing Tournament Tracker</h1>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setTab("entry")}>Catch Entry</button>{" "}
        <button onClick={() => setTab("leaderboard")}>Leaderboard</button>
      </div>

      {tab === "entry" && (
        <>
          <select value={angler} onChange={(e) => setAngler(e.target.value)}>
            <option value="">Select Angler</option>
            {anglerNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          {angler && <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>{angler}'s Total Score: {totalScore(angler)}</div>}

          <div style={{ marginTop: "1rem" }}>
            <select value={species} onChange={(e) => setSpecies(e.target.value)}>
              <option value="">Fish Species</option>
              {Object.keys(speciesPoints).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <input
              placeholder="Length (in inches)"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
            <button onClick={addEntry}>Add Catch</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Angler</th>
                <th>Species</th>
                <th>Length</th>
                <th>Base</th>
                <th>Bonus</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.angler}</td>
                  <td>{entry.species}</td>
                  <td>{entry.length}"</td>
                  <td>{entry.base}</td>
                  <td>{entry.bonus}</td>
                  <td>{entry.total}</td>
                  <td><button onClick={() => deleteEntry(idx)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "leaderboard" && (
        <>
          <h2>🏆 Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Angler</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {anglerNames
                .map((name) => ({ name, score: totalScore(name) }))
                .sort((a, b) => b.score - a.score)
                .map(({ name, score }) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
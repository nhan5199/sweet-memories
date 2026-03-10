import { useEffect, useState } from "react";
import MemoryItemCard from "./MemoryItemCard";
import "../styles/memory-timeline.css";

export default function MemoryTimeline({ memories, onMemoryClick }) {
  const [timeline, setTimeline] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [collapsedMonths, setCollapsedMonths] = useState({});

  useEffect(() => {
    if (!memories.length) return;

    const grouped = {};

    memories.forEach((m) => {
      let date;

      if (m.time?.seconds) {
        date = new Date(m.time.seconds * 1000);
      } else if (m.time?.toDate) {
        date = m.time.toDate();
      } else {
        date = new Date(m.time);
      }

      const year = date.getFullYear();
      const month = date.getMonth();

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];

      grouped[year][month].push(m);
    });

    setTimeline(grouped);
  }, [memories]);

  const years = Object.keys(timeline).sort((a, b) => b - a);

  const toggleMonth = (year, month) => {
    const key = `${year}-${month}`;

    setCollapsedMonths((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={`timeline-root ${selectedYear ? "year-open" : ""}`}>

      {/* YEAR SELECTOR */}

      <div className="year-selector">
        {years.map((year) => (
          <div
            key={year}
            className={`year-pill ${selectedYear === year ? "active" : ""}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </div>
        ))}
      </div>

      {/* YEAR VIEW */}

      {selectedYear && (
        <div className="year-view">

          <div className="year-view-header">
            <button
              className="back-button"
              onClick={() => setSelectedYear(null)}
            >
              <span className="material-symbols-outlined">
                arrow_back_ios
              </span>
              Back
            </button>
          </div>

          {Object.keys(timeline[selectedYear])
            .sort((a, b) => b - a)
            .map((month, index) => {

              const key = `${selectedYear}-${month}`;

              const isCollapsed =
                collapsedMonths[key] ?? index === 0; // first month collapsed by default

              const monthName = new Date(
                selectedYear,
                month
              ).toLocaleString("default", { month: "long" });

              const memories = timeline[selectedYear][month];

              return (
                <div key={month} className="month-section">

                  <div
                    className="month-header"
                    onClick={() => toggleMonth(selectedYear, month)}
                  >
                    <h3 className="month-title">
                      {monthName}
                      <span className="month-count">
                        ({memories.length})
                      </span>
                    </h3>

                    <span className="material-symbols-outlined">
                      {isCollapsed ? "expand_more" : "expand_less"}
                    </span>
                  </div>

                  {!isCollapsed && (
                    <div className="memory-grid">
                      {memories.map((memory) => (
                        <MemoryItemCard
                          key={memory.id}
                          memory={memory}
                          onClick={() => onMemoryClick(memory)}
                        />
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
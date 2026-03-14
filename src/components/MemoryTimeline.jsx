import { useEffect, useMemo, useState } from "react";
import { deleteMemory } from "../services/firestoreService";
import "../styles/memory-timeline.css";
import { Loading } from "../utils/Loading.jsx";
import DeleteItem from "./DeleteItemPopup";
import MemoryItemCard from "./MemoryItemCard";

export default function MemoryTimeline({ memories, onMemoryClick }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  //Lấy dữ liệu và tách theo năm -> tháng
  const timeline = useMemo(() => {

    if (!memories) return {};

    const grouped = {};

    memories.forEach((m) => {

      const date = m.time?.toDate ? m.time.toDate() : new Date(m.time);

      const year = date.getFullYear();
      const month = date.getMonth();

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];

      grouped[year][month].push({ ...m, _date: date });
    });

    Object.keys(grouped).forEach((year) => {
      Object.keys(grouped[year]).forEach((month) => {
        grouped[year][month].sort((a, b) => a._date - b._date);
      });
    });

    return grouped;

  }, [memories]);


  //Mỗi lần năm thay đổi thì set lại trạng thái collapse cho Tháng
  useEffect(() => {
    setCollapsedMonths({});

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, [selectedYear]);

  
  const years = useMemo(() => 
    Object.keys(timeline).sort((a,b)=>b-a)
  , [timeline]);

  const toggleMonth = (year, month, currentState) => {
    const key = `${year}-${month}`;

    setCollapsedMonths((prev) => ({
      ...prev,
      [key]: !currentState,
    }));
  };


  // loading khi nhấn vào từng memory
  const handleMemoryClick = (memory) => {
    onMemoryClick(memory);
  };

  //Xóa memory
  const handleDeleteConfirm = async (id) => {
    await deleteMemory(id);

    // const newMemories = memories.filter((m) => m.id !== id);

    setDeleteTarget(null);

    window.location.reload();

    // update timeline without reload
    // const grouped = {};

    // newMemories.forEach((m) => {
    //   let date;

    //   if (m.time?.seconds) {
    //     date = new Date(m.time.seconds * 1000);
    //   } else if (m.time?.toDate) {
    //     date = m.time.toDate();
    //   } else {
    //     date = new Date(m.time);
    //   }

    //   const year = date.getFullYear();
    //   const month = date.getMonth();

    //   if (!grouped[year]) grouped[year] = {};
    //   if (!grouped[year][month]) grouped[year][month] = [];

    //   grouped[year][month].push(m);
    // });

    // setTimeline(grouped);
  };

  return (
    <div className={`timeline-root ${selectedYear ? "year-open" : ""}`}>
      
      {/* YEAR SELECTOR */}

      <div className="year-selector">

        {!memories || memories.length === 0
          ? <Loading textColor="black" text="Bé đợi xíu nha"/>
          : years.map((year) => (
              <div
                key={year}
                className={`year-pill ${selectedYear === year ? "active" : ""}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </div>
            ))
        }

      </div>

      {/* YEAR VIEW */}

      {selectedYear && (
        <div className="year-view">

          <div className="year-view-header">
            <button
              className="back-button"
              onClick={() => {setSelectedYear(null); setCollapsedMonths({});}}
            >
              <span className="material-symbols-outlined">
                arrow_back_ios
              </span>
              Chọn năm
            </button>
          </div>

          {Object.keys(timeline[selectedYear])
            .sort((a, b) => a - b)
            .map((month, index) => {

              const key = `${selectedYear}-${month}`;

              const isCollapsed = collapsedMonths[key] ?? index !== 0;

              const monthName = new Date(selectedYear, month).toLocaleString("vi-VN", {
                month: "long",
              }).replace("tháng", "Tháng");;

              const monthMemories = timeline[selectedYear][month];

              return (
                <div key={month} className="month-section">

                  <div
                    className="month-header"
                    onClick={() => toggleMonth(selectedYear, month, isCollapsed)}
                  >
                    <h3 className="month-title">
                      {monthName}
                      <span className="month-count">
                        ({monthMemories.length})
                      </span>
                    </h3>

                    <span className="material-symbols-outlined">
                      {isCollapsed ? "expand_more" : "expand_less"}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="memory-grid">
                      {monthMemories.map((memory) => (
                        <MemoryItemCard
                          key={memory.id}
                          memory={memory}
                          onClick={() => handleMemoryClick(memory)}
                          onDelete={() => setDeleteTarget(memory)}
                        />
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
        </div>
      )}

      <DeleteItem
        memory={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
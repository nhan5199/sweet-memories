import { useEffect, useState } from "react";
import { getAllMemories } from "./services/firestoreService";
import MemoryTimeline from "./components/MemoryTimeline";
import AddMemoryItem from "./components/AddMemoryItem";
import MemoryItem from "./components/MemoryItem";
import '../src/styles/home.css'

export default function PostData() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [displayAddItem, setDisplayAddItem] = useState(false);

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [displayMemoryItem, setDisplayMemoryItem] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setIsLoading(true);

    const data = await getAllMemories();

    setMemories(data);
    setIsLoading(false);
  };

  return (
    <>
      {/* ADD BUTTON */}
      <button
        className="add-item-button"
        onClick={() => setDisplayAddItem(true)}
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {displayAddItem && (
        <div
          className="grey-background"
          onClick={() => setDisplayAddItem(false)}
        >
          <AddMemoryItem onClose={() => setDisplayAddItem(false)} />
        </div>
      )}

      {/* MEMORY VIEW */}
      {selectedMemory && displayMemoryItem && (
        <div
          className="grey-background"
          onClick={() => setDisplayMemoryItem(false)}
        >
          <MemoryItem
            memory={selectedMemory}
            onClose={() => setDisplayMemoryItem(false)}
          />
        </div>
      )}

      {/* TIMELINE */}
      <MemoryTimeline
        memories={memories}
        isLoading={isLoading}
        onMemoryClick={(memory) => {
          setSelectedMemory(memory);
          setDisplayMemoryItem(true);
        }}
      />
    </>
  );
}
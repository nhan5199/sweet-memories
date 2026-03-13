import React, { useState, useEffect, useRef } from "react";
import "../styles/memory-item.css";

const MemoryItem = ({ memory, onClose }) => {
  const [title, setTitle] = useState("");
  const [animating, setAnimating] = useState(false);

  
  const slides = [
    { type: "description", text: memory.description },
    ...(memory.imageUrls || []).map((img) => ({ type: "image", src: img }))
  ];

  const [items, setItems] = useState(slides);

  const startX = useRef(null);
  const startY = useRef(null);

  // typing title effect
 useEffect(() => {
  setTitle("");
  let i = 0;

  const interval = setInterval(() => {
    setTitle(memory.name.slice(0, i + 1));
    i++;

    if (i >= memory.name.length) clearInterval(interval);
  }, 80);

  return () => clearInterval(interval);
}, [memory.name]);

  const nextImage = () => {
    if (animating) return;

    setAnimating(true);

    setTimeout(() => {
      setItems((prev) => {
        const newArr = [...prev];
        const first = newArr.shift();
        newArr.push(first);
        return newArr;
      });

      setAnimating(false);
    }, 600);
  };

  const prevImage = () => {
    if (animating) return;

    setAnimating(true);

    setTimeout(() => {
      setItems((prev) => {
        const newArr = [...prev];
        const last = newArr.pop();
        newArr.unshift(last);
        return newArr;
      });

      setAnimating(false);
    }, 600);
  };

  // -----------------------
  // Drag Events
  // -----------------------

    const dragging = useRef(false);

    const handleMouseDown = (e) => {
        e.preventDefault();
        dragging.current = true;

        startX.current = e.clientX;
        startY.current = e.clientY;
    };

    const handleMouseMove = (e) => {
        if (!dragging.current) return;

        const diffX = e.clientX - startX.current;
        const diffY = e.clientY - startY.current;

        if (diffX > 80) {
          prevImage();
          dragging.current = false;
        } 
        else if (diffX < -80 || diffY < -80) {
          nextImage();
          dragging.current = false;
        }
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];

        startX.current = touch.clientX;
        startY.current = touch.clientY;

        dragging.current = true;
    };

    const handleTouchMove = (e) => {
        if (!dragging.current) return;

        const touch = e.touches[0];

        const diffX = touch.clientX - startX.current;
        const diffY = touch.clientY - startY.current;

        if (diffX > 80) {
          prevImage();
          dragging.current = false;
        } 
        else if (diffX < -80 || diffY < -80) {
          nextImage();
          dragging.current = false;
        }
    };

    const handleTouchEnd = () => {
        dragging.current = false;
    };

  return (
    <div className="gallery-container" onClick={(e) => e.stopPropagation()}>
      <span className="close-btn material-symbols-outlined" onClick={() => onClose()}>
close
</span>
<span className="material-symbols-outlined">
close
</span>

      <h1 className="memory-title">{title}</h1>

      <div
        className="image-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}

        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        >
        {items.map((item, index) => {
          const offset = index * 10;
          const scale = 1 - index * 0.04;
          const rotate = (index % 2 === 0 ? 1 : -1) * index * 2;

          const style = {
            zIndex: items.length - index,
            transform:
              index === 0 && animating
                ? undefined
                : `translate(-50%, calc(-50% + ${offset}px)) rotate(${rotate}deg) scale(${scale})`,
          };

          if (item.type === "description") {
            return (
              <div
                key={"desc"}
                className={`image description-card ${index === 0 && animating ? "slide-out" : ""}`}
                style={style}
              >
                <p>{item.text}</p>
              </div>
            );
          }

          return (
            <img
              key={item.src}
              src={item.src}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
              className={`image ${index === 0 && animating ? "slide-out" : ""}`}
              style={style}
              alt="memory-img"
            />
          );
        })}
      </div>

      <div className="memory-action-container">
          <span onClick={prevImage} className="pre-img material-symbols-outlined">
arrow_back_ios
</span>
          <span onClick={nextImage} className="next-img material-symbols-outlined">
arrow_forward_ios
</span>
      </div>

      
    </div>
  );
};

export default MemoryItem;
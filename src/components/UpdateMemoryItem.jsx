import React, { useState, useEffect } from "react";
import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import "../styles/add-memory-item.css";
import { Loading } from "../utils/Loading";
import { updateMemory } from "../services/firestoreService";

const UpdateMemoryItem = ({ memory, onClose }) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memory) {
      setName(memory.name || "");
      setDescription(memory.description || "");

      if (memory.time) {
        const date = new Date(memory.time.seconds * 1000);
        setTime(date.toISOString().split("T")[0]);
      }

      if (memory.imageNames) {
        setImages(memory.imageNames);
        }
    }
  }, [memory]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageNames = [];

      // Upload all selected images
      for (const file of images) {
        const uniqueName = `${Date.now()}-${file.name}`;
        const imageRef = ref(storage, `memories/${uniqueName}`);

        await uploadBytes(imageRef, file);

        uploadedImageNames.push(uniqueName);
      }

      const updatedData = {
        name,
        time: new Date(time),
        description,
        imageNames: uploadedImageNames
      };

      await updateMemory(memory.id, updatedData);

      setLoading(false);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating memory:", error);
    }
  };

  return (
    <div className="grey-background" onClick={() => onClose()}>
        <div className="add-memory-item-container" onClick={(e) => e.stopPropagation()}>
            <span
                className="close-btn material-symbols-outlined"
                onClick={() => onClose()}
            >
                close
            </span>

            <div className="add-memory-title">Chỉnh sửa kỉ niệm</div>

            {loading ? (
                <Loading textColor={"black"} text={"Đang cập nhật kỉ niệm..."} type={'popup'} />
            ) : (
                <form className="add-memory-form" onSubmit={handleSubmit}>
                <div className="memory-form-item">
                    <label htmlFor="memory-name">Tên kỉ niệm</label>
                    <input
                    type="text"
                    id="memory-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>

                <div className="memory-form-item">
                    <label htmlFor="memory-time">Thời gian</label>
                    <input
                    type="date"
                    id="memory-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    />
                </div>

                <div className="memory-form-item">
                    <label htmlFor="memory-description">Chú thích</label>
                    <textarea
                    id="memory-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="memory-form-item">
                    <label htmlFor="memory-imgs">Hình ảnh mới</label>
                    <input
                    type="file"
                    id="memory-imgs"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    />

                    <div className="preview-add-imgs-container">
                    <label htmlFor="memory-imgs" className="upload-box">
                        <span className="material-symbols-outlined">add</span>
                    </label>

                    {images.length > 0 && (
                        <label className="selected-files">
                        selected {images.length} files
                        </label>
                    )}
                    </div>
                </div>

                <button className="submit-memory-btn" type="submit">
                    Cập nhật kỉ niệm
                </button>
                </form>
            )}
            </div>
    </div>
  );
};

export default UpdateMemoryItem;
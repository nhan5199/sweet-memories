import React, { useState } from "react";
import { storage, db } from "../firebase/firebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import '../styles/add-memory-item.css';

const AddMemoryItem = ({onClose}) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedImageNames = [];

      // 1️⃣ Upload all images to Firebase Storage
      for (const file of images) {
        const uniqueName = `${Date.now()}-${file.name}`;
        const imageRef = ref(storage, `memories/${uniqueName}`);

        await uploadBytes(imageRef, file);

        uploadedImageNames.push(uniqueName);
      }

      // 2️⃣ Save data to Firestore (only image names)
      await addDoc(collection(db, "memories"), {
        name,
        time: new Date(time),
        description,
        imageNames: uploadedImageNames,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setName("");
      setTime("");
      setDescription("");
      setImages([]);

      onClose();
    } catch (error) {
      console.error("Error adding memory:", error);
    }
  };

  return (
    <div className="add-memory-item-container" onClick={(e) => e.stopPropagation()}>
      <span class="close-btn material-symbols-outlined" onClick={() => onClose()}>
close
</span>
      <div className="add-memory-title">Kỉ niệm mới</div>

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
            type="text"
            id="memory-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="memory-form-item">
          <label htmlFor="memory-imgs">Hình ảnh</label>
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
              <span class="material-symbols-outlined">add</span>
            </label>

            {/* Image previews */}
            {images?.length > 0 && <label className="selected-files">selected {images?.length} files</label>}
          </div>
          
        </div>

        <button className="submit-memory-btn" type="submit">Lưu kỉ niệm</button>
      </form>
    </div>
  );
};

export default AddMemoryItem;
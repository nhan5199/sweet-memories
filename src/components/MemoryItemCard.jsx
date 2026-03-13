import "../styles/memory-item-card.css";

const MemoryItemCard = ({ memory, onClick, onPreviewLoad, onDelete }) => {

  const previewImage = memory.imageUrls?.[0];

  return (
    <div
      className={`memory-item-container`}
      onClick={(e) => {onClick()}}
    >
      <div className="memory-item">
        
        <button
          className="delete-icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <span className="material-symbols-outlined"> close </span>
        </button>

        <div className="image-wrapper">
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="memory-item-img preview-img"
              onLoad={onPreviewLoad}
              onError={onPreviewLoad}
            />
          )}
        </div>

        <div className="information-container">
          <p className="memory-item-title">{memory.name}</p>
          <p className="memory-item-time">{memory.time?.toDate().toLocaleDateString()}</p>
          <p className="memory-item-description">{memory.description}</p>
        </div>
       </div>

       
    </div>
  );
};

export default MemoryItemCard;
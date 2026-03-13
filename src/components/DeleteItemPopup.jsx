
import '../styles/delete-item.css';

const DeleteItem = ({memory, onConfirm, onCancel}) => {
    if (!memory) return null;

    return  (
        <div className="grey-background" onClick={() => onCancel()}>
        <div className="delete-item-popup" onClick={(e) => e.stopPropagation()}>

            <button
                className="delete-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                }}
                >
                <span class="material-symbols-outlined"> close </span>
            </button>

            <h3>Xóa kỷ niệm?</h3>

            <p>
            Em có chắc muốn xóa kỉ niệm tên <b>{memory.name}</b> không đó? <br/>
            Không có cơ hội thay đổi đâu nha.
            </p>

            <div className="delete-popup-actions">

            <button
                className="cancel-btn btn"
                onClick={onCancel}
            >
                Hủy
            </button>

            <button
                className="delete-btn btn"
                onClick={() => onConfirm(memory.id)}
            >
                Xóa
            </button>

            </div>

        </div>
        </div>
    );
};

export default DeleteItem;
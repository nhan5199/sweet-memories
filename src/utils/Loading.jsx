export const Loading = ({textColor, text, type}) => {
  return <div className={`loading-container ${textColor} ${type}`}>
    <img src="/loading-image.png" alt="" className="loading-image" />

    <p>{text}</p>

    <div className="loading-dots">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}></span>
      ))}
    </div>
  </div>;
};
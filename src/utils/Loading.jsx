export const Loading = ({textColor, text}) => {
  return <div className={`loading-container ${textColor}`}>
    <img src="/loading-image.png" alt="" className="loading-image" />

    <p>{text}</p>

    <div className="loading-dots">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}></span>
      ))}
    </div>
  </div>;
};
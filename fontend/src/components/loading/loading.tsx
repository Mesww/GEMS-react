import "./style.sass";
const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
  );
}
export default Loading;
"use client";

import ReactLoading from "react-loading";

function LoadingPage({ isLoad }: { isLoad: boolean }) {
  return (
    <div
      className={`${
        isLoad ? "block" : "hidden"
      } fixed z-[999] flex h-screen w-full items-center justify-center bg-white bg-opacity-95 backdrop-blur-md duration-300 ease-in-out`}
    >
      <ReactLoading type="cubes" color="#000000" height={100} width={100} />
    </div>
  );
}

export default LoadingPage;

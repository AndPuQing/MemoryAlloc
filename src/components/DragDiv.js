import React, { useContext } from "react";
import { SpaceContext } from "../context/spaceContext";

const DragDiv = (props) => {
  let block = props.block;

  const { space, setSpace } = useContext(SpaceContext);
  return (
    <div
      className="w-1.5 bg-slate-500 rounded-full select-none cursor-col-resize mx-2"
      onPointerDown={(e) => {
        const x = e.clientX;
        const rawSize = block.size;
        const handleMove = (e) => {
          const dx = e.clientX - x;
          const size = rawSize + dx / 5;
          if (space.space.length > 1) {
            if (size < 0) return;
            if (size > space.size()) return;
            space.resize(block, size);
            setSpace({ ...space });
          }
        };
        const handleUp = () => {
          document.removeEventListener("pointermove", handleMove);
          document.removeEventListener("pointerup", handleUp);
        };
        document.addEventListener("pointermove", handleMove);
        document.addEventListener("pointerup", handleUp);
      }}
    ></div>
  );
};

export default DragDiv;

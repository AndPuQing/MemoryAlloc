import React, { useState, useContext, useEffect } from "react";
import { SpaceContext } from "../context/spaceContext";
import DragDiv from "./DragDiv";

const DragBlock = (props) => {
  let block = props.block;
  const { space, setSpace } = useContext(SpaceContext);
  const [width, setWidth] = useState((block.size / space.size()) * 100 + "%");
  useEffect(() => {
    setWidth((block.size / space.size()) * 100 + "%");
  }, [block, space]);

  return (
    <div className="flex flow-row" style={{ width: width }}>
      <div
        className="rounded-lg flex items-center justify-center bg-blue-300 dark:bg-blue-200 dark:text-blue-500"
        style={{ width: "95%" }}
      >
        <div className="flex flex-col p-2 ">
          <div className="flex-1 text-clip">
            {"Head : " + block.head.toFixed(0)}
          </div>
          <div className="flex-1">{"Size : " + block.size.toFixed(0)}</div>
        </div>
      </div>
      <DragDiv block={block} />
    </div>
  );
};

export default DragBlock;

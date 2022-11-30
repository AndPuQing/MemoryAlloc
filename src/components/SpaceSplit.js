import React, { useContext, useState, useEffect } from "react";
import { SpaceContext } from "../context/spaceContext";
import DragBlock from "./DragBlock";
import { Button } from "antd";
const SpaceSplit = () => {
  const { space, setSpace } = useContext(SpaceContext);
  const [blocks, setBlocks] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  useEffect(() => {
    setBlocks(
      space.space.map((block, index) => <DragBlock block={block} key={index} />)
    );
  }, [space]);

  return (
    <div className="flex flex-row bg-red-100 p-4 items-center rounded-lg">
      <div
        className="flex flex-row"
        style={{ width: "1200px", height: "200px" }}
      >
        {blocks}
      </div>
      <div
        className="rounded-2xl bg-red-300"
        onClick={() => {
          space.alloc(100);
          setSpace({ ...space });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      </div>
      <Button type="primary">Button</Button>
    </div>
  );
};

export default SpaceSplit;

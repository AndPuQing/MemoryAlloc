import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { SpaceContext } from "../context/spaceContext";

const SpaceStatus = () => {
  const { space, setSpace } = React.useContext(SpaceContext);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState([]);
  const [pid, setPid] = useState([]);
  const [color, setColor] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    let memorys = space.space.map((block) => {
      return block.size;
    });
    memorys.unshift(space.size);

    let offsets = space.space.map((block) => {
      return block.head;
    });
    offsets.unshift(0);

    let pids = space.space.map((block) => {
      if (block.pid === null) return "System";
      return block.pid;
    });
    pids.unshift("Total");
    let colors = space.space.map((block) => {
      if (block.free) return "green";
      return "red";
    });
    colors.unshift("blue");
    setData(memorys);
    setOffset(offsets);
    setPid(pids);
    setColor(colors);
  }, [space]);

  useEffect(() => {
    const canvas = echarts.init(canvasRef.current);
    canvas.setOption({
      title: {
        text: "动态内存分配模拟",
        subtext: "Living ExpDynamic memory allocation simulation",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + "<br/>" + tar.seriesName + " : " + tar.value + "B";
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        splitLine: { show: false },
        data: pid,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Placeholder",
          type: "bar",
          stack: "Total",
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
          emphasis: {
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
          },
          data: offset,
        },
        {
          name: "Memory",
          type: "bar",
          stack: "Total",
          label: {
            show: true,
            position: "inside",
            formatter: function (params) {
              return params.value + "B";
            },
          },
          itemStyle: {
            color: function (params) {
              return color[params.dataIndex];
            },
          },
          data: data,
        },
      ],
    });
    return () => {
      canvas.dispose();
    };
  }, [data, offset, pid, color]);

  return (
    <div>
      <div ref={canvasRef} style={{ height: "500px", width: "900px" }}></div>
    </div>
  );
};

export default SpaceStatus;

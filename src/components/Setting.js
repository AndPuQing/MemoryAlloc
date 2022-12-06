import React, { useContext, useRef, useState } from "react";
import { MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  InputNumber,
  Checkbox,
  Select,
  Form,
  Input,
  Space,
} from "antd";
import { WorkFlow, WorkFlowContext } from "../context/workflowContext";
import { SpaceContext, SpaceX } from "../context/spaceContext";
const Setting = () => {
  const timerRef = useRef();
  const { space, setSpace } = useContext(SpaceContext);
  const [workFlow, setWorkFlow] = useContext(WorkFlowContext);
  let [time, setTime] = useState(0);
  const onFinish = (values) => {
    console.log("Received values of form:", values);
    const { size, mode, randomInit, workflows } = values;
    const space = new SpaceX(size, randomInit);
    const NewworkFlow = new WorkFlow(space, mode);
    setSpace({ ...space });
    workflows.forEach((work) => {
      NewworkFlow.add(
        work.pid,
        parseInt(work.size),
        parseInt(work.start),
        parseInt(work.end)
      );
    });
    // first we need to clear the timer
    clearInterval(timerRef.current);
    setTime(0);
    let timeNum = 0;
    timerRef.current = setInterval(() => {
      if (NewworkFlow.update(timeNum)) {
        setSpace({ ...space });
      }
      if (NewworkFlow.works.length === 0) {
        clearInterval(timerRef.current);
      }
      if (NewworkFlow.defrag()) {
        setSpace({ ...space });
      }
      setWorkFlow({ ...NewworkFlow });
      if (timeNum > NewworkFlow.maxTime) {
        clearInterval(timerRef.current);
      }
      timeNum++;
      setTime(timeNum);
    }, 1000);
  };

  return (
    <div>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        initialValues={{ size: 1024, randomInit: true, mode: "first-fit" }}
        autoComplete="off"
      >
        <Form.Item label="空间" name="size">
          <InputNumber addonAfter="B" size="large" />
        </Form.Item>

        <Form.Item
          label="随机 lock 内存"
          name="randomInit"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>

        <Form.Item name="mode" label="分配算法">
          <Select
            style={{ width: 120 }}
            size="large"
            options={[
              {
                label: "首次适应",
                value: "first-fit",
              },
              {
                label: "最佳适应",
                value: "best-fit",
              },
              {
                value: "worst-fit",
                label: "最坏适应",
              },
              {
                value: "next-fit",
                label: "临近适应",
              },
              {
                value: "quick-fit",
                label: "快速适应",
              },
            ]}
          />
        </Form.Item>
        <Form.List name="workflows">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex" }}
                  className="ml-4 justify-center"
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "pid"]}
                    rules={[{ required: true, message: "Missing pid" }]}
                  >
                    <Input placeholder="PID" className="w-20" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "size"]}
                    rules={[{ required: true, message: "Missing size" }]}
                  >
                    <Input placeholder="Size" className="w-20" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "start"]}
                    rules={[{ required: true, message: "Missing start time" }]}
                  >
                    <Input placeholder="Start" className="w-20" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "end"]}
                    rules={[{ required: true, message: "Missing end time" }]}
                  >
                    <Input placeholder="End" className="w-20" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <div className="flex flex-row items-center justify-center">
                  <Button
                    type="text"
                    className="transition ease-in-out bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
                    onClick={() => add()}
                    size="large"
                  >
                    添加进程
                  </Button>
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button
            type="text"
            className=" transition ease-in-out bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
            size="large"
            htmlType="submit"
          >
            开始模拟
          </Button>
        </Form.Item>
      </Form>
      <div className="flex flex-row items-center justify-center">
        系统当前计数：{time}
      </div>
    </div>
  );
};

export default Setting;

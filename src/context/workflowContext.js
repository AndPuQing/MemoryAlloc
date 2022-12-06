import React, { useState, createContext } from "react";

export const WorkFlowContext = createContext();
class Work {
  constructor(pid, size, start, end) {
    this.pid = pid;
    this.status = "wait";
    this.size = size;
    this.start = start;
    this.end = end;
  }
}

class WorkFlow {
  constructor(space, mode) {
    this.works = [];
    this.space = space;
    this.mode = mode;
    this.maxTime = () => Math.max(...this.works.map((work) => work.end));
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.defrag = this.defrag.bind(this);
  }
  add(pid, size, start, end) {
    this.works.push(new Work(pid, size, start, end));
  }

  update(time) {
    time = Number(time);
    let flag = false;
    this.works.forEach((work) => {
      let { start, end } = work;
      // convert to number
      start = Number(start);
      end = Number(end);
      if (start < time && time < end) {
        work.status = "running";
      } else if (time > end) {
        work.status = "finished";
      } else if (Number(time - start) === 0) {
        work.status = "ready";
      } else {
        work.status = "wait";
      }
    });
    // free the finished works space in the memory
    this.works.forEach((work, index) => {
      if (work.status === "finished") {
        this.space.free(work.pid);
        this.works.splice(index, 1);
        console.log(this.works);
        console.log("free", work.pid);
        flag = true;
      }
    });
    // allocate the ready works space in the memory
    this.works.forEach((work) => {
      if (work.status === "ready") {
        if (this.space.alloc(work.size, this.mode, work.pid)) {
          console.log("allocated space for", work.pid);
          work.status = "running";
          flag = true;
        } else {
          console.log("can't allocate space for", work.pid);
        }
      }
    });

    return flag;
  }

  // Debris recycling
  defrag() {
    return this.space.defrag();
  }
}

export const WorkProvider = (props) => {
  const [workFlow, setWorkFlow] = useState(null);

  return (
    <WorkFlowContext.Provider value={[workFlow, setWorkFlow]}>
      {props.children}
    </WorkFlowContext.Provider>
  );
};

export { Work, WorkFlow };

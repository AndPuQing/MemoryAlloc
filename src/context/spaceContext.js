import React, { useState, createContext } from "react";

export const SpaceContext = createContext();

class Block {
  constructor(head, size, free = true, pid = null) {
    this.head = head;
    this.size = size;
    this.free = free;
    this.pid = pid;
  }
}

class SpaceX {
  constructor(size, randomInit = true) {
    this.space = [new Block(0, size)];
    this.size = size;
    this.alloc = this.alloc.bind(this);
    this.resize = this.resize.bind(this);
    this.lastPointer = 0; // for next-fit
    if (randomInit) this.randomInit();
  }

  randomInit() {
    let count = Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      let size = Math.floor(
        Math.random() * this.space[this.space.length - 1].size
      );
      this.partition(size);
    }
  }

  partition(size) {
    let last = this.space[this.space.length - 1];
    if (last.size < size) return;
    last.size -= size;
    let newBlock = new Block(last.head + last.size, size);
    this.space.push(newBlock);
  }

  // alloc a space for the given process
  alloc(size, mode, pid = null) {
    switch (mode) {
      case "first-fit":
        return this.firstFit(size, pid);
      case "best-fit":
        return this.bestFit(size, pid);
      case "worst-fit":
        return this.worstFit(size, pid);
      case "next-fit":
        return this.nextFit(size, pid);
      case "fast-fit":
        return this.fastFit(size, pid);
      default:
    }
  }

  //
  nextFit(size, pid) {
    let index = this.space.findIndex(
      (block) =>
        block.free && block.size >= size && block.head >= this.lastPointer
    );
    if (index === -1) {
      index = this.space.findIndex(
        (block) =>
          block.free && block.size >= size && block.head < this.lastPointer
      );
    }
    if (index === -1) return false;
    this.lastPointer = this.space[index].head;
    this.space[index].size -= size;
    let newBlock = new Block(
      this.space[index].head + this.space[index].size,
      size
    );
    newBlock.free = false;
    newBlock.pid = pid;
    this.space.splice(index + 1, 0, newBlock);
    return true;
  }

  // free the space for the given process
  free(pid) {
    let index = this.space.findIndex((block) => block.pid === pid);
    if (index === -1) return false;
    this.space[index].free = true;
    this.space[index].pid = null;
    // this.merge(index);
    return true;
  }

  // merge the block with its next block
  merge(index) {
    if (index === this.space.length - 1) return;
    let block = this.space[index];
    let next = this.space[index + 1];
    if (block.free && next.free) {
      block.size += next.size;
      this.space.splice(index + 1, 1);
    }
  }

  // resize the space for the given block
  resize(block, size) {
    let index = this.space.indexOf(block);
    if (index === -1 || index === this.space.length - 1) return;
    let blockSize = block.size;
    block.size = Math.floor(size);
    let next = this.space[index + 1];
    next.head = block.head + block.size;
    next.size = next.size - (block.size - blockSize);
    if (next.size === 0) {
      this.space.splice(index + 1, 1);
    }
  }
}

export const SpaceProvider = (props) => {
  const [space, setSpace] = useState(new SpaceX(1024));
  return (
    <SpaceContext.Provider value={{ space, setSpace }}>
      {props.children}
    </SpaceContext.Provider>
  );
};

export { Block, SpaceX };

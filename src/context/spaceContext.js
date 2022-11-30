import React, { useState, createContext } from "react";

export const SpaceContext = createContext();

class Block {
  constructor(head, size, free = true, next = null, pid = null) {
    this.head = head;
    this.size = size;
    this.free = free;
    this.pid = pid;
  }
}

class Space {
  constructor(size) {
    this.space = [new Block(0, size)];
    this.size = () => this.space.reduce((acc, block) => acc + block.size, 0);
    this.alloc = this.alloc.bind(this);
    this.resize = this.resize.bind(this);
  }

  alloc(size) {
    if (size > this.size()) return;
    let index = this.space.findIndex(
      (block) => block.free && block.size >= size
    );
    if (index === -1) return;
    let block = this.space[index];
    console.log(block.size, size);
    block.size -= size;
    let newBlock = new Block(block.head + block.size, size, false);
    this.space.push(newBlock);
  }
  resize(block, size) {
    if (size < 10) return;
    let index = this.space.indexOf(block);
    if (index === -1 || index === this.space.length - 1) return;
    let blockSize = block.size;
    block.size = Math.floor(size);
    let next = this.space[index + 1];
    next.head = block.head + block.size;
    next.size = next.size - (block.size - blockSize);
  }
}

export const SpaceProvider = (props) => {
  const [space, setSpace] = useState(new Space(1024));
  return (
    <SpaceContext.Provider value={{ space, setSpace }}>
      {props.children}
    </SpaceContext.Provider>
  );
};

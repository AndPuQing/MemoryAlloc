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

  // random lock some small blocks
  randomInit() {
    for (let i = 0; i < 3; i++) {
      let randomSize = Math.floor(Math.random() * 90) + 10;
      let randomHead = Math.floor(Math.random() * (this.size - randomSize));
      // Find the block that can be allocated
      let index = this.space.findIndex(
        (block) =>
          block.free &&
          randomHead >= block.head &&
          randomHead + randomSize <= block.head + block.size
      );
      if (index === -1) continue;
      // split the block
      let block = this.space[index];
      let newBlock = new Block(block.head, randomHead - block.head);
      this.space[index].head = randomHead + randomSize;
      this.space[index].size = block.size - newBlock.size - randomSize;
      let newBlock2 = new Block(randomHead, randomSize, false);
      this.space.splice(index, 1, newBlock, newBlock2, this.space[index]);
    }
  }

  IS_POWER_OF_2 = (x) => !(x & (x - 1)); // adjust the size is power of 2

  // resize the space to power of 2
  fixsize = (size) => {
    size |= size >> 1;
    size |= size >> 2;
    size |= size >> 4;
    size |= size >> 8;
    size |= size >> 16;
    return size + 1;
  };

  // alloc a space for the given process
  alloc(size, mode, pid = null) {
    this.space.sort((a, b) => a.head - b.head);
    switch (mode) {
      case "first-fit":
        this.firstFit(size, pid);
        break;
      case "best-fit":
        this.bestFit(size, pid);
        break;
      case "worst-fit":
        this.worstFit(size, pid);
        break;
      case "next-fit":
        this.nextFit(size, pid);
        break;
      case "quick-fit":
        this.quickFit(size, pid);
        break;
      default:
    }
    this.space.sort((a, b) => a.head - b.head);
    // remove the free blocks with size 0
    this.space = this.space.filter((block) => block.size !== 0);
    return true;
  }

  // next-fit algorithm
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
    this.space[index].size -= size;
    let newBlock = new Block(this.space[index].head, size);
    newBlock.free = false;
    newBlock.pid = pid;
    this.space[index].head += size;
    this.lastPointer = this.space[index].head;
    this.space.splice(index + 1, 0, newBlock);
    return true;
  }

  //first-fit algorithm
  firstFit(size, pid) {
    let index = this.space.findIndex(
      (block) => block.free && block.size >= size
    );
    if (index === -1) return false;
    this.space[index].size -= size;
    let newBlock = new Block(this.space[index].head, size);
    newBlock.free = false;
    newBlock.pid = pid;
    this.space[index].head += size;
    this.space.splice(index + 1, 0, newBlock);
    return true;
  }

  // best-fit algorithm
  bestFit(size, pid) {
    this.space.sort((a, b) => {
      return a.size - b.size;
    });
    let minIndex = this.space.findIndex(
      (block) => block.free && block.size >= size
    );
    if (minIndex === -1) return false;

    this.space[minIndex].size -= size;
    let newBlock = new Block(this.space[minIndex].head, size);
    newBlock.free = false;
    newBlock.pid = pid;
    this.space[minIndex].head += size;
    this.space.splice(minIndex + 1, 0, newBlock);
    return true;
  }

  // worst-fit algorithm
  worstFit(size, pid) {
    this.space.sort((a, b) => {
      return b.size - a.size;
    });
    let maxIndex = this.space.findIndex(
      (block) => block.free && block.size >= size
    );
    if (maxIndex === -1) return false;
    this.space[maxIndex].size -= size;
    let newBlock = new Block(this.space[maxIndex].head, size);
    newBlock.free = false;
    newBlock.pid = pid;
    this.space[maxIndex].head += size;
    this.space.splice(maxIndex + 1, 0, newBlock);
    return true;
  }

  // quick-fit algorithm
  quickFit(size, pid) {
    if (!this.IS_POWER_OF_2(size)) size = this.fixsize(size);
    console.log("++++++++");

    var i = size;
    while (i <= 1024) {
      for (var j = 0; j <= 1024; j += i) {
        let head = j;
        let index = this.space.findIndex(
          (block) =>
            block.free &&
            head >= block.head &&
            head + size <= block.head + block.size
        );
        if (index === -1) {
          continue;
        } else {
          console.log("j" + j);
          let newBlock = new Block(head, size);
          newBlock.free = false;
          newBlock.pid = pid;

          //the top block
          let newBlock2 = new Block(
            head + size,
            this.space[index].head + this.space[index].size - head - size
          );
          newBlock2.free = true;
          //the button block
          this.space[index].size = head - this.space[index].head;

          this.space.splice(index + 1, 0, newBlock);
          this.space.splice(index + 2, 0, newBlock2);
          console.log(this.space);

          return true;
        }
      }
    }
    console.log(this.space);

    return false;
  }

  // free the space for the given process
  free(pid) {
    let index = this.space.findIndex((block) => block.pid === pid);
    if (index === -1) return false;
    this.space[index].free = true;
    this.space[index].pid = null;
    return true;
  }

  // Debris recycling
  defrag() {
    let flag = false;
    let freeblockIndex = [];
    for (let i = 0; i < this.space.length; i++) {
      if (this.space[i].free) {
        freeblockIndex.push(i);
      }
    }
    if (freeblockIndex.length <= 1) return flag;
    // Merge only contiguous free blocks
    for (let i = 0; i < freeblockIndex.length; i++) {
      if (freeblockIndex[i] + 1 === freeblockIndex[i + 1]) {
        this.space[freeblockIndex[i]].size +=
          this.space[freeblockIndex[i + 1]].size;
        this.space.splice(freeblockIndex[i + 1], 1);
        freeblockIndex.splice(i + 1, 1);
        i--;
        flag = true;
      }
    }
    return flag;
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

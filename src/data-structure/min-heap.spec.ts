import { MinHeap } from './min-heap';

describe('test min-heap', () => {
  it('create', () => {
    const oneMinHeap = new MinHeap<number>([5, 7, 6, 3, 4, 1]);
    expect(oneMinHeap.stringify()).toEqual(`[1,3,5,7,4,6]`);
  });

  it('push', () => {
    const oneMinHeap = new MinHeap<number>([5, 7, 6, 3, 4, 1]);
    oneMinHeap.push(2);
    expect(oneMinHeap.stringify()).toEqual(`[1,3,2,7,4,6,5]`);
    oneMinHeap.push(2);
    expect(oneMinHeap.stringify()).toEqual(`[1,2,2,3,4,6,5,7]`);
  });

  it('pop', () => {
    const oneMinHeap = new MinHeap<number>([5, 7, 6, 3, 4, 1]);
    let min = oneMinHeap.pop();
    expect(min).toEqual(1);
    expect(oneMinHeap.stringify()).toEqual(`[3,4,5,7,6]`);
    min = oneMinHeap.pop();
    expect(min).toEqual(3);
    expect(oneMinHeap.stringify()).toEqual(`[4,6,5,7]`);
  });
});

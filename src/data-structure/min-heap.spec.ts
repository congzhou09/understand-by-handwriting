import { MinHeap } from './min-heap';

describe('test min-heap', () => {
  it('create', () => {
    const oneMinHeap = new MinHeap<number>();
    oneMinHeap.create([5, 7, 6, 3, 4, 1]);
    expect(oneMinHeap.stringify()).toEqual(`[1,4,3,7,5,6]`);
  });

  it('push', () => {
    const oneMinHeap = new MinHeap<number>();
    oneMinHeap.create([5, 7, 6, 3, 4, 1]);
    oneMinHeap.push(2);
    expect(oneMinHeap.stringify()).toEqual(`[1,4,2,7,5,6,3]`);
    oneMinHeap.push(2);
    expect(oneMinHeap.stringify()).toEqual(`[1,2,2,4,5,6,3,7]`);
  });

  it('pop', () => {
    const oneMinHeap = new MinHeap<number>();
    oneMinHeap.create([5, 7, 6, 3, 4, 1]);
    let min = oneMinHeap.pop();
    expect(min).toEqual(1);
    expect(oneMinHeap.stringify()).toEqual(`[3,4,6,7,5]`);
    min = oneMinHeap.pop();
    expect(min).toEqual(3);
    expect(oneMinHeap.stringify()).toEqual(`[4,5,6,7]`);
  });
});

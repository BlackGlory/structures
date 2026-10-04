// import { assert } from '@blackglory/errors'
// import { TypedArrayOfConstructor, UnsignedTypedArrayConstructor } from 'justypes'

// export class TypedSparseSet<
//   T extends UnsignedTypedArrayConstructor
// > implements Iterable<number> {
//   private dense: TypedArrayOfConstructor<T>
//   private sparse: Array<number | undefined> = []

//   get [Symbol.toStringTag](): string {
//     return this.constructor.name
//   }

//   get size(): number {
//     return this.dense.length
//   }

//   constructor(array: TypedArrayOfConstructor<T>) {
//     assert(array.length === 0, 'The parameter array must be empty')

//     this.dense = array
//   }

//   [Symbol.iterator](): IterableIterator<number> {
//     return this.values()
//   }

//   * values(): IterableIterator<number> {
//     for (let i = 0; i < this.dense.length; i++) {
//       yield this.dense[i]
//     }
//   }

//   has(value: number): boolean {
//     return this.sparse[value] !== undefined
//   }

//   add(value: number): void {
//     if (!this.has(value)) {
//       const index = this.dense.length
//       this.dense.push(value)
//       this.sparse[value] = index
//     }
//   }

//   delete(value: number): boolean {
//     if (this.has(value)) {
//       const lastValue = this.dense.pop()!
//       if (value === lastValue) {
//         this.sparse[value] = undefined
//       } else {
//         const index = this.sparse[value]!
//         this.dense[index] = lastValue
//         this.sparse[lastValue] = index
//         this.sparse[value] = undefined
//       }
//       return true
//     } else {
//       return false
//     }
//   }

//   clear(): void {
//     this.sparse.length = 0
//     this.dense.fill(0)
//   }
// }

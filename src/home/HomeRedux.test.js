import * as HomeRedux from "./HomeRedux"
describe("actions", () => {
    it("should create an action to save stamp", () => {
        const stamp = {
            id: "SkJcXAY4b",
            at: 1499222857675,
            date: "2017/7/5",
        }
        const expectedAction = {
            type: "SAVE_STAMP",
            payload: { stamp }
        }
        expect(HomeRedux.saveStamp(stamp)).toEqual(expectedAction)
    })
})
// describe("todos reducer", () => {
//     it("should return the initial state", () => {
//         expect(
//             reducer(undefined, {})
//         ).toEqual([
//             {
//                 text: "Use Redux",
//                 completed: false,
//                 id: 0
//             }
//         ])
//     })

//     it("should handle ADD_TODO", () => {
//         expect(
//             reducer([], {
//                 type: types.ADD_TODO,
//                 text: "Run the tests"
//             })
//         ).toEqual(
//             [
//                 {
//                     text: "Run the tests",
//                     completed: false,
//                     id: 0
//                 }
//             ]
//             )

//         expect(
//             reducer(
//                 [
//                     {
//                         text: "Use Redux",
//                         completed: false,
//                         id: 0
//                     }
//                 ],
//                 {
//                     type: types.ADD_TODO,
//                     text: "Run the tests"
//                 }
//             )
//         ).toEqual(
//             [
//                 {
//                     text: "Run the tests",
//                     completed: false,
//                     id: 1
//                 },
//                 {
//                     text: "Use Redux",
//                     completed: false,
//                     id: 0
//                 }
//             ]
//             )
//     })
// })
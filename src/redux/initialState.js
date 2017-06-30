import { fromJS } from "immutable"
// initial state
var state1 = {
    app: {
        last_action_at: "",
        counting_record_id: "",
        current_date: "2017/06/21",
    },
    user: {
        custom: {
            ref_id: "H1HDUpVQu",
            system_key: "H1HDUpVQs",
            //     field1,
            //     field2,
        },
        working_start_at: 8,
        working_end_at: 17,
        // working_shift_zero:2 , //todo
        // update_at,
    },
    dates: [{
        // custom: {
        //     memo,
        //     field1,
        //     field2,
        // },
        date: "2017/6/21",
        // update_at,
    }],
    tasks: {
        "H1HDUpVQb": {
            // custom: {
            //     ref_id,
            //     memo,
            //     field1,
            //     field2,
            // },
            id: "H1HDUpVQb",
            name: "task1",
            // update_at,
        }, "H1HDUpVQ2": {
            // custom: {
            //     ref_id,
            //     memo,
            //     field1,
            //     field2,
            // },
            id: "H1HDUpVQ2",
            name: "task2",
            // update_at,
        }, "H1HDUpVQ3": {
            id: "H1HDUpVQ3",
            name: "task3",
        }
    },
    records: [{
        // custom: {
        //     ref_id,
        //     memo,
        //     field1,
        //     field2,
        // },
        id: "rywPU6EQZ",
        date: "2017/6/20",
        ref_task_id: "H1HDUpVQb",
        duration: 20,
        // intervals:[{
        //     start:
        // }]
        // update_at,
    }, {
        // custom: {
        //     ref_id,
        //     memo,
        //     field1,
        //     field2,
        // },
        id: "rywPU6EQ2",
        date: "2017/6/20",
        ref_task_id: "H1HDUpVQ2",
        duration: 10,
        // intervals:[{
        //     start:
        // }]
        // update_at,
    }],
    // stamps:[{
    //     id,
    //     date,
    //     at,
    //     prefix, //(start of,end of,...)
    //     ref_task_id,
    //     memo,
    // }],
    // action_logs:[{
    //     at,
    //     ref_task_id,
    //     action_type,//(start,pause,done,distribution,cancel)
    //     secs,
    //     accumulate,
    //     update_at,
    // }],
}
export default fromJS({
    app: {},
    user: {},
    dates: [],
    tasks: {},
    records: [],
    stamps: [],
    action_logs: [],
})
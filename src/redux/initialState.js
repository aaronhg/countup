import { Map, fromJS } from 'immutable'
// initial state
export default fromJS({
    app: {
        last_action_at: "1497928964586",
        counting_record_id: "rywPU6EQZ",
    },
    user: {
        // custom: {
        //     ref_id,
        //     system_key,
        //     field1,
        //     field2,
        // },
        working_start_at: 8,
        working_end_at: 17,
        // update_at,
    },
    date: {
        // custom: {
        //     memo,
        //     field1,
        //     field2,
        // },
        date: "2017/6/20",
        // update_at,
    },
    tasks: {'H1HDUpVQb':{
        // custom: {
        //     ref_id,
        //     memo,
        //     field1,
        //     field2,
        // },
        id: 'H1HDUpVQb',
        name: "task1",
        // update_at,
    }, 'H1HDUpVQ2':{
        // custom: {
        //     ref_id,
        //     memo,
        //     field1,
        //     field2,
        // },
        id: 'H1HDUpVQ2',
        name: "task2",
        // update_at,
    },'H1HDUpVQ3':{
        id: 'H1HDUpVQ3',
        name: "task3",
    }},
    records: [{
        // custom: {
        //     ref_id,
        //     memo,
        //     field1,
        //     field2,
        // },
        id: 'rywPU6EQZ',
        date: "2017/6/20",
        ref_task_id: 'H1HDUpVQb',
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
        id: 'rywPU6EQ2',
        date: "2017/6/20",
        ref_task_id: 'H1HDUpVQ2',
        duration: 10,
        // intervals:[{
        //     start:
        // }]
        // update_at,
    }],
})
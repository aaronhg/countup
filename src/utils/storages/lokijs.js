import 'babel-polyfill'
import loki from 'lokijs'
import LokiIndexedAdapter from '../../../node_modules/lokijs/src/loki-indexed-adapter'
import { gett } from '../id'
import moment from 'moment'
var idbAdapter = new LokiIndexedAdapter()
var db
var loaded

let colls = ["app", "dates", "records", "tasks", "stamps"]
var setup = new Promise((res, rej) => {
    if (loaded)
        res(db)
    function databaseInitialize() {
        colls.map((coll) => {
            if (!db.getCollection(coll)) {
                db.addCollection(coll);
            }
        })
        loaded = true
        res(db)
    }
    db = new loki("countup.db", {
        adapter: idbAdapter,
        autoload: true,
        autoloadCallback: databaseInitialize,
        autosave: true,
        autosaveInterval: 4000,
    });
})
function arrayToMap(arr, kfn) {
    return arr.reduce((obj, v) => {
        obj[kfn(v)] = v
        return obj
    }, {})
}
var getAll = new Promise((res, rej) => {
    var fn = () => {
        var truely = () => true
        res(colls.map(coll => [coll, db.getCollection(coll)])
            .map(([n, c]) => [n, c.where(truely)])
            .reduce(function (acc, cur, i) {
                let coll = cur[0]
                if (coll == "tasks") {
                    acc[coll] = arrayToMap(cur[1], (v) => v.id)
                } else if (coll == "app") {
                    acc.app = cur[1].filter(v => v.key == "app")[0] || { key: "app" }
                    if (!acc.app.last_action_at) { // 第一次使用
                        let today = moment().format("YYYY/MM/DD")
                        acc.app.current_date = today
                    }
                    acc.user = cur[1].filter(v => v.key == "user")[0] || { key: "user" } //,working_start_at:8,working_end_at:17} //todo
                } else {
                    acc[coll] = cur[1];
                }
                return acc;
            }, {}))
    }
    setup.then(fn)
})
var saveAll = async function (prev, data) {
    await setup
    colls.map(coll => [coll, [prev.get(coll), data.get(coll)], db.getCollection(coll)])
        .map(([coll, [dp, dn], c]) => {
            let ds = []
            if (coll == "app") {
                ds[ds.length] = [prev.get("app"), data.get("app")]
                ds[ds.length] = [prev.get("user"), data.get("user")]
            }
            if (coll == "tasks") {
                for (let k of dn.keys()) {
                    ds[ds.length] = [dp.get(k), dn.get(k)]
                }
            }
            if (coll == "records" || coll == "stamps" || coll == "dates") {
                ds = dn.map(d => [undefined, d]) // imm list , list.size
            }
            if (ds.length || ds.size)
                ds.map((di) => {
                    if (di[1] && di[0] !== di[1]) {
                        let d = di[1].toJS()
                        d.$loki && c.get(d.$loki) ? c.update(d) : c.insert(d)
                    }
                })
        })
    db.save()
}
export default {
    saveAll,
    getAll,
}
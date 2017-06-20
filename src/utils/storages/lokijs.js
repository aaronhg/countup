import 'babel-polyfill'
import loki from 'lokijs'
import LokiIndexedAdapter from '../../../node_modules/lokijs/src/loki-indexed-adapter'

var idbAdapter = new LokiIndexedAdapter()
var db
var loaded
let colls = ["tags", "records", "items", "etags"]
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
    db = new loki("behobs.db", {
        adapter: idbAdapter,
        autoload: true,
        autoloadCallback: databaseInitialize,
        autosave: true,
        autosaveInterval: 4000,
    });
})
var getAll = new Promise((res, rej) => {
    var fn = () => {
        var truely = () => true
        res(colls.map(coll => [coll, db.getCollection(coll)])
            .map(([n, c]) => [n, c.where(truely)])
            .reduce(function (acc, cur, i) {
                acc[cur[0]] = cur[1];
                return acc;
            }, {}))
    }
    setup.then(fn)
})
var saveAll = async function (data) {
    await setup
    colls.map(coll => [data[coll], db.getCollection(coll)])
        .map(([ds, c]) => {
            ds.map((d) => {
                d.$loki && c.get(d.$loki) ? c.update(d) : c.insert(d)
            })
        })
    db.save()
}
export default {
    saveAll,
    getAll,
}
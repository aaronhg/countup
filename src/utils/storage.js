// import indexdb from './storages/indexdbSimple'
import lokijs from './storages/lokijs'

// version
// test
// indexdb.test()
// let dbtype = "indexdb"







// export maxsize
// setup and update
var getAll = lokijs.getAll
var saveAll = lokijs.saveAll

// setup(setup)

export default {
    getAll,
    saveAll
}
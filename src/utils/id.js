import shortid from 'shortid'

export function getShortID() {
    return shortid.generate()
}
export function getTimestamp(){
    return new Date().getTime()
}

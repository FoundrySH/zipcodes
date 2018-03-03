
const { send, json, createError } = require('micro')
const microCors = require('micro-cors')
const sqlite3 = require('sqlite3')
const UrlPattern = require('url-pattern')

const db = new sqlite3.Database('zip.db', sqlite3.OPEN_READONLY)

const handler = async (req, res) => {
    if (req.method !== 'GET') { throw createError(405, 'Method Not Allowed') }

    const pattern = new UrlPattern('/api/:zip')
    const requested = pattern.match(req.url)

    if (!requested) {
        throw createError(404, 'Not Found')
    }

    db.get('SELECT * FROM zip WHERE zip = ?', [requested.zip], (err, row) => {
        if (err || !row) {
            send(res, 404, 'Not Found')
            return
        }

        send(res, 200, {
            zip: row.zip,
            lat: row.lat,
            lng: row.lng,
        })
    })
}

module.exports = microCors({ allowMethods: ['GET'] })(handler)

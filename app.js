const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(morgan('common'))
app.use(cors())

const playstore = require('./playstore.js')

app.get('/playstore', (req, res) => {
    const { genres, sort } = req.query

    if (!sort && !genres) {
        return res.send(playstore)
    }

    if (sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res.status(400).send('Sort must be one of Rating or App')
        }
    }

    if (genres) {
        if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)) {
            return res.status(400).send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card')
        }
    }

    let results = playstore

    if (!genres) {
        results = playstore
    } 
    
    if (genres) { 
        results = playstore
            .filter(apps =>
                apps
                    .Genres
                    .toLowerCase()
                    .includes(genres.toLowerCase()))
    }
    

    

    if (sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? - 1 : 0
        })
    }

    res.json(results)
})

module.exports = app
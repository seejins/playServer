const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../app')

describe('GET /playstore', () => {

    it('should return an array of apps', () => {
        return supertest(app)
            .get('/playstore')
            .expect(200)
            .expect('Content-type', /json/)
            .then( res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                const playstore = res.body[0]
                expect(playstore).to.include.all.keys(
                    'Genres', 'Rating', 'App'
                )
            })
    })

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/playstore')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Sort must be one of Rating or App')
    })

    it('should sort by Rating', () => {
        return supertest(app)
            .get('/playstore')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')

                let sorted = true;
                
                for(let i = 0; i < res.body.length - 1; i++) {
                    if(res.body[i].Rating > res.body[i+1].Rating) {
                        sorted = false;
                        break
                    }
                }
                expect(sorted).to.be.true
            })

    })

    it('should sort by Genres', () => {
        return supertest(app)
            .get('/playstore')
            .query({ genres: 'action' })
            .expect(200)
            .expect('Content-type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')

                let filtered = true;
                
                for(let i = 0; i < res.body.length; i++) {
                    if(!res.body[i].Genres.includes('Action')) {
                        filtered = false
                        break;
                    } 
                }
                expect(sorted).to.be.true
            })
    })

})
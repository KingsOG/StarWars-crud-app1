// server.js
console.log("May Node be with you");

const express =  require ('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
require('dotenv').config()



// MongoDB Connect

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'star-wars-quotes'

MongoClient.connect( dbConnectionStr, { useUnifiedTopology: true })
        .then(client => {
        console.log(`Connected to ${dbName} Database`)
        const db = client.db(dbName)
        const quotesCollection = db.collection('quotes')

        // EJS TEMPLATING

        app.set('view engine', 'ejs')

        // Make Public folder accessible to public
        app.use(express.static('public'))
    
        // placing the bodyParse before the CRUD handlers
        
        app.use(bodyParser.urlencoded({ extended: true}))
        // Accetping the PUT request with json
        app.use(bodyParser.json())


        // ALL CRUD HANDLERS HERE

            app.get('/', (req, res) => {
                db.collection('quotes').find().toArray()
                  .then(results => {
                    res.render('index.ejs', {quotes: results})
                    // console.log(results)
                  })
                  .catch(error => console.error(error))
              })

            app.post('/quotes', (req, res) => {
                quotesCollection.insertOne(req.body)
                 .then(result => {
                     res.redirect('/')
                 })
                 .catch(error => console.error(error))
            })

            app.put('/quotes', (req, res) => {
                quotesCollection.findOneAndUpdate(
                    { name: 'Yoda' },
                    {
                      $set: {
                        name: req.body.name,
                        quote: req.body.quote
                      }
                    },
                    {
                      upsert: true
                    }
                  )
                    .then(result => {
                        res.json('Success')
                    })
                    .catch(error => console.error(error))
                
              })

              app.delete('/quotes', (req, res) => {
                quotesCollection.deleteOne(
                  { name: req.body.name }
                )
                  .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                      }
                    res.json(`Deleted Darth Vadar's quote`)
                  })
                  .catch(error => console.error(error))
              })

            
            app.listen(3000, function(){
                console.log("listening on 3000")
            })
 })

 .catch(console.error)
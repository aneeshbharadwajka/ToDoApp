const express = require('express')
const operation = require('./databaseTasks.js')
const app = express()
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://aneeshbharadwajka:15226@localhost:5432/aneeshbharadwajka')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use(express.static('source'))



app.get('/', function (req, res) {
  res.render('source/index')
})

app.get('/read', function (req, res) {
  operation.readItems(sequelize, res)
})

app.post('/write/:content', function (req, res) {
  const contentToWrite = req.params.content
  operation.write(sequelize, res, contentToWrite)
})

app.put('/update/:id/', function (req, res) {
  const description = req.body.description
  const status = req.body.status
  const id = req.params.id
  operation.update(sequelize, res, description, status, id)
})

app.put('/update/', function (req, res) {
  const checkall = req.body.checkAll
  operation.selectAll(sequelize, res, checkall)
})

app.delete('/delete/:id', function (req, res) {
  const id = req.params.id
  operation.deleteFromDB(sequelize, res, id)
})

app.delete('/delete/', function (req, res) {
  const status = req.body.status
  operation.deleteCompleted(sequelize, res, status)
})
console.log('Listening to port 8010')
app.listen(8010)

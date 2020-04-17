const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

// set view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/success')
})

app.get('/success', async (req, res) => {
  const shortUrls = await ShortUrl.find().lean()
  const newUrl = await ShortUrl.findOne({}).sort({ _id: -1 }).limit(1).lean()
  res.render('success', { shortUrls: shortUrls, newUrl: newUrl })
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

//listening port
app.listen(process.env.PORT || 3000)
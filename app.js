const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const app = express()

// custom function
const shortId = require('./shorterid')

// db model
const ShortUrl = require('./models/shortUrl')

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
  const short = shortId()
  //判斷是否與先前產生的 id 重複
  await ShortUrl.findOne({ short: short }).then(url => {
    if (url) {
      const warning_msg = "true"
      return res.render('index', { warning_msg })
    } else {
      ShortUrl.create({ full: req.body.fullUrl, short: short })
      res.redirect('/success')
    }
  })

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
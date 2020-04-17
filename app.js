const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

// set view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  res.render('index')
})

//listening port
app.listen(process.env.PORT || 3000)
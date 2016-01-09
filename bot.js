var Twit = require('twit')
var T = new Twit(require('./config.js'))
var stream = T.stream('user')
var http = require('http')

function has1F346 (str) {
  if (str.indexOf('🍆') >= 0) {
    return true
  }
  return false
}

function randomNum (min, max, strFlag) {
  var value = Math.floor(Math.random() * max) + min
  if (strFlag) {
    return String(value)
  }
  return value
}

function makeTweet (handle, recipeTitle, url) {
  var str = '@' + handle + ' Here, have some 🍆: ' + recipeTitle
  if (str.length > 117) {
    return str.substr(0, 113) + '...\n' + url
  }
  return str + '\n' + url
}

stream.on('tweet', function (msg) {
  if (msg.in_reply_to_screen_name === 'AubergineBot' && has1F346(msg.text)) {
    http.get({
      hostname: 'www.recipepuppy.com',
      path: '/api/?i=eggplant,aubergine&p=' + randomNum(1, 100, true),
    }, function (res) {
      var body = ''
      res.on('data', function (d) {
        body += d
      })
      res.on('end', function () {
        var recipe = JSON.parse(body).results[randomNum(0, 9)]
        var params = {
          status: makeTweet(msg.user.screen_name, recipe.title, recipe.href),
          in_reply_to_status_id: msg.id_str
        }
        T.post('statuses/update', params, function (err, data, response) {})

      })
    })
  }
})

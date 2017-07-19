const socket = require('socket.io-client')('wss://streamer.cryptocompare.com')
const chalk = require('chalk')

const markets = ['Poloniex']
const rates = [
['ETH', 'USD']
]

const subs = []
markets.forEach(m => {
  rates.forEach(r => {
    subs.push(`2~${m}~${r[0]}~${r[1]}`)
  })
})

let prev = null;

const printUpdate = (value) => {
  let _chalk = chalk.yellow
  let prefix = ''
  if (prev) {
    if (value > prev) {
      _chalk = chalk.green
      prefix = '↑ '
    } else {
      _chalk = chalk.red
      prefix = '↓ '
    }
  }
  console.log(_chalk(`${prefix}${Number(value).toFixed(1)} ${new Date()}`))
  prev = value
}

socket.on('connect', () => {
  console.log(chalk.green('Connected\n============\n'))
  console.log(chalk.white(`Subscribing to ${JSON.stringify(subs, null, 2)}\n============\n`))
  socket.emit('SubAdd', { subs })
})

socket.on('m', (data) => {
  const splitted = data.split('~')
  if (+splitted[0] === 2) {
    const price = splitted[5]
    printUpdate(price)
  }
})

socket.on('disconnect', () => {
  console.log(chalk.red('Disconnected.'))
})

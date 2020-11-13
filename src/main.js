exports.activate = async function (context) {
  require('./commands/index')(context)
}

exports.deactivate = function () {
  console.log('extension deactivate')
}

exports.activate = async function (context) {
  require('./commands/index')(context)
  require('./completion/index')(context)
}

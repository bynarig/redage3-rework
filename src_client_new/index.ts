// Entry point — mirrors src_client/index.js

global.chatActive = false
global.loggedin = false
global.localplayer = mp.players.local
global.localplayer.freezePosition(false)
global.passports = []
global.friends = []
global.binderFunctions = []
global.pAdmin = 0
global.spectating = false
global.sptarget = null
global.ap = false
global.RAYCASTING_FLAGS = { map: 1, vehicles: 2, players: 4, players2: 8, objects: 16, vegetation: 256 }
global.Natives = {}
global.soundApi = {}

let antiFloodCache: Record<string, number> = {}
global.antiFlood = (name, time) => {
  const now = Date.now()
  if ((antiFloodCache[name] ?? 0) > now) return false
  antiFloodCache[name] = now + time
  return true
}

global.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

global.escapeHtml = (str) =>
  String(str).replace(/[&<>"'`=/]/g, (s) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
    "'": '&#39;', '`': '&#x60;', '=': '&#x3D;', '/': '&#x2F;',
  }[s] ?? s))

global.loadModel = (requiredModel) =>
  new Promise(async (resolve) => {
    try {
      if (typeof requiredModel === 'string') requiredModel = mp.game.joaat(requiredModel)
      if (mp.game.streaming.hasModelLoaded(requiredModel as number)) return resolve(true)
      mp.game.streaming.requestModel(requiredModel as number)
      let d = 0
      while (!mp.game.streaming.hasModelLoaded(requiredModel as number)) {
        if (d++ > 5000) return resolve(false)
        await global.wait(0)
      }
      return resolve(true)
    } catch {
      resolve(false)
    }
  })

require('./lang')
require('./debug')
require('./configs/natives')
require('./utils')
require('./constants/controls')
require('./constants/keys')
require('./camera')
require('./animation')
require('./admin')
require('./inventory')
require('./player')
require('./business')
require('./vehicle')
require('./fractions')
require('./house')
require('./world')
require('./casino')
require('./synchronization')
require('./shop')
require('./events')
require('./polygons')
require('./phone')
require('./battlepass')

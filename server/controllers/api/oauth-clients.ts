import * as express from 'express'

import { CONFIG } from '../../initializers'
import { logger } from '../../helpers'
import { database as db } from '../../initializers/database'
import { OAuthClientLocal } from '../../../shared'

const oauthClientsRouter = express.Router()

oauthClientsRouter.get('/local', getLocalClient)

// Get the client credentials for the PeerTube front end
function getLocalClient (req: express.Request, res: express.Response, next: express.NextFunction) {
  const serverHostname = CONFIG.WEBSERVER.HOSTNAME
  const serverPort = CONFIG.WEBSERVER.PORT
  let headerHostShouldBe = serverHostname
  if (serverPort !== 80 && serverPort !== 443) {
    headerHostShouldBe += ':' + serverPort
  }

  // Don't make this check if this is a test instance
  if (process.env.NODE_ENV !== 'test' && req.get('host') !== headerHostShouldBe) {
    logger.info('Getting client tokens for host %s is forbidden (expected %s).', req.get('host'), headerHostShouldBe)
    return res.type('json').status(403).end()
  }

  db.OAuthClient.loadFirstClient()
    .then(client => {
      if (!client) throw new Error('No client available.')

      const json: OAuthClientLocal = {
        client_id: client.clientId,
        client_secret: client.clientSecret
      }
      res.json(json)
    })
    .catch(err => next(err))
}

// ---------------------------------------------------------------------------

export {
  oauthClientsRouter
}

import { Injectable } from '@angular/core'
import { Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'

export interface ResultList {
  data: any[]
  total: number
}

@Injectable()
export class RestExtractor {

  extractDataBool (res: Response) {
    return true
  }

  extractDataList (res: Response) {
    const body = res.json()

    const ret: ResultList = {
      data: body.data,
      total: body.total
    }

    return ret
  }

  extractDataGet (res: Response) {
    return res.json()
  }

  handleError (res: Response) {
    let text = 'Server error: '
    text += res.text()
    let json = ''

    try {
      json = res.json()
    } catch (err) {
      console.error('Cannot get JSON from response.')
    }

    const error = {
      json,
      text
    }

    console.error(error)

    return Observable.throw(error)
  }
}

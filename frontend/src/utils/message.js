import { Notify } from 'quasar'

export function errorMessage(val) {
  if (typeof val === 'string') {
    Notify.create({
      type: 'negative',
      message: val
    })
  }
  try {
    if (typeof val === 'object') {
      for (const i in val) {
        val[i].forEach(item => {
          if (Array.isArray(item)) {
            item.forEach(i => {
              Notify.create({
                type: 'negative',
                message: i
              })
            })
          } else if (typeof item === 'string') {
            Notify.create({
              type: 'negative',
              message: item
            })
          }
        })
      }
    }
  } catch (e) {
    Notify.create({
      type: 'negative',
      message: 'Error'
    })
  }
}

export function successMessage(val) {
  if (typeof val === 'string') {
    Notify.create({
      type: 'positive',
      message: val
    })
  }
  if (typeof val === 'object') {
    for (const i in val) {
      val[i].forEach(item => {
        if (Array.isArray(item)) {
          item.forEach(i => {
            Notify.create({
              type: 'positive',
              message: i
            })
          })
        } else if (typeof item === 'string') {
          Notify.create({
            type: 'positive',
            message: item
          })
        }
      })
    }
  }
}

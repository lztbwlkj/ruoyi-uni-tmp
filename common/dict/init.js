import Vue from 'vue'
import DataDict from './'
import { getDicts } from './Func'

function install() {
  
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          return getDicts(dictMeta.type)
            .then(res => res.data)
        },
      },
    },
  })
}
export default {
  install,
}

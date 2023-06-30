import store from '@/store'
// 有角色
export function hasRole(value) {
  const super_admin = "admin";
  const roles = store.state && store.state.vuex_roles
  
  if (value && value instanceof Array && value.length > 0) {
    const roleFlag = value
    const hasRole = roles.some(role => {
      return super_admin === role || roleFlag.includes(role)
    })
    if (hasRole) {
      return true
    }
  } else {
    throw new Error(`请设置角色权限标签值"`)
  }
  return false
}
// 有权限
export function hasPerimission(value) {
  const all_permission = "*:*:*";
  const permissions = store.state && store.state.vuex_permi
  if (value && value instanceof Array && value.length > 0) {
    const permissionFlag = value
    const hasPermissions = permissions.some(permission => {
      return all_permission === permission || permissionFlag.includes(permission)
    })
    if (hasPermissions) {
      return true
    }
  } else {
    throw new Error(`请设置操作权限标签值`)
  }
  return false
}

// import JSEncrypt from './jsencrypt.min'
// // 密钥对生成 http://web.chacuo.net/netrsakeypair
// const publicKey = '-----BEGIN PUBLIC KEY-----\n' + 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQWxCMFGzB5aMjIL0x31EWrr82\n' + 'S7BRUXcfg3wjehWpSR/njcb62hb/z9AP/LNvhfoFNEuMNz/opJyX8YttxxBCuwWb\n' + '+MLmoFS8U3AtPo0YPNMWdTVEus/EG0CIlXrAAEoOa7hOJILJu3wCh4WLvzCrGC+j\n' + 'uOmS6bVaOnPfPHLN5QIDAQAB\n' + '-----END PUBLIC KEY-----'
// // 加密
// const privateKey = '你看这个干啥?已经追踪到你'
// // 加密
// export function encrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPublicKey(publicKey) // 设置公钥
//   return encryptor.encrypt(txt) // 对数据进行加密
// }
// // 解密
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPrivateKey(privateKey) // 设置私钥
//   return encryptor.decrypt(txt) // 对数据进行解密
// }

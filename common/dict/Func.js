const http = uni.$u.http
// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return http.get('/system/dict/data/type/' + dictType)
}
// 数据合并
export function mergeRecursive(source, target) {
  for (var p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p]);
      } else {
        source[p] = target[p];
      }
    } catch (e) {
      source[p] = target[p];
    }
  }
  return source;
};

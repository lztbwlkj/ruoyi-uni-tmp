

//隐藏部分字符串
export function hideStr(str, frontLen, endLen, zhanweifu = '*') {
	var len = str.length - frontLen - endLen;
	var xing = '';
	for (var i = 0; i < len; i++) {
		xing += zhanweifu;
	}
	return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}

export function toast(title) {
	uni.showToast({
		icon: 'none',
		title: title
	})
}

export function showConfirm(content) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: content,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				resolve(res);
			}
		});
	});
}
export function showActionSheet(content = ['确定', '取消']) {
	return new Promise((resolve, reject) => {
		uni.showActionSheet({
			itemList: content,
			success: function(res) {
				resolve(res)
			},
		});
	})
}

//大于固定字符串显示省略号
export function handleStr(str, length) {
	let handle_str;
	str.length <= length ? handle_str = str : handle_str = str.slice(0, length) + "...";
	return handle_str
}

import _ from 'lodash';
/*
 * 
*/
export function toTree(
  list = [],
  id = 'id',
  parId = 'parId',
  children = 'children',
  defaultId,
) {
  if (list.length === 0) return [];
  const topParId = defaultId || list[0][parId];
  return list.filter(father => {
    const branchArr = list.filter(child => {
      return father[id] == child[parId];
    });
	
    if (branchArr.length > 0) {
      father[children] = branchArr;
    }
    return father[parId] == topParId;
  });
}

/**生成UUID */
export function uuid(len = 16, radix = 12) {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let uuid = [],
		i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) {
			uuid[i] = chars[0 | (Math.random() * radix)];
		}
	} else {
		// rfc4122, version 4 form
		let r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data.  At i==19 set the high bits of clock sequence as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | (Math.random() * 16);
				uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
}

//导出参数拼接
export function qs(obj) {
	const formData = obj || {};
	const arr = [];
	Object.keys(formData).forEach(x => {
		const val = formData[x];
		if (val !== undefined && val !== null) {
			arr.push(`${x}=${encodeURIComponent(formData[x])}`);
		}
	});
	return arr.join('&');
}
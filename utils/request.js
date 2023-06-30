export default function request(config) {
	return new Promise((resolve, reject) => {
		uni.$u.http.request({
			...config,
			header: config.headers || {}
		}).then(res => {
			resolve(res)
		}).catch(e => {
			reject(e)
		})
	})
}
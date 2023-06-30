<template>
	<view>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.value)">
				
				<span :class="item.raw.cssClass" v-if="item.raw.listClass == 'default' || item.raw.listClass == ''" :key="item.value" >{{ item.label }}</span>
				<u-tag v-else :size="size" :text="item.label" :key="item.value"
					:type="item.raw.listClass === 'danger' ? 'error':item.raw.listClass" :class="item.raw.cssClass" />

			</template>
		</template>
	</view>
</template>

<script>
	export default {
		name:'DictTag',
		props: {
			size: {
				type: String,
				default: 'default'
			},
			options: {
				type: Array,
				default: null,
			},
			value: {
				type: [Number, String, Array],
			},
		},
		computed: {
			values() {
				if (this.value !== null && typeof this.value !== 'undefined') {
					return Array.isArray(this.value) ? this.value : [String(this.value)];
				} else {
					return [];
				}
			},
		},
	};
</script>
<style lang="scss" scoped>
	.u-tag+.u-tag {
		margin-left: 10px;
	}
</style>

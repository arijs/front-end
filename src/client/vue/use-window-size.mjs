
export default function useWindowSize(Vue) {
	const apply = () => {
		api.width = window.innerWidth
		api.height = window.innerHeight
	}
	const start = () => {
		apply()
		window.addEventListener('resize', apply, false)
		api.active = true
	}
	const stop = () => {
		window.removeEventListener('resize', apply, false)
		api.active = false
	}
	const useMounted = () => {
		Vue.onMounted(start)
		Vue.onUnmounted(stop)
		return api
	}
	const api = Vue.reactive({
		start,
		stop,
		useMounted,
		width: 0,
		height: 0,
		active: false,
	})
	return api
}

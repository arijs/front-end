<template>
	<div class="slides--example" ref="carFrame"
		v-on:mousedown.prevent="drag.fnStart($event, carFrame, carList)"
		v-on:touchstart="drag.fnStart($event, carFrame, carList)">
		<div class="slides-bt-arrow slides-bt-prev" v-on:click="drag.fnAnimatePrev">
			<svg width="13" height="24" viewBox="0 0 13 24"><g transform="translate(13) rotate(90)"><path d="M23.754.248a.848.848,0,0,0-1.2,0L12.012,10.813,1.447.248a.848.848,0,1,0-1.2,1.2L11.391,12.59a.828.828,0,0,0,.6.248.863.863,0,0,0,.6-.248L23.734,1.447A.831.831,0,0,0,23.754.248Z" fill="#fff"></path></g></svg>
		</div>
		<div class="slides-panel slides-bg1" v-bind:ref="function(el) { carList[0] = el }">
			<div class="page-width slides-content-wrap" ref="carPageWidth">
				<div class="slides-title">
					<h3>
						Slide 1<br/> <strong>example</strong>
					</h3>
					<p>Text text<br/> text text</p>
				</div>
			</div>
		</div>
		<div class="slides-panel slides-bg2" v-bind:ref="function(el) { carList[1] = el }">
			<div class="page-width slides-content-wrap">
				<div class="slides-title">
					<h3>
						Slide 2<br/> <strong>example</strong>
					</h3>
					<p>Text text text text</p>
				</div>
			</div>
		</div>
		<div class="slides-panel slides-bg3" v-bind:ref="function(el) { carList[2] = el }">
			<div class="page-width slides-content-wrap">
				<div class="slides-title">
					<h3>
						Slide 3<br/> text text<br/> <strong>example</strong>
					</h3>
					<p>Text text<br/> text text</p>
				</div>
			</div>
		</div>
		<div class="slides-bt-arrow slides-bt-next" v-on:click="drag.fnAnimateNext">
			<svg width="13" height="24" viewBox="0 0 13 24"><g transform="translate(0,24) rotate(-90)"><path d="M23.754.248a.848.848,0,0,0-1.2,0L12.012,10.813,1.447.248a.848.848,0,1,0-1.2,1.2L11.391,12.59a.828.828,0,0,0,.6.248.863.863,0,0,0,.6-.248L23.734,1.447A.831.831,0,0,0,23.754.248Z" fill="#fff"></path></g></svg>
		</div>
	</div>
</template>

<script setup lang="ts">
import * as Vue from 'vue'
import useSlides from '@arijs/frontend/client/vue/use-slides'

const {
	carFrame,
	carList,
	carPageWidth,
	drag,
} = useSlides(Vue, {
	name: 'slides-example',
	autoSlide: {
		timeWait: 6000,
		timeAnim: 750,
		timeManual: 8000,
	},
})

</script>

<style scoped>
.slides--example {
	position: relative;
	height: 100vh;
	min-height: 416px;
	max-height: 768px;
	overflow: hidden;
}

.slides--example .slides-bt-arrow {
	position: absolute;
	top: 0;
	width: 8vw;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
	align-items: center;
	z-index: 1;
	cursor: pointer;
}
.slides--example .slides-bt-prev {
	left: 0;
}
.slides--example .slides-bt-next {
	right: 0;
}
.slides--example .slides-panel {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
.slides--example .slides-panel {
	background: black none no-repeat 50% 100%;
	background-size: auto 100%;
}
.slides--example .slides-title {
	width: 55%;
	min-width: 560px;
	margin: -1rem 0 0;
	padding: 2rem 1rem 2rem 9.3rem;
	font-size: 1.0em;
	font-weight: 300;
	line-height: 1.4;
	letter-spacing: 0.05em;
	color: white;
	background: rgba(0,0,0,0.65);
	background: #000000a0;
}
.slides--example .slides-title h3 {
	margin: 0 0 0.5em;
	text-transform: uppercase;
	font-size: 1.4em;
	font-weight: 400;
}
.slides--example .slides-title h3 strong {
	font-weight: 700;
}
.slides--example .slides-bg1 {
	background-color: #777;
	border-color: red;
}
.slides--example .slides-bg1 .slides-title {
	width: 47%;
	min-width: 460px;
}
.slides--example .slides-bg1 .slides-title h3 strong {
	color: #ed174d;
}
.slides--example .slides-bg2 {
	background-color: #888;
	border-color: lime;
}
.slides--example .slides-bg2 .slides-title h3 strong {
	color: #0db14b;
}
.slides--example .slides-bg3 {
	background-color: #999;
	border-color: blue;
}
.slides--example .slides-bg3 .slides-title {
	width: 42%;
	min-width: 400px;
}
.slides--example .slides-bg3 .slides-title h3 strong {
	color: #f04e23;
}

</style>

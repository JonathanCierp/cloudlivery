<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
		<linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
			<stop offset=".251" stop-color="#10A3CC"/>
			<stop offset="1" stop-color="#B32EE8"/>
		</linearGradient>
		<circle cx="50" cy="50" r="45" stroke="url(#linearColors)"/>
	</svg>
</template>

<script>
	export default {
		name: "icon-loading"
	}
</script>

<style scoped>
	svg {
		width: 25px;
		height: 25px;
		animation: 2s linear infinite svg-animation;
	}

	@keyframes svg-animation {
		0% {
			-webkit-transform: rotateZ(0deg);
			-ms-transform: rotate(0deg);
			transform: rotateZ(0deg);
		}
		100% {
			-webkit-transform: rotateZ(360deg);
			-ms-transform: rotate(360deg);
			transform: rotateZ(360deg);
		}
	}

	circle {
		-webkit-animation: 1.4s ease-in-out infinite both circle-animation;
		animation: 1.4s ease-in-out infinite both circle-animation;
		display: block;
		fill: transparent;
		stroke-linecap: round;
		stroke-dasharray: 283;
		stroke-dashoffset: 280;
		stroke-width: 10px;
		-webkit-transform-origin: 50% 50%;
		-ms-transform-origin: 50% 50%;
		transform-origin: 50% 50%;
	}

	/* // Circle animation. */
	@-webkit-keyframes circle-animation {
		0%,
		25% {
			stroke-dashoffset: 280;
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		50%,
		75% {
			stroke-dashoffset: 75;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
		}

		100% {
			stroke-dashoffset: 280;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes circle-animation {
		0%,
		25% {
			stroke-dashoffset: 280;
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		50%,
		75% {
			stroke-dashoffset: 75;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
		}

		100% {
			stroke-dashoffset: 280;
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>
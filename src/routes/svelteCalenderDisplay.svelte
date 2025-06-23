<script>  
  
  import { Datepicker } from 'svelte-calendar';
	import 'dayjs/locale/zh-cn.js';
	import 'dayjs/locale/es.js';
	import 'dayjs/locale/ar-dz.js';
	import 'dayjs/locale/he.js';
	import dayjs from 'dayjs';
   import 'dayjs/locale/fi.js';
	import { InlineCalendar, Swappable, themes } from 'svelte-calendar';
	import { onDestroy } from 'svelte';


	let locale = 'fi';

	 dayjs.locale(locale);

	

let format = 'dddd, D,  MMMM, YYYY';

const theme = {
  "calendar": {
    "width": "400px",
    "maxWidth": "100vw",
    "legend": {
      "height": "46px"
    },
    "shadow": "0px 10px 26px rgba(0, 0, 0, 0.25)",
    "colors": {
      "text": {
        "primary": "black",
        "highlight": "#fff"
      },
      "background": {
        "primary": "#fff",
        "highlight": "rgb(40,40,250)",
        "hover": "#eee"
      },
      "border": "#eee"
    },
    "font": {
      "regular": "1.5em",
      "large": "37em"
    },
    "grid": {
      "disabledOpacity": ".35",
      "outsiderOpacity": ".6"
    }
  }
}


</script>
<!-- 
<InlineCalendar {format} {theme} /> -->

<div class="calender-block">
<Datepicker {format} {theme} />
</div>

<style>
  .calender-block {
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100px;
    width: 350px;
    margin: 20px auto;
    border-radius: 10px;

  }
</style>
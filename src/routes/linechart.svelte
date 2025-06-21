<script>
  import { LineChart } from 'layerchart';
  import { motivationval } from './stores';
  import { onMount } from 'svelte';

  import { get } from 'svelte/store';

  let newVal = '';
  let multiSeriesData = [];

  // Update chart data whenever the store changes
  $: $motivationval, multiSeriesData = $motivationval.map((val, index) => {
    const date = new Date();
    date.setDate(date.getDate() - ($motivationval.length - 1 - index));
    return {
      date,
      studymot: val
    };
  });

  function addMot() {
    const number = parseFloat(newVal);
    if (!isNaN(number)) {
      motivationval.update(curr => [...curr, number]);
      newVal = '';
    }
  }

  function handleEnter(event) {
    if (event.key === 'Enter') {
      addMot();
    }
  }
</script>

<div class="data">
  <div class="h-[300px] p-4 border rounded">
    <LineChart
      data={multiSeriesData}
      x="date"
      series={[{ key: "studymot", color: "#3b82f6" }]}
    />
  </div>

  <input
    type="number"
    bind:value={newVal}
    on:keypress={handleEnter}
    placeholder="Anna numero"
    class="text-center"
  />
</div>

<style>
  .data {
    width: 700px;
    height: 320px;
    background-color: #f3f4f5;
    padding: 10px;
    border-radius: 10px;
  }

  .data :global(svg path),
  .data :global(svg .area),
  .data :global(svg .mark-line),
  .data :global(svg .mark-area) {
    fill: none !important;
  }

  .data :global(svg .line) {
    stroke-width: 2px !important;
    stroke: #3b82f6 !important;
  }

  .data :global(svg text),
  .data :global(svg .axis text) {
    fill: #374151 !important;
    font-size: 12px;
  }

  .data :global(svg .axis line),
  .data :global(svg .tick line) {
    stroke: #d1d5db !important;
  }

  .data :global(svg rect:not(.background)) {
    fill: var(--bar-color, #3b82f6) !important;
  }
</style>
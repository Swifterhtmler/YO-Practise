<script>
  import { BarChart, LineChart } from 'layerchart';

  const dateSeriesData = [
    { date: new Date('2025-06-11'), value: 68 },
    { date: new Date('2025-06-12'), value: 32 },
    { date: new Date('2025-06-13'), value: 30 },
    { date: new Date('2025-06-14'), value: 90 },
    { date: new Date('2025-06-15'), value: 20 },
  ];

  const multiSeriesData = [
    { date: new Date('2025-06-11'), apples: 53, bananas: 11, oranges: 54 },
    { date: new Date('2025-06-12'), apples: 60, bananas: 79, oranges: 65 },
    { date: new Date('2025-06-13'), apples: 41, bananas: 35, oranges: 99 },
    { date: new Date('2025-06-14'), apples: 13, bananas: 73, oranges: 42 },
    { date: new Date('2025-06-15'), apples: 96, bananas: 41, oranges: 74 },
  ];

  function colorForValue(v) {
    return v > 75 ? '#2c7a7b'
         : v > 50 ? '#4fd1c5'
         : v > 25 ? '#f6e05e'
         : '#e53e3e';
  }
</script>

  <div class="data">
    <!-- <h2 class="text-xl font-semibold mb-4 text-center">Oppiaineiden opiskelutahti</h2> -->
    <div class="h-[300px] p-4 border rounded">
      <LineChart
        data={multiSeriesData}
        x="date"
        series={[
          { key: "apples", color: "#3b82f6" },
          { key: "bananas", color: "#eab308" },
          { key: "oranges", color: "#22c55e" },
        ]}
      />
    </div>
  </div>
  
<style>
 
  

  .data :global(svg path) {
    fill: none !important;
  }
  

  .data :global(svg .area) {
    fill: none !important;
  }
  

  .data :global(svg text) {
    fill: currentColor !important;
    color: #374151;
  }
  

  .data :global(svg .axis line) {
    stroke: #d1d5db !important;
  }
  

  .data :global(svg .grid line) {
    stroke: #f3f4f6 !important;
  }
  
 
  .data :global(svg rect:not(.background)) {
    fill: var(--bar-color, #3b82f6) !important;
  }
  

  .data :global(svg .line) {
    fill: none !important;
    stroke-width: 2px !important;
  }
  
 
  .data :global(svg .mark-line) {
    fill: none !important;
  }
  
  .data :global(svg .mark-area) {
    fill: none !important;
  }
  
 
  .data :global(svg .axis text) {
    fill: #374151 !important;
    font-size: 12px;
  }
  

  .data :global(svg .tick line) {
    stroke: #9ca3af !important;
  }

  .data {
   width: 700px;
   height: 320px;
   background-color: #f3f4f5;
   padding: 10px;
   border-radius: 10px;
  }
</style>

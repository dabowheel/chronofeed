<template>
  <div id="entryData">
  </div>
  <div>{{entry.date | moment}}</div>
</template>

<script>
  export default {
    props: ["log", "index", "entry"],
    ready: function () {
    }
  };
</script>

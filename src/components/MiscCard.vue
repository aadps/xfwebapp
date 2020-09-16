<template>
  <v-card class="ma-3 pa-6 elevation-3" outlined tile>
    {{ device.name }}
  </v-card>
</template>

<script>
export default {
  name: "MiscCard",

  props: {
    device: Object
  }
};
</script>

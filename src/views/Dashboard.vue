<template>
  <v-container class="fill-height" fluid>
    <v-row align="start" justify="start" class="px-6" style="height: 100%;">
      <draggable
        v-model="routeDevices"
        group="devices"
        @end="
          $store.dispatch('setOrder', {
            type: $route.name,
            order: routeDevices
          })
        "
        class="row wrap"
      >
        <v-col
          v-for="device in routeDevices"
          cols="6"
          xl="2"
          lg="3"
          md="4"
          :key="device.id"
        >
          <template v-if="$route.name === 'wsdcg'">
            <WsdcgCard :device="device"></WsdcgCard>
          </template>
          <template v-else-if="$route.name === 'pir'">
            <PirCard :device="device"></PirCard>
          </template>
          <template v-else-if="$route.name === 'sos'">
            <SosCard :device="device"></SosCard>
          </template>
          <template v-else-if="$route.name === 'cl'">
            <ClCard :device="device"></ClCard>
          </template>
          <template v-else-if="$route.name === 'sj'">
            <SjCard :device="device"></SjCard>
          </template>
          <template v-else-if="$route.name === 'smd'">
            <SmdCard :device="device"></SmdCard>
          </template>
          <template v-else>
            <MiscCard :device="device"></MiscCard>
          </template>
        </v-col>
      </draggable>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import MiscCard from "../components/MiscCard.vue";
import WsdcgCard from "../components/WsdcgCard.vue";
import PirCard from "../components/PirCard.vue";
import SosCard from "../components/SosCard.vue";
import ClCard from "../components/ClCard.vue";
import SjCard from "../components/SjCard.vue";
import SmdCard from "../components/SmdCard.vue";

export default {
  name: "Dashboard",

  components: {
    draggable,
    MiscCard,
    WsdcgCard,
    PirCard,
    SosCard,
    ClCard,
    SjCard,
    SmdCard
  },

  data: () => ({
    routeDevices: []
  }),

  props: {
    devices: Array,
    homes: Object
  },

  created() {
    this.getRouteDevices();
  },

  methods: {
    getRouteDevices() {
      this.routeDevices = [];
      if (this.$route.name === "misc") {
        for (var i in this.devices) {
          if (
            this.devices[i].category !== "cl" &&
            this.devices[i].category !== "wsdcg" &&
            this.devices[i].category !== "sos" &&
            this.devices[i].category !== "pir" &&
            this.devices[i].category !== "sj" &&
            this.devices[i].category !== "smd"
          ) {
            this.routeDevices.push(this.devices[i]);
          }
        }
      } else
        for (var j in this.devices) {
          if (this.devices[j].category === this.$route.name) {
            //排除运动传感器
            if (
              this.devices[j].category === "pir" &&
              this.devices[j].status.length > 1
            )
              continue;

            this.$set(this.devices[j], "fullname", this.devices[j].name);
            if (this.homes[this.devices[j].owner_id]){
              this.$set(
                this.devices[j],
                "fullname",
                this.homes[this.devices[j].owner_id] +
                  "+" +
                  this.devices[j].name
              );
              this.devices[j].home = this.homes[this.devices[j].owner_id];
            }
            else setTimeout(this.getRouteDevices, 500);
            this.routeDevices.push(this.devices[j]);
          }
        }

      if (this.$store.state.pref.order[this.$route.name]) {
        var order = this.$store.state.pref.order[this.$route.name];
        var pos = 0;
        for (var k in order) {
          for (var l = pos; l < this.routeDevices.length; l++) {
            if (order[k] === this.routeDevices[l].id) {
              var t = this.routeDevices[pos];
              this.routeDevices[pos] = this.routeDevices[l];
              this.routeDevices[l] = t;
              pos++;
              continue;
            }
          }
        }
      }
    }
  },

  watch: {
    devices() {
      this.getRouteDevices();
    }
  }
};
</script>

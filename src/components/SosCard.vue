<template>
  <v-card class="elevation-3" tile>
    <v-responsive :aspect-ratio="1 / 0.618">
      <v-container fill-height class="pa-0">
        <v-row style="height: 100%;">
          <v-col cols="6" class="py-0 ml-3">
            <v-text-field
              v-model="alias"
              dense
              hide-details
              :placeholder="device.fullname"
              maxlength="8"
              @blur="$store.dispatch('setPreferences')"
              single-line
              :class="alias && 'noline'"
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-text-field
              v-model="person"
              dense
              hide-details
              placeholder="姓名"
              maxlength="4"
              @blur="$store.dispatch('setPreferences')"
              single-line
              :class="person && 'noline'"
            ></v-text-field>
          </v-col>

          <v-row align="center" justify="center">
            <v-col cols="3">
              <v-img :src="image" contain></v-img>
            </v-col>
          </v-row>

          <v-col align-self="end" cols="12" class="pa-0">
            <v-card :color="color" outlined tile>
              <template v-if="this.status === 1">
                <v-row justify="center" no-gutters style="color: white;">
                  <v-col cols="4"></v-col>
                  <v-col cols="2" style="text-align: center;">{{ text }}</v-col>
                  <v-col cols="4" style="text-align: center;">
                    <v-btn depressed small @click="clear">
                      解除
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-row justify="center" no-gutters style="color: white;">
                  <v-col cols="3"></v-col>
                  <v-col cols="3" style="text-align: center;">{{ text }}</v-col>
                  <v-col cols="3"></v-col>
                </v-row>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-card>
</template>

<script>
export default {
  name: "SosCard",

  data: () => ({
    status: 0
  }),

  props: {
    device: Object
  },

  methods: {
    update() {
      if (!this.device.online) {
        this.status = 2;
        return;
      }
      var clear = -1;
      var p = this.$store.state.pref.devicePref;
      if (p[this.device.id] && p[this.device.id].clear)
        clear = p[this.device.id].clear;
      if (this.device.sos && this.device.sos > clear) this.status = 1;
      else if (this.batt < 5) this.status = 9;
      else this.status = 0;
    },

    clear() {
      var p = this.$store.state.pref.devicePref;
      if (!p[this.device.id]) p[this.device.id] = {};
      p[this.device.id].clear = Date.now();
      this.$store.dispatch("setDevicePref", p);
      this.status = 0;
    }
  },

  created() {
    this.update();
  },

  watch: {
    device() {
      this.update();
    }
  },

  computed: {
    batt() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "battery_percentage")
          return parseInt(this.device.status[i].value);
      return 0;
    },

    text() {
      switch (this.status) {
        case 0:
          return "安全";
        case 2:
          return "离线";
        case 1:
          return "报警";
        case 9:
          return "电量不足";
        default:
          return "";
      }
    },

    color() {
      switch (this.status) {
        case 0:
          return this.$green;
        case 2:
          return this.$gray;
        case 1:
          return this.$red;
        case 9:
          return this.$yellow;
        default:
          return this.$gray;
      }
    },

    image() {
      switch (this.status) {
        case 0:
          return require("@/assets/sos.png");
        case 1:
          return require("@/assets/sos-alarm.png");
        case 9:
          return require("@/assets/lowbatt.png");
        default:
          return require("@/assets/sos-off.png");
      }
    },

    alias: {
      get() {
        var p = this.$store.state.pref.devicePref;
        if (p[this.device.id] && p[this.device.id].alias) {
          return p[this.device.id].alias;
        }
        return "";
      },
      set(value) {
        var p = this.$store.state.pref.devicePref;
        if (!p[this.device.id]) p[this.device.id] = {};
        p[this.device.id].alias = value;
        this.$store.commit("setDevicePref", p);
      }
    },

    person: {
      get() {
        var p = this.$store.state.pref.devicePref;
        if (p[this.device.id] && p[this.device.id].person) {
          return p[this.device.id].person;
        }
        return "";
      },
      set(value) {
        var p = this.$store.state.pref.devicePref;
        if (!p[this.device.id]) p[this.device.id] = {};
        p[this.device.id].person = value;
        this.$store.commit("setDevicePref", p);
      }
    }
  }
};
</script>

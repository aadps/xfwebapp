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
              <v-row justify="center" no-gutters style="color: white;">
                <v-col cols="3"> </v-col>
                <v-col cols="3" style="text-align: center;">{{ text }}</v-col>
                <v-col cols="3" style="text-align: right;">{{ text2 }}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-card>
</template>

<script>
export default {
  name: "SjCard",

  data: () => ({
    status: 0
  }),

  methods: {
    update() {
      if (!this.device.online) {
        this.status = 2;
        return;
      }
      this.status = 0;
      if (this.batt < 5) this.status = 9;
      for (var i in this.device.status)
        if (
          this.device.status[i].code === "watersensor_state" &&
          this.device.status[i].value === "1"
        )
          this.status = 1;
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

  props: {
    device: Object
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
          return "舒适";
        case 2:
          return "离线";
        case 1:
          return "失禁";
        case 9:
          return "电量不足";
        default:
          return "";
      }
    },

    text2() {
      if (this.device.sj && this.status === 1)
        return parseInt((Date.now() - this.device.sj) / 1000 / 60) + "分钟";
      return "";
    },

    image() {
      switch (this.status) {
        case 0:
          return require("@/assets/sj.png");
        case 1:
          return require("@/assets/sj-alarm.png");
        case 9:
          return require("@/assets/lowbatt.png");
        default:
          return require("@/assets/sj-off.png");
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

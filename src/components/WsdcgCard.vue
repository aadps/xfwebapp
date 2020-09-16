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

          <v-row align="center" justify="center">
            <v-col cols="3" style="text-align: center;">
              <v-img :src="imageTemp" contain></v-img>
              <div class="mt-2">{{ temp }}°C</div>
            </v-col>
            <v-col cols="1"></v-col>
            <v-col cols="3" style="text-align: center;">
              <v-img :src="imageHum" contain></v-img>
              <div class="mt-2">{{ hum }}%</div>
            </v-col>
          </v-row>

          <v-col align-self="end" cols="12" class="pa-0">
            <v-card :color="color" outlined tile>
              <div style="color:white; text-align: center;">
                {{ text }}
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-card>
</template>

<script>
export default {
  name: "WsdcgCard",

  data: () => ({
    status: 0,
    tempAlarm: false,
    humAlarm: false
  }),

  methods: {
    update() {
      if (!this.device.online) {
        this.status = 2;
        return;
      }
      this.status = 0;
      if (this.batt < 5) this.status = 9;
      this.tempAlarm = false;
      this.humAlarm = false;
      var p = this.$store.state.pref.userPref;
      if (
        (p.ltemp && p.ltemp > this.temp) ||
        (p.htemp && p.htemp < this.temp)
      ) {
        this.status = 1;
        this.tempAlarm = true;
      }
      if ((p.lhum && p.lhum > this.hum) || (p.hhum && p.hhum < this.hum)) {
        this.status = 1;
        this.humAlarm = true;
      }
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
    temp() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "va_temperature")
          return parseFloat(this.device.status[i].value) / 100;
      return 0;
    },

    hum() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "va_humidity")
          return parseFloat(this.device.status[i].value) / 100;
      return 0;
    },

    batt() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "va_battery")
          return parseInt(this.device.status[i].value);
      return 0;
    },

    text() {
      switch (this.status) {
        case 0:
          return "正常";
        case 2:
          return "离线";
        case 1:
          if (this.tempAlarm && this.humAlarm) return "温湿度异常";
          if (this.tempAlarm) return "温度异常";
          return "湿度异常";
        case 9:
          return "电量不足";
        default:
          return "";
      }
    },

    imageTemp() {
      if (this.status === 2) return require("@/assets/temp-off.png");
      if (this.tempAlarm) return require("@/assets/temp-alarm.png");
      if (this.status === 9) return require("@/assets/lowbatt.png");
      return require("@/assets/temp.png");
    },

    imageHum() {
      if (this.status === 2) return require("@/assets/hum-off.png");
      if (this.humAlarm) return require("@/assets/hum-alarm.png");
      if (this.status === 9) return require("@/assets/lowbatt.png");
      return require("@/assets/hum.png");
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
    }
  }
};
</script>

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
          <v-col cols="4" class="py-0 mt-2">{{ text2 }}</v-col>

          <v-row align="center" justify="center">
            <v-col cols="3">
              <v-img :src="image" contain></v-img>
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
  name: "ClCard",

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
      for (var i in this.device.status)
        if (
          this.device.status[i].code === "position" &&
          this.device.status[i].value === "100"
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
    text() {
      switch (this.status) {
        case 0:
          return "窗帘打开";
        case 1:
          return "窗帘关闭";
        default:
          return "离线";
      }
    },

    text2() {
      if (this.status === 2) return "";
      for (var i in this.device.status)
        if (this.device.status[i].code === "position")
          return "状态 " + this.device.status[i].value + "%";
      return "";
    },

    image() {
      switch (this.status) {
        case 0:
          return require("@/assets/cl.png");
        case 1:
          return require("@/assets/cl-alarm.png");
        default:
          return require("@/assets/cl-off.png");
      }
    },

    color() {
      switch (this.status) {
        case 0:
          return this.$green;
        case 1:
          return this.$black;
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

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
  name: "PirCard",

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
      var p = this.$store.state.pref.userPref;
      for (var i in this.device.status)
        if (this.device.status[i].value === "pir")
          if (
            p.duration &&
            (Date.now() - this.device.pir) / 1000 / 60 > p.duration
          ) {
            this.status = 1;
            return;
          }
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
    text() {
      switch (this.status) {
        case 0:
          return "安全";
        case 1:
          return "超时";
        default:
          return "离线";
      }
    },

    color() {
      switch (this.status) {
        case 0:
          return this.$green;
        case 1:
          return this.$red;
        default:
          return this.$gray;
      }
    },

    image() {
      switch (this.status) {
        case 0:
          return require("@/assets/pir.png");
        case 1:
          return require("@/assets/pir-alarm.png");
        default:
          return require("@/assets/pir-off.png");
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

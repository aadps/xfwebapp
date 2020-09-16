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
            <v-col cols="6" class="tiny">
              正常范围<br />
              心率：<v-text-field
                v-model="lheart"
                dense
                hide-details
                maxlength="3"
                @blur="$store.dispatch('setPreferences')"
                single-line
                :class="alias && 'noline'"
                class="centered-input"
                style="width: 15%; display: inline-block; margin-top: 0;"
              ></v-text-field>
              -
              <v-text-field
                v-model="hheart"
                dense
                hide-details
                maxlength="3"
                @blur="$store.dispatch('setPreferences')"
                single-line
                :class="alias && 'noline'"
                class="centered-input"
                style="width: 18%; display: inline-block; margin-top: 0;"
              ></v-text-field>
              次/分<br />
              呼吸率：<v-text-field
                v-model="lresp"
                dense
                hide-details
                maxlength="3"
                @blur="$store.dispatch('setPreferences')"
                single-line
                :class="alias && 'noline'"
                class="centered-input"
                style="width: 12%; display: inline-block; margin-top: 0;"
              ></v-text-field>
              -
              <v-text-field
                v-model="hresp"
                dense
                hide-details
                maxlength="2"
                @blur="$store.dispatch('setPreferences')"
                single-line
                :class="alias && 'noline'"
                class="centered-input"
                style="width: 12%; display: inline-block; margin-top: 0;"
              ></v-text-field>
              次/分
            </v-col>
          </v-row>

          <v-col align-self="end" cols="12" class="pa-0">
            <v-card :color="color" outlined tile>
              <v-row justify="center" no-gutters style="color: white;">
                <v-col cols="4">{{ text2 }}</v-col>
                <v-col cols="2" style="text-align: center;">{{ text }}</v-col>
                <v-col cols="4" style="text-align: right;">{{ text3 }}</v-col>
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
  name: "SmdCard",

  data: () => ({
    status: 0
  }),

  methods: {
    update() {
      if (!this.device.online) {
        this.status = 2;
        return;
      }
      for (var i in this.device.status)
        if (
          this.device.status[i].code === "wakeup" &&
          this.device.status[i].value === "true"
        ) {
          this.status = 3;
          return;
        }

      this.status = 0;

      if (
        this.getDevicePref("lheart") &&
        this.getDevicePref("lheart") > this.heart
      )
        this.status = 1;
      if (
        this.getDevicePref("hheart") &&
        this.getDevicePref("hheart") < this.heart
      )
        this.status = 1;
      if (
        this.getDevicePref("lresp") &&
        this.getDevicePref("lresp") > this.resp
      )
        this.status = 1;
      if (
        this.getDevicePref("hresp") &&
        this.getDevicePref("hresp") < this.resp
      )
        this.status = 1;
    },

    getDevicePref(prop) {
      var p = this.$store.state.pref.devicePref;
      if (!p[this.device.id]) return "";
      return p[this.device.id][prop];
    },

    setDevicePref(prop, value) {
      var p = this.$store.state.pref.devicePref;
      if (!p[this.device.id]) p[this.device.id] = {};
      p[this.device.id][prop] = value;
      this.$store.commit("setDevicePref", p);
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
    heart() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "heart_rate")
          return parseInt(this.device.status[i].value);
      return 0;
    },

    resp() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "respiratory_rate")
          return parseInt(this.device.status[i].value);
      return 0;
    },

    score() {
      for (var i in this.device.status)
        if (this.device.status[i].code === "data_all_night")
          return this.device.status[i].value;
      return 0;
    },

    text() {
      switch (this.status) {
        case 0:
        case 1:
          return "在床";
        case 3:
          return "离床";
        default:
          return "离线";
      }
    },

    text2() {
      if (this.status === 0 || this.status === 1) return "心率 " + this.heart;
      return "";
    },

    text3() {
      if (this.status === 0 || this.status === 1) return " 呼吸率 " + this.resp;
      return "";
    },

    image() {
      switch (this.status) {
        case 0:
          return require("@/assets/smd.png");
        case 1:
          return require("@/assets/smd-alarm.png");
        case 3:
          return require("@/assets/smd-away.png");
        default:
          return require("@/assets/smd-off.png");
      }
    },

    color() {
      switch (this.status) {
        case 0:
          return this.$green;
        case 1:
          return this.$red;
        case 3:
          return this.$blue;
        default:
          return this.$gray;
      }
    },

    alias: {
      get() {
        return this.getDevicePref("alias");
      },
      set(value) {
        this.setDevicePref("alias", value);
      }
    },

    person: {
      get() {
        return this.getDevicePref("person");
      },
      set(value) {
        this.setDevicePref("person", value);
      }
    },

    lheart: {
      get() {
        return this.getDevicePref("lheart");
      },
      set(value) {
        this.setDevicePref("lheart", value);
        this.update();
      }
    },

    hheart: {
      get() {
        return this.getDevicePref("hheart");
      },
      set(value) {
        this.setDevicePref("hheart", value);
        this.update();
      }
    },

    lresp: {
      get() {
        return this.getDevicePref("lresp");
      },
      set(value) {
        this.setDevicePref("lresp", value);
        this.update();
      }
    },

    hresp: {
      get() {
        return this.getDevicePref("hresp");
      },
      set(value) {
        this.setDevicePref("hresp", value);
        this.update();
      }
    }
  }
};
</script>

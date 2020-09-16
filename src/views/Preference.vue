<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-text-field
          v-model="ltemp"
          label="温度下限"
          outlined
          shaped
          suffix="°C"
          type="number"
          min="0"
          max="50"
          @blur="$store.dispatch('setPreferences')"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-text-field
          v-model="htemp"
          label="温度上限"
          outlined
          shaped
          suffix="°C"
          type="number"
          min="0"
          max="50"
          @blur="$store.dispatch('setPreferences')"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-text-field
          v-model="lhum"
          label="湿度下限"
          outlined
          shaped
          suffix="%"
          type="number"
          min="0"
          max="99"
          @blur="$store.dispatch('setPreferences')"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-text-field
          v-model="hhum"
          label="湿度上限"
          outlined
          shaped
          suffix="%"
          type="number"
          min="0"
          max="99"
          @blur="$store.dispatch('setPreferences')"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" lg="3">
        <v-text-field
          v-model="duration"
          label="久留时限"
          outlined
          shaped
          suffix="分钟"
          type="number"
          min="1"
          max="99"
          @blur="$store.dispatch('setPreferences')"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Preference",

  methods: {
    getUserPref(prop) {
      var p = this.$store.state.pref.userPref;
      return p[prop];
    },

    setUserPref(prop, value) {
      var p = this.$store.state.pref.userPref;
      p[prop] = value;
      this.$store.commit("setUserPref", p);
    }
  },

  computed: {
    ltemp: {
      get() {
        return this.getUserPref("ltemp");
      },
      set(value) {
        this.setUserPref("ltemp", value);
      }
    },
    htemp: {
      get() {
        return this.getUserPref("htemp");
      },
      set(value) {
        this.setUserPref("htemp", value);
      }
    },
    lhum: {
      get() {
        return this.getUserPref("lhum");
      },
      set(value) {
        this.setUserPref("lhum", value);
      }
    },
    hhum: {
      get() {
        return this.getUserPref("hhum");
      },
      set(value) {
        this.setUserPref("hhum", value);
      }
    },
    duration: {
      get() {
        return this.getUserPref("duration");
      },
      set(value) {
        this.setUserPref("duration", value);
      }
    }
  }
};
</script>

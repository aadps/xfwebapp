<template>
  <v-app>
    <v-navigation-drawer v-model="fullClient" color="primary" dark app>
      <v-list dense nav class="py-0">
        <v-list-item two-line class="miniVariant px-0">
          <v-img src="@/assets/logo.png" contain></v-img>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item key="preference" link to="/pref">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>用户报警设置</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app v-model="fullClient" color="primary" dark>
      <v-toolbar-title>智慧养老</v-toolbar-title>

      <v-spacer></v-spacer>

      <div>wxcare</div>
    </v-app-bar>

    <v-main>
      <router-view
        :devices="devices"
        :homes="homes"
        :key="$route.fullPath"
      ></router-view>
    </v-main>
  </v-app>
</template>

<style>
.v-card,
.v-card input {
  font-size: smaller;
}

.v-card .tiny {
  font-size: x-small;
}

.v-card .v-btn.v-size--small {
  font-size: 10px !important;
}

.v-btn:not(.v-btn--round).v-size--small {
  height: 18px !important;
}

.centered-input input {
  text-align: center;
}

.v-card input::placeholder {
  color: #444 !important;
}

.v-application {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB",
    "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei" !important;
}

.noline.v-text-field > .v-input__control > .v-input__slot:before,
.noline.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}

.noline.v-text-field:hover > .v-input__control > .v-input__slot:before,
.noline.v-text-field:hover > .v-input__control > .v-input__slot:after {
  border-style: solid;
}
</style>

<script>
import axios from "axios";

export default {
  name: "App",

  components: {},

  data: () => ({
    menuItems: [
      { title: "智能尿裤", link: "/sj", icon: "mdi-hand-wash" },
      { title: "睡眠监测", link: "/smd", icon: "mdi-bed" },
      { title: "智能窗帘", link: "/cl", icon: "mdi-view-array" },
      { title: "智能窗户", link: "/", icon: "mdi-window-closed-variant" },
      { title: "温湿度检测", link: "/wsdcg", icon: "mdi-thermometer" },
      { title: "SOS报警", link: "/sos", icon: "mdi-alert-circle" },
      { title: "卫生间久留报警", link: "/pir", icon: "mdi-toilet" },
      { title: "其他设备", link: "/", icon: "mdi-dots-horizontal" }
    ],
    devices: [],
    homes: {},
    timer: ""
  }),

  created() {
    this.fetchDevices();
    this.timer = setInterval(this.fetchDevices, 30000);
    this.$store.dispatch("getPreferences");
  },

  methods: {
    fetchDevices() {
      var url = this.$api + "/User.getDevices";
      if(this.$route.query.userId)
        url += "?userId=" + this.$route.query.userId + "&homeId=" + this.$route.query.homeId;

      axios
        .get(url)
        .then(response => {
          this.devices = response.data.data;

/*          var i;
          var hid = [];
          for (i in this.devices) {
            hid.push(this.devices[i].owner_id);
          }
          var distinctHid = [...new Set(hid)];*/

          if(this.$route.query.homeId){
            axios
              .get(this.$api + "/Home.get?homeId=" + this.$route.query.homeId)
              .then(response => {
                this.homes[response.data.data.result.home_id] = response.data.data.result.name;
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    cancelAutoUpdate() {
      clearInterval(this.timer);
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  computed: {
    fullClient() {
      if(this.$route.query.userId)return false;
      else return true;
    }
  }
};
</script>

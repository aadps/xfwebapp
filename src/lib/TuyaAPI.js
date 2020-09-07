const CryptoJS = require("crypto-js");
const HmacSHA256 = CryptoJS.HmacSHA256;
const request = require("request-promise");
const memoryCache = require("memory-cache");

// ;(async function() {
//   const tuyaAPI = new TuyaAPI()

//   const accessToken = await tuyaAPI._getAccessToken()
//   console.log(accessToken)

//   console.time('1')
//   await tuyaAPI.getUsers()
//   console.timeEnd('1')

// })().catch(console.error)

class TuyaAPI {
  constructor() {
    this.url = "https://openapi.tuyacn.com";
    this.client_id = "e9fy7sqxp5snyjv3drvu";
    this.secret = "8r84jra7f7eqsqp5d77has9pxey5m7p8";
    this.schema = "xinfuzhinengsmart";
  }

  async _signefore(t) {
    return HmacSHA256(this.client_id + t, this.secret)
      .toString()
      .toUpperCase();
  }

  async _signAfter(accessToken, t) {
    return HmacSHA256(this.client_id + accessToken + t, this.secret)
      .toString()
      .toUpperCase();
  }

  async _getBeforeHeaders() {
    const t = Date.now();
    return {
      client_id: this.client_id,
      t,
      sign_method: "HMAC-SHA256",
      sign: await this._signBefore(t)
    };
  }

  async _getAfterHeaders() {
    const t = Date.now();
    const accessToken = await this._getAccessToken();
    return {
      client_id: this.client_id,
      t,
      sign_method: "HMAC-SHA256",
      sign: await this._signAfter(accessToken, t),
      access_token: accessToken
    };
  }

  async _getAccessToken() {
    let accessToken = memoryCache.get("accessToken");
    if (accessToken) {
      return accessToken;
    }

    const result = await request(this.url + "/v1.0/token?grant_type=1", {
      json: true,
      headers: await this._getBeforeHeaders()
    });

    if (!result.success) {
      throw new Error(result.msg);
    }
    accessToken = result.result.access_token;

    memoryCache.put(
      "accessToken",
      accessToken,
      result.result.expire_time * 1000
    );

    return accessToken;
  }

  async request(method, originalUrl, body) {
    const result = await request(this.url + originalUrl, {
      method,
      json: true,
      headers: await this._getAfterHeaders(),
      body
    });

    return result;
  }

  async getUsers(page = 1, size = 30) {
    const result = await request(
      this.url +
        `/v1.0/apps/${this.schema}/users?page_no=${page}&page_size=${size}`,
      {
        json: true,
        headers: await this._getAfterHeaders()
      }
    );

    return result;
  }

  async getDeviceInfo(devId) {
    const result = await request(this.url + `/v1.0/devices/${devId}`, {
      json: true,
      headers: await this._getAfterHeaders()
    });

    return result;
  }

  // 获取红外设备下⾯绑定的遥控器列表
  async getInfraredsRemotes(devId) {
    const result = await request(
      this.url + `/v1.0/infrareds/${devId}/remotes`,
      {
        json: true,
        headers: await this._getAfterHeaders()
      }
    );

    return result;
  }

  // 获取万能遥控器下的子设备的控制指令
  async getInfraredsBrandsRemotesRules(
    devId,
    categoryId,
    brandId,
    remoteIndex
  ) {
    const result = await request(
      this.url +
        `/v1.0/infrareds/${devId}/categories/${categoryId}/brands/${brandId}/remotes/${remoteIndex}/rules`,
      {
        json: true,
        headers: await this._getAfterHeaders()
      }
    );

    return result;
  }

  // 根据配对规则的key来下发红外码
  async sendKeys(devId, remoteIndex, key) {
    const result = await request.post(
      this.url + `/v1.0/infrareds/${devId}/send-keys`,
      {
        json: true,
        body: {
          remote_index: remoteIndex,
          key
        },
        headers: await this._getAfterHeaders()
      }
    );

    return result;
  }

  // 开门锁
  async openDoor(devId, encryptPassword) {
    const result = await request.post(
      this.url + `/v1.0/devices/${devId}/door-lock/open-door`,
      {
        json: true,
        body: {
          password: encryptPassword
        },
        headers: await this._getAfterHeaders()
      }
    );

    return result;
  }
}

module.exports = TuyaAPI;

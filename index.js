/* eslint-disable semi */
const { open } = require('powercord/modal')
const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { getModule, channels, messages, React, constants: { Permissions } } = require('powercord/webpack')

const channelObj = getModule(['getChannel', 'getDMFromUserId'], false)

const Modal = require('./components/modal.jsx')

module.exports = class warnAllMessages extends Plugin {
  async startPlugin() {
    this._injectMessageSent()
    await this.import('getCurrentUser')
  }

  _injectMessageSent() {
    inject('warnAllMessages', messages, 'sendMessage', (args) => {
      if (!args[1]?.__DNSM_afterWarn) {
        open(() => React.createElement(Modal, {
          channel: channels.getChannelId(),
          message: args[1]
        }));
        return false;
      }
      return args;
    }, true);
  }

  cooldownTime() {
    const channel = channels.getChannelId();
    return channelObj.getChannel(channel).rateLimitPerUser
  }

  async import(filter, functionName = filter) {
    if (typeof filter === 'string') {
      filter = [filter];
    }
    this[functionName] = (await getModule(filter))[functionName];
  }

  pluginWillUnload() {
    uninject('warnAllMessages')
    powercord.api.settings.unregisterSettings('DNSM!')
  }
}

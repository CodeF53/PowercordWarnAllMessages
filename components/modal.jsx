const { React, getModule } = require('powercord/webpack')
const { close: closeModal } = require('powercord/modal')
const { Modal } = require('powercord/components/modal')
const { FormTitle, Card, Text, Button } = require('powercord/components')

const { sendMessage } = getModule([ 'sendMessage' ], false)
const { ComponentDispatch } = getModule([ 'ComponentDispatch' ], false)

module.exports = ({ slowmode, channel, message }) =>
  <Modal size={ Modal.Sizes.SMALL }>
    <Modal.Header>
      <FormTitle tag="h3">WARNING!</FormTitle>
      <Modal.CloseButton onClick={ closeModal } />
    </Modal.Header>
    <Modal.Content>
      <Card>
        <h1>Do you actually want to send this message? In this channel? Now?</h1>
      </Card>
    </Modal.Content>
    <Modal.Footer>
      <Button
        style={{ marginRight: '10px' }}
        onClick={ () => {
          closeModal();
          sendMessage(channel, { ...message, __DNSM_afterWarn: true }) 
        }}
        color={ Button.Colors.RED }>
      Send
      </Button>
      <Button
        style={{ marginRight: '10px' }}
        onClick={ () => {
          closeModal();
          ComponentDispatch.dispatchToLastSubscribed("INSERT_TEXT", {
            plainText: message.content
          });
        } }
        color={ Button.Colors.GREEN }>
      Cancel
      </Button>
    </Modal.Footer>
  </Modal>

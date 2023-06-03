const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, AttachmentBuilder} = require("discord.js");
const {footer} = require("../footer.js")
const Canvas = require('canvas');
const {registerFont, createCanvas} = require('canvas')
const { join } = require('path')

registerFont('Black Ravens.ttf', {family: 'Black Ravens' })

module.exports.run = async (m, config, args) => {
	
	if(args.length == 1) return m.reply(`Antiraid is ${config.antiraid ? `on` : `off`}`)

	if(args[1] == "on"){
		config.antiraid= true;
		return m.reply(`Antiraid is now ${config.antiraid ? `on` : `off`}`)
	}
	if(args[1] == "off"){
		config.antiraid = false;
		return m.reply(`Antiraid is now ${config.antiraid ? `on` : `off`}`)
	}

}

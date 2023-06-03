const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, AttachmentBuilder} = require("discord.js");
const {footer} = require("../footer.js")
const Canvas = require('canvas');
const {registerFont, createCanvas} = require('canvas')
const { join } = require('path')

registerFont('Black Ravens.ttf', {family: 'Black Ravens' })

module.exports.run = async (m, config, args) => {
	if(args.length == 1) return m.reply(`Antimembernuke is ${config.antimembernuke ? `on` : `off`}`)

	if(args[1] == "on"){
		config.antimembernuke = true;
		return m.reply(`Antimembernuke is now ${config.antimembernuke ? `on` : `off`}`)
	}
	if(args[1] == "off"){
		config.antimembernuke = false;
		return m.reply(`Antimembernuke is now ${config.antimembernuke ? `on` : `off`}`)
	}
}

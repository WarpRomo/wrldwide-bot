const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, AttachmentBuilder} = require("discord.js");
const {footer} = require("../footer.js")
const Canvas = require('canvas');
const {registerFont, createCanvas} = require('canvas')
const { join } = require('path')

registerFont('Black Ravens.ttf', {family: 'Black Ravens' })

module.exports.run = async (m, config, args) => {
	if(args.length == 1) return m.reply(`Antichannelnuke is ${config.antichannelnuke ? `on` : `off`}`)

	if(args[1] == "on"){
		config.antichannelnuke = true;
		return m.reply(`Antichannelnuke is now ${config.antichannelnuke ? `on` : `off`}`)
	}
	if(args[1] == "off"){
		config.antichannelnuke = false;
		return m.reply(`Antichannelnuke is now ${config.antichannelnuke ? `on` : `off`}`)
	}
}

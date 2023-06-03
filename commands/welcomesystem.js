const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (config, member) => {
	if(config.welcomeenabled == false) return;

	let channel = member.guild.channels.cache.find(c => c.id == config.welcomechannel);

	if(channel == null){

		config.welcomeenabled = false;
		config.welcomechannel = null;
		return;


	}

	channel.send(config.welcometemplate.split("<user>").join(`<@${member.id}>`));
}

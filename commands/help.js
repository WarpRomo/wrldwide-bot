const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

	const embed = new EmbedBuilder()
	.setColor(config.embedcolor)
	.setTitle('Command-list')

	embed.addFields(
		{ name: 'Safety', value: "```" + `
${config.prefix}jail
${config.prefix}nuke
${config.prefix}log
${config.prefix}antiraid <on or off>
${config.prefix}antimembernuke <on or off>
${config.prefix}antichannelnuke <on or off>
${config.prefix}antispam <on or off>
` + "```"},
		{ name: 'Misc.', value: "```" + `
${config.prefix}welcome
${config.prefix}vc
${config.prefix}ticket
${config.prefix}reactionrole
${config.prefix}prefix
` + "```"},
		{name: 'Fun', value: "```" + `
${config.prefix}level
${config.prefix}color
${config.prefix}pfprandom
` + "```"}
	)
	.setFooter(footer());


	m.reply({ embeds: [embed] });

	return;

}

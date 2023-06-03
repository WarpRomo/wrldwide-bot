const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

		if(args.length < 2){

			const embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Reaction-role system')
			.addFields([
				{
					name: 'Settings', value: `Prefix: ${config.prefix}`

				},
				{
					name: 'Commands', value: "```" + `${config.prefix}prefix <new prefix>` + "```"

				}

				],
			)
			.setFooter(footer());

			return m.reply({embeds:[embed]});

		}

		let prefix = args[1];

		config.prefix = prefix;

		return m.reply(`Prefix changed to '${config.prefix}'`);


}

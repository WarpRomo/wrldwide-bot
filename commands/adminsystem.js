const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args, admincommands) => {
	let isadmin = m.member.permissions.any(PermissionFlagsBits.Administrator);

	if(!isadmin){
		let msg = args.join(" ");
		for(var i = 0; i < admincommands.length; i++){
			if(msg.startsWith(config.prefix + admincommands[i])){
				return m.channel.send("You must be an administrator to do that.")
			}
		}
	}
}

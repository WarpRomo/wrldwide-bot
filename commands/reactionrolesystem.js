const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (reaction, config, user, addrole) => {

	let message = reaction.message;
	let emojiid = reaction.emoji.id || reaction.emoji.name;


	if(message.id in config.reactionroles == false) return;
	if(emojiid in config.reactionroles[message.id] == false) return;
	let role = config.reactionroles[message.id][emojiid];

	role = message.guild.roles.cache.find(r => r.id == role);

	if(role == null) return;

	let member = message.guild.members.cache.find(m => m.id == user.id);

	if(addrole){
		member.roles.add(role);
	}
	else{
		member.roles.remove(role);
	}


}

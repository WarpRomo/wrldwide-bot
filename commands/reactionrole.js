const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args, client) => {

	if(args.length == 1){
		const embed = new EmbedBuilder()
		.setColor(config.embedcolor)
		.setTitle('Reaction-role system')
		.addFields([
			{
				name: 'Commands', value: "```" + `
${config.prefix}reactionrole set <link to message> <emoji> <role-id>
${config.prefix}reactionrole remove <link to message> <emoji>` + "```"

			}

			],
		)
		.setFooter(footer());

		return m.reply({ embeds: [embed] });
	}

	if(args[1] == "set"){

		if(args.length < 5){

			return m.reply(`To use this command, use the proper format
Example: *?reactionrole set <link to message> <emoji> <roleid>*`)

		}

		let link = args[2].split("/");
		let emoji = args[3];
		let roleid = args[4];

		if(link.length != 7) return m.reply("Message link is invalid.");

		let messageid = link[link.length-1];
		let channelid = link[link.length-2];

		if(parseInt(messageid)+""=="NaN" || parseInt(channelid)+""=="NaN") return m.reply("Message link is invalid.");


		let channel = m.guild.channels.cache.find(c => c.id == channelid);

		if(channel == null) return m.reply("Could not find the channel, fix the link or make it viewable.");

		let message = await channel.messages.fetch(messageid);

		if(message == null) return m.reply("Could not find the message, fix the link or make it viewable.");


		let role = m.guild.roles.cache.find(r => r.id == roleid);

		if(role == null) return m.reply("Could not find the role, provide a valid role-id.")

		try{
				let testing = await message.react(emoji);
				let emojiid = testing.emoji.id || testing.emoji.name;

				if(messageid in config.reactionroles == false){
					config.reactionroles[messageid] = {};
				}

				config.reactionroles[messageid][emojiid] = roleid;

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Reaction-role set!')
				.addFields([
					{ name: 'Settings', value: `
					Message: ${args[2]}
					Emoji: ${emoji}
					Role: <@&${roleid}>`}
					],
				)
				.setFooter(footer());

				return m.reply({ embeds: [embed] });

		}
		catch(err){
			return m.reply("Emoji is invalid.")
		}



	}

	if(args[1] == "remove"){


		if(args.length < 4){

			return m.reply(`To use this command, use the proper format
Example: *?reactionrole remove <link to message> <emoji>*`)

		}

		let link = args[2].split("/");
		let emoji = args[3];

		if(link.length != 7) return m.reply("Message link is invalid.");

		let messageid = link[link.length-1];
		let channelid = link[link.length-2];

		if(parseInt(messageid)+""=="NaN" || parseInt(channelid)+""=="NaN") return m.reply("Message link is invalid.");

		let channel = m.guild.channels.cache.find(c => c.id == channelid);

		if(channel == null) return m.reply("Could not find the channel, fix the link or make it viewable.");

		let message = await channel.messages.fetch(messageid);

		if(message == null) return m.reply("Could not find the message, fix the link or make it viewable.");

		try{
				let testing = await message.react(emoji);
				let emojiid = testing.emoji.id || testing.emoji.name;

				await testing.remove();

				if(messageid in config.reactionroles == false) return message.channel.send("There are no reaction-roles on this message.")
				if(emojiid in config.reactionroles[messageid] == false) return message.channel.send("This reaction-role does not exist.")

				let originalrole = config.reactionroles[messageid][emojiid];

				delete config.reactionroles[messageid][emojiid];

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Reaction-role removed!')
				.addFields([
					{ name: 'Settings', value: `
					Message: ${args[2]}
					Emoji: ${emoji}
					Role: <@&${originalrole}>`}
					],
				)
				.setFooter(footer());

				return m.reply({ embeds: [embed] });

		}
		catch(err){

			return m.reply("Emoji is invalid.")
		}



	}



}

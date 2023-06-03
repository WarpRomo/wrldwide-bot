const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

	let channel = config.pfprandomchannel;
	channel = m.guild.channels.cache.find(c => c.id == channel);

	if(channel == null){
		config.pfprandomchannel = null;
		return;
	}

	if(m.channel.id != channel.id) return;

	let attachments = m.attachments;

	let image = false;

	attachments.forEach(attachment => {

		let url = attachment.url;

		let extension = url.split(".");
		extension = extension[extension.length - 1];

		if(attachment.height != null && attachment.width != null){


			image = true;

			let obj = {

				"author": m.author.id,
				"key": attachment.url

			}

			config.pfprandomlist.push(obj);


		}


	})

	if(image){
		let reaction = await m.react('☑️');
		reaction.remove();
	}



}

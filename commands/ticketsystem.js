const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (interaction, config, client) => {

	let args = interaction.customId.split(" ");

	const claim = new ButtonBuilder()
		.setCustomId('ticket claimticket')
		.setLabel('Claim')
		.setEmoji({ name: "🧧" })
		.setStyle(ButtonStyle.Primary)

	const close = new ButtonBuilder()
		.setCustomId('ticket closeticket')
		.setLabel('Close')
		.setEmoji({ name: "🔒" })
		.setStyle(ButtonStyle.Secondary)

	const open = new ButtonBuilder()
		.setCustomId('ticket openticket')
		.setLabel('Open')
		.setEmoji({ name:"🔓" })
		.setStyle(ButtonStyle.Success)

	const deleteticket = new ButtonBuilder()
		.setCustomId('ticket deleteticket')
		.setLabel('Delete')
		.setEmoji({ name:"🗑️" })
		.setStyle(ButtonStyle.Danger);


	if(args[1] == "createticket"){

		let category = config.ticketcategory;

		console.log(category);

		category = interaction.member.guild.channels.cache.find(c => c.id == category);

		if(category == null){

			config.ticketcategory = null;

			return interaction.reply({

				content: `Set a ticket category with '${config.prefix}ticket category <category id>' for tickets to work.`,
				ephemeral: true

			})


		}
		else{

			let reply = await interaction.reply({
				content: `Creating ticket...`,
				ephemeral: true
			})

			let name = config.ticketcount + "-" + interaction.member.user.tag;

			if(name.length > 32) name = name.substring(0,32);

			let permissions = [];

			permissions.push({

				id: interaction.member.id,
				allow: [PermissionFlagsBits.ViewChannel]

			})

			permissions.push({
				id: interaction.member.guild.roles.everyone.id, // @everyone role
				deny: [PermissionFlagsBits.ViewChannel]
			})

			let roles = Object.keys(config.ticketroles);

			for(var i = 0; i < roles.length; i++){
				permissions.push({
					id: roles[i],
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
				})
			}


			let ticketchannel = await interaction.member.guild.channels.create(
				{
					name: name,
					parent: category,
					permissionOverwrites: permissions
				}
			);

			config.ticketcount++;

			let embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Created ticket')
			.setDescription(`https://discord.com/channels/${interaction.member.guild.id}/${ticketchannel.id}`)
			.setFooter(footer());

			await reply.edit({ embeds: [embed] });

			let ticketembed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Support-Ticket')
			.setDescription(`Here are the options for this ticket...`)
			.setFooter(footer())

			const row = new ActionRowBuilder()
				.addComponents(claim, close, open.setDisabled(true), deleteticket);

			return ticketchannel.send({
				embeds: [ticketembed],
				components: [row],
			});



		}

	}

	if(args[1] == "createadminticket"){

		let category = config.ticketcategory;

		console.log(category);

		category = interaction.member.guild.channels.cache.find(c => c.id == category);

		if(category == null){

			config.ticketcategory = null;

			return interaction.reply({

				content: `Set a ticket category with '${config.prefix}ticket category <category id>' for tickets to work.`,
				ephemeral: true

			})


		}
		else{

			let reply = await interaction.reply({
				content: `Creating admin-ticket...`,
				ephemeral: true
			})

			let name = config.ticketcount + "-" + interaction.member.user.tag;

			if(name.length > 32) name = name.substring(0,32);

			let permissions = [];

			permissions.push({

				id: interaction.member.id,
				allow: [PermissionFlagsBits.ViewChannel]

			})

			permissions.push({
				id: interaction.member.guild.roles.everyone.id, // @everyone role
				deny: [PermissionFlagsBits.ViewChannel]
			})

			let roles = Object.keys(config.ticketadminroles);

			for(var i = 0; i < roles.length; i++){
				permissions.push({
					id: roles[i],
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
				})
			}


			let ticketchannel = await interaction.member.guild.channels.create(
				{
					name: name,
					parent: category,
					permissionOverwrites: permissions
				}
			);

			config.ticketcount++;

			let embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Created admin-ticket')
			.setDescription(`https://discord.com/channels/${interaction.member.guild.id}/${ticketchannel.id}`)
			.setFooter(footer());

			await reply.edit({ embeds: [embed] });

			let ticketembed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Admin-Support-Ticket')
			.setDescription(`Here are the options for this ticket...`)
			.setFooter(footer())

			const row = new ActionRowBuilder()
				.addComponents(claim, close, open.setDisabled(true), deleteticket);

			return ticketchannel.send({
				embeds: [ticketembed],
				components: [row],
			});



		}

	}


	if(args[1] == "closeticket"){

		let message = interaction.message;

		const row = new ActionRowBuilder()
			.addComponents(claim, close.setDisabled(true), open.setDisabled(false), deleteticket);

		console.log("here");

		message.edit({
			components: [row],
		});

		interaction.reply(`<@${interaction.member.id}> closed the ticket...`);

		interaction.message.channel.permissionOverwrites.edit(interaction.member.guild.roles.everyone, {
			SendMessages: false,
		})

	}

	if(args[1] == "openticket"){

		let message = interaction.message;

		const row = new ActionRowBuilder()
			.addComponents(claim, close.setDisabled(false), open.setDisabled(true), deleteticket);

		console.log("here");

		message.edit({
			components: [row],
		});

		interaction.reply(`<@${interaction.member.id}> opened the ticket...`);

		interaction.message.channel.permissionOverwrites.edit(interaction.member.guild.roles.everyone, {
			SendMessages: true,
		})


	}

	if(args[1] == "deleteticket"){


		let member = interaction.member;

		for(var role of member.roles.cache){

			if(role[1].id in config.ticketroles){
				await interaction.reply(`<@${interaction.member.id}> deleted the ticket...`);
				return interaction.message.channel.delete();
			}

		}

		return interaction.reply({
			content: `You do not have permission to delete this ticket.`,
			ephemeral: true
		});


	}

	if(args[1] == "claimticket"){

		let member = interaction.member;

		for(var role of member.roles.cache){

			if(role[1].id in config.ticketroles){
				return interaction.reply(`<@${interaction.member.id}> claimed the ticket`);
			}

		}

		return interaction.reply({
			content: `You do not have permission to claim this ticket.`,
			ephemeral: true
		});


	}

}

const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {


			let channel = config.ticketcategory;

			if(channel != null) channel = m.guild.channels.cache.find(c => c.id == channel)

			if(channel == null){
				config.ticketcategory = null;
			}


			if(args.length == 1){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Ticket settings')

				embed.addFields(

					{ name: 'Commands', value: "```" + `
${config.prefix}ticket category <category id>
${config.prefix}ticket roles
${config.prefix}ticket roles add
${config.prefix}ticket roles remove
${config.prefix}ticket message
${config.prefix}ticket adminroles
${config.prefix}ticket adminroles add
${config.prefix}ticket adminroles remove
${config.prefix}ticket adminmessage` + "```"}

				)
				.setFooter(footer());


				m.reply({ embeds: [embed] });

			}

			if(args[1] == "message"){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Support')
				.setDescription(`If you'd like to receive support, open a ticket!`)
				.setFooter(footer())

				const confirm = new ButtonBuilder()
					.setCustomId('ticket createticket')
					.setLabel('Create Ticket')
					.setEmoji({ name: '📩' })
					.setStyle(ButtonStyle.Success);

				const row = new ActionRowBuilder()
					.addComponents(confirm);

				await m.reply({
					embeds: [embed],
					components: [row],
				});

			}

			if(args[1] == "adminmessage"){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Admin-Support')
				.setDescription(`If you'd like to receive support, open a ticket!`)
				.setFooter(footer())

				const confirm = new ButtonBuilder()
					.setCustomId('ticket createadminticket')
					.setLabel('Create Ticket')
					.setEmoji({ name: '📩' })
					.setStyle(ButtonStyle.Danger);

				const row = new ActionRowBuilder()
					.addComponents(confirm);

				await m.reply({
					embeds: [embed],
					components: [row],
				});

			}



			if(args[1] == "category"){


				if(args.length == 2){

					if(config.ticketcategory != null){
						m.reply(`Current ticket category is ${config.ticketcategory}.`);
					}
					else{
						m.reply("There is no ticket category.");
					}

				}
				else{
					let category = args[2];

					let channel = m.guild.channels.cache.find(c => c.type == 4 && c.id == category);

					if(channel == null){
						m.reply("Could not find that category, make sure it is visible and is actually a category not a channel.")
					}
					else{

						config.ticketcategory = channel.id;
						m.reply(`Ticket category set to '${channel.name}'.`);

					}

				}



			}

			if(args[1] == "roles"){

				if(args.length == 2){

					let roles = config.ticketroles;

					let currentroles = ``;

					let keys = Object.keys(roles);

					for(var i = 0; i < keys.length; i++){
						currentroles += `<@&${keys[i]}>\n`;
					}

					currentroles = currentroles.length == 0 ? `None` : currentroles;


					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket roles')
					.addFields([
						{
						name: 'Current Roles',
						value: currentroles,
						}])
					.setFooter(footer());

					return m.reply({embeds:[embed]});




				}

				if(args[2] == "add"){

					let addedroles = [];
					let failed = [];

					for(var i = 3; i < args.length; i++){

						let role = args[i];
						role = m.guild.roles.cache.find(r => r.id == role);

						if(role == null){
							failed.push(args[i]);
						}
						else{
							if(role.id in config.ticketroles == false){
								addedroles.push(role.id);
								config.ticketroles[role.id] = true;
							}
						}

					}


					let successes = ``;
					let fails = ``;

					for(var i = 0; i < addedroles.length; i++){
						successes += `<@&${addedroles[i]}>\n`;
					}

					for(var i = 0; i < failed.length; i++){
						fails += `${failed[i]}\n`;
					}

					successes = successes.length == 0 ? `None` : successes;
					fails = fails.length == 0 ? `None` : fails;

					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket roles')
					.addFields([{

						name: 'Successfully added roles...',
						value: successes

					},
					{
						name: 'Failed to add roles...',
						value: fails,
					}])
					.setFooter(footer());

					return m.reply({embeds: [embed]});

				}

				if(args[2] == "remove"){

					let addedroles = [];
					let failed = [];

					for(var i = 3; i < args.length; i++){

						let role = args[i];
						role = m.guild.roles.cache.find(r => r.id == role);

						if(role == null){
							failed.push(args[i]);
						}
						else{
							if(role.id in config.ticketroles){
								addedroles.push(role.id);
								delete config.ticketroles[role.id];
							}
						}

					}


					let successes = ``;
					let fails = ``;

					for(var i = 0; i < addedroles.length; i++){
						successes += `<@&${addedroles[i]}>\n`;
					}

					for(var i = 0; i < failed.length; i++){
						fails += `${failed[i]}\n`;
					}

					successes = successes.length == 0 ? `None` : successes;
					fails = fails.length == 0 ? `None` : fails;

					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket roles')
					.addFields([{

						name: 'Successfully removed roles...',
						value: successes

					},
					{
						name: 'Failed to remove roles...',
						value: fails,
					}])
					.setFooter(footer());

					return m.reply({embeds: [embed]});

				}



			}

			if(args[1] == "adminroles"){

				if(args.length == 2){

					let roles = config.ticketadminroles;

					let currentroles = ``;

					let keys = Object.keys(roles);

					for(var i = 0; i < keys.length; i++){
						currentroles += `<@&${keys[i]}>\n`;
					}

					currentroles = currentroles.length == 0 ? `None` : currentroles;


					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket roles')
					.addFields([
						{
						name: 'Current Admin-Roles',
						value: currentroles,
						}])
					.setFooter(footer());

					return m.reply({embeds:[embed]});




				}

				if(args[2] == "add"){

					let addedroles = [];
					let failed = [];

					for(var i = 3; i < args.length; i++){

						let role = args[i];
						role = m.guild.roles.cache.find(r => r.id == role);

						if(role == null){
							failed.push(args[i]);
						}
						else{
							if(role.id in config.ticketadminroles == false){
								addedroles.push(role.id);
								config.ticketadminroles[role.id] = true;
							}
						}

					}


					let successes = ``;
					let fails = ``;

					for(var i = 0; i < addedroles.length; i++){
						successes += `<@&${addedroles[i]}>\n`;
					}

					for(var i = 0; i < failed.length; i++){
						fails += `${failed[i]}\n`;
					}

					successes = successes.length == 0 ? `None` : successes;
					fails = fails.length == 0 ? `None` : fails;

					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket admin-roles')
					.addFields([{

						name: 'Successfully added roles...',
						value: successes

					},
					{
						name: 'Failed to add roles...',
						value: fails,
					}])
					.setFooter(footer());

					return m.reply({embeds: [embed]});

				}

				if(args[2] == "remove"){

					let addedroles = [];
					let failed = [];

					for(var i = 3; i < args.length; i++){

						let role = args[i];
						role = m.guild.roles.cache.find(r => r.id == role);

						if(role == null){
							failed.push(args[i]);
						}
						else{
							if(role.id in config.ticketadminroles){
								addedroles.push(role.id);
								delete config.ticketadminroles[role.id];
							}
						}

					}


					let successes = ``;
					let fails = ``;

					for(var i = 0; i < addedroles.length; i++){
						successes += `<@&${addedroles[i]}>\n`;
					}

					for(var i = 0; i < failed.length; i++){
						fails += `${failed[i]}\n`;
					}

					successes = successes.length == 0 ? `None` : successes;
					fails = fails.length == 0 ? `None` : fails;

					let embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Ticket admin-roles')
					.addFields([{

						name: 'Successfully removed roles...',
						value: successes

					},
					{
						name: 'Failed to remove roles...',
						value: fails,
					}])
					.setFooter(footer());

					return m.reply({embeds: [embed]});

				}



			}


}

const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {


	if(args.length == 1 || args[1] == "recent"){
		let index = Math.floor(Math.random() * config.pfprandomlist.length);

		if(args.length > 1 && args[1] == "recent") index = config.pfprandomlist.length - 1;

		let random = config.pfprandomlist[index];

		const embed = new EmbedBuilder()
		.setColor(config.embedcolor)
		.setImage(random.key)
		//.setDescription(`*${random.key}*`)
		//.setTitle(`"${random.title}"`)
		.setFooter(footer());

		const back = new ButtonBuilder()
			.setCustomId(`pfprandom back ${index}`)
			.setLabel('Back')
			.setEmoji('🌸')
			.setStyle(ButtonStyle.Danger);

		const next = new ButtonBuilder()
			.setCustomId(`pfprandom next ${index}`)
			.setLabel('Next')
			.setEmoji('🌸')
			.setStyle(ButtonStyle.Danger);

		const randombutton = new ButtonBuilder()
			.setCustomId(`pfprandom random ${index}`)
			.setLabel('Random')
			.setEmoji('🌸')
			.setStyle(ButtonStyle.Danger)

		const garbage = new ButtonBuilder()
			.setCustomId(`pfprandom garbage ${index}`)
			.setEmoji(`🗑️`)
			.setStyle(ButtonStyle.Danger)

		const row = new ActionRowBuilder()
			.addComponents(back, next, randombutton, garbage);


		m.reply({ embeds: [embed], components: [row] });



		return;
	}


	if(args.length > 1){


		if(args[1] == "settings"){
			const embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('PFPrandom settings')
			.setDescription(`
Channel: ${config.pfprandomchannel == null ? `*None*` : `<#${config.pfprandomchannel}>`}
Image-count: ${config.pfprandomlist.length}`)

			embed.addFields(

				{ name: 'Commands', value: "```" + `
${config.prefix}pfprandom
${config.prefix}pfprandom channel
${config.prefix}pfprandom channel <channel id>
${config.prefix}pfprandom adminroles
${config.prefix}pfprandom adminroles add
${config.prefix}pfprandom adminroles remove` + "```"}

			)
			.setFooter(footer());


			return m.reply({ embeds: [embed] });
		}

		if(args[1] == "channel"){

			if(args.length == 2){

				let channel = config.pfprandomchannel;
				channel = m.guild.channels.cache.find(c => c.id == channel);

				if(channel == null){
					config.pfprandomchannel = null;

					return m.channel.send("There is no pfprandom channel set.")
				}

				return m.channel.send(`The pfprandom channel is <#${channel.id}>`);
			}
			else{
				let id = args[2];

				let channel = m.guild.channels.cache.find(c => c.id == id);

				if(channel == null){

					return m.channel.send(`Could not find that channel, provide a valid channel-id or make the channel visible.`)

				}

				config.pfprandomchannel = id;

				return m.channel.send(`The pfprandom channel is now <#${channel.id}>`);


			}





		}


		if(args[1] == "adminroles"){

			if(args.length == 2){

				let roles = config.pfprandomadminroles;

				let currentroles = ``;

				let keys = Object.keys(roles);

				for(var i = 0; i < keys.length; i++){
					currentroles += `<@&${keys[i]}>\n`;
				}

				currentroles = currentroles.length == 0 ? `None` : currentroles;


				let embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('PFPrandom admin-Roles')
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
						if(role.id in config.pfprandomadminroles == false){
							addedroles.push(role.id);
							config.pfprandomadminroles[role.id] = true;
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
				.setTitle('PFPrandom admin-roles')
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
						if(role.id in config.pfprandomadminroles){
							addedroles.push(role.id);
							delete config.pfprandomadminroles[role.id];
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
				.setTitle('PFPrandom admin-roles')
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


}

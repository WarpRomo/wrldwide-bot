const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args, client) => {



			if(args.length == 1){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Jail settings')
				.setDescription(`*Note: You must create a **Jail** role, and a **jail-channel**, then register them with the bot.*`)

				embed.addFields(
					{ name: 'Settings', value: `
					Role: ${config.jailrole == null ? `None` : `<@&${config.jailrole}>`}
					Channel: ${config.jailchannel == null ? `None` : `<#${config.jailchannel}>`}`},
					{ name: 'Commands', value: "```" + `
${config.prefix}jail role <role-id>
${config.prefix}jail channel <channel-id>
${config.prefix}jail register
${config.prefix}jail add <mention users>
${config.prefix}jail free <mention users>` + "```"},
				)
				.setFooter(footer());


				m.reply({ embeds: [embed] });

				return;

			}

			if(args[1] == "role"){



				if(args.length == 2){

					let role = config.jailrole;
					role = m.guild.roles.cache.find(r => r.id == role);

					if(role == null){

						config.jailrole = null;

						return m.reply(`There is no jail role set.`);

					}
					else{
						return m.reply(`The jailrole is <@&${config.jailrole}>`);
					}


				}

				let jailrole = args[2];
				jailrole = m.guild.roles.cache.find(r => r.id == jailrole);

				if(jailrole == null){

					return m.reply(`Could not find that role, provide a proper role ID`)

				}


				config.jailrole = jailrole.id;

				return m.reply(`Jail role is now <@&${jailrole.id}>`);


			}

			if(args[1] == "add"){

				let memberlist = [];

				if(args.length > 2){
					for(var i = 2; i < args.length; i++){

						if(args[i].startsWith("<@")) continue;

						try{
							let member = await m.guild.members.fetch(args[i])
							memberlist.push(member);
						}
						catch(err){
							failed += `${args[i]}\n`
						}
					}
				}

				for(var member of m.mentions.members){
					memberlist.push(member[1]);
				}


				let jailmessage = await m.reply("Jailing users...")

				let success = ``;
				let failed = ``;

				let results = await jailmembers(memberlist, config, m.guild, client);

				for(var i = 0; i < results[0].length; i++) success += `<@${results[0][i]}>\n`;
				for(var i = 0; i < results[1].length; i++) failed += `<@${results[1][i]}>\n`;

				success = success.length == 0 ? 'None' : success
				failed = failed.length == 0 ? 'None' : failed

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.addFields(

					{ name: 'Successfully jailed...', value: success },
					{ name: 'Failed to jail...', value: failed}

				)
				.setFooter(footer());

				console.log("here");

				jailmessage.edit({ embeds: [embed] });

			}

			if(args[1] == "free"){
				let memberlist = [];


				let jailrole = m.guild.roles.cache.find(r => r.id == config.jailrole);

				let freemessage = await m.reply("Freeing users...");

				let success = ``;
				let failed = ``;


				if(args.length > 2){
					for(var i = 2; i < args.length; i++){

						if(args[i].startsWith("<@")) continue;

						try{
							let member = await m.guild.members.fetch(args[i])
							memberlist.push(member);
						}
						catch(err){
							failed += `${args[i]}\n`
						}
					}
				}

				for(var member of m.mentions.members){
					memberlist.push(member[1]);
				}

				for(var member of memberlist){

					if(member.roles.cache.has(jailrole.id)){
						await member.roles.remove(jailrole);
						success += `<@${member.id}>\n`;
					}

					if(member.id in config.jailedusers){

						let roles = config.jailedusers[member.id];


						for(var i = 0; i < roles.length; i++){

							if(m.guild.roles.cache.has(roles[i])){
								await member.roles.add(roles[i]);
							}

						}

						delete config.jailedusers[member.id];


					}

				}

				success = success.length == 0 ? 'None' : success
				failed = failed.length == 0 ? 'None' : failed

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.addFields(

					{ name: 'Successfully freed...', value: success },
					{ name: 'Failed to free...', value: failed}

				)
				.setFooter(footer());

				freemessage.edit({ embeds: [embed] });

			}

			if(args[1] == "channel"){

				if(args.length == 2){

					let channel = config.jailchannel;
					channel = m.guild.channels.cache.find(c => c.id == channel);

					if(channel == null){

						config.jailchannel = null;

						return m.reply(`There is no jail channel.`)


					}
					else{
						return m.reply(`The jail channel is <#${channel.id}>`)
					}


				}

				let channel = args[2];
				channel = m.guild.channels.cache.find(c => c.id == channel);

				if(channel == null){
					return m.reply("Cannot find that channel, provide a proper channel ID.");
				}

				config.jailchannel = channel.id;

				return m.reply(`Jail channel is now <#${channel.id}>, do '${config.prefix}jail register' to update the permissions.`)



			}

			if(args[1] == "register"){

				let channel = config.jailchannel;
				channel = m.guild.channels.cache.find(c => c.id == channel);

				let role = config.jailrole;
				role = m.guild.roles.cache.find(r => r.id == role);

				if(channel == null){

					config.jailchannel = null;
					return m.reply(`Can't register jail, there is no channel set.`)


				}

				if(role == null){

					config.jailrole = null;
					return m.reply(`Can't register jail, there is no role set.`);

				}

				m.guild.channels.cache.forEach(c => {

					c.permissionOverwrites.edit(role, {
						ViewChannel: false,
					})

				})

				channel.permissionOverwrites.edit(role, {
					ViewChannel: true,
				})

				channel.permissionOverwrites.edit(m.guild.roles.everyone, {
					ViewChannel: false,
				})

				m.reply(`Jail has been registered.`)

			}


}


async function jailmembers(memberlist, config, guild, client){

	let jailrole = guild.roles.cache.find(r => r.id == config.jailrole);
	let mymember = guild.members.cache.find(m => m.id == client.user.id);

	let myposition = mymember.roles.cache.first().position;

	let success = [];
	let failed = [];

	for(var member of memberlist){

		let failedrole = false;

		for(var role of member.roles.cache){

			if(myposition <= role[1].position){
				failedrole = true;
			}

		}

		if(member.id in config.jailedusers) failedrole = true;

		let removedroles = [];

		if(!failedrole){
			for(var role of member.roles.cache){

				if(role[1].id == guild.roles.everyone.id) continue;
				await member.roles.remove(role[1]);
				removedroles.push(role[1].id);

			}

			let therole = guild.roles.cache.find(r => r.id == jailrole);

			await member.roles.add(therole);

		}

		if(!failedrole && member.roles.cache.size == 2 && member.roles.cache.first().id == jailrole){
			config.jailedusers[member.id] = removedroles;
			success.push(member.id);
		}
		else{
			failed.push(member.id);
		}

	}

	return [success,failed];
}

module.exports.jailmembers = jailmembers;

const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {


			categoryfilter(config, m.guild)

			let currentchannels = config.voicechannels;


			if(args.length == 1){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Voice-chat settings')

				if(m.author.id in config.voicechannels){


					let channel = m.guild.channels.cache.find(c => c.id == config.voicechannels[m.author.id].id);

					embed.addFields({name: `Your channel`, value: `*${channel.name}*`})

				}

				embed.addFields(

					{ name: 'Commands', value: "```" + `
${config.prefix}vc delete
${config.prefix}vc unlock
${config.prefix}vc lock
${config.prefix}vc hide
${config.prefix}vc unhide
${config.prefix}vc creator <id of temp channel creator>
${config.prefix}vc userlimit <user limit>
${config.prefix}vc rename <name>
${config.prefix}vc kick <mention users>
${config.prefix}vc ban <mention users>
${config.prefix}vc unban <mention users>` + "```"},
				)
				.setFooter(footer());


				m.reply({ embeds: [embed] });

			}

			if(args[1] == "creator"){


				if(args.length == 2){

					let channel = config.voicecategory;

					channel = m.guild.channels.cache.find(c => c.id == channel);

					if(channel != null){
						m.reply(`Voice-chats will be created under <#${channel.id}>`);
					}
					else{
						config.voicecategory = null;
						m.reply("There is no voice-chat creator channel.");
					}

				}
				else{

					let channelid = args[2];
					let channel = m.guild.channels.cache.find(c => c.id == channelid);

					if(channel == null){
						m.reply("Could not find that channel, make sure it is visible and the ID is correct.")
					}
					else{

						config.voicecategory = channel.id;
						m.reply(`Voice-chat channel set to ${channel.name}.`);

					}

				}


			}

			if(args[1] == "delete"){


				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice-chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

					channel.delete();

					delete currentchannels[m.author.id];

					return m.reply("Voice-chat has been closed.");


				}





			}

			if(args[1] == "unlock"){

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice-chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

					channel.permissionOverwrites.delete(m.guild.roles.everyone)

					return m.reply(`Voice-chat <#${channel.id}> is now unlocked.`);


				}



			}

			if(args[1] == "lock"){

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

					channel.permissionOverwrites.edit( m.guild.roles.everyone, {
			      Connect: false
			    });

					return m.reply(`Voice-chat <#${channel.id}> is now locked.`);


				}

			}

			if(args[1] == "hide"){
				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

					channel.permissionOverwrites.edit( m.guild.roles.everyone, {
			      ViewChannel: false
			    });

					return m.reply(`Voice-chat <#${channel.id}> is now hidden.`);


				}
			}

			if(args[1] == "unhide"){
				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

					channel.permissionOverwrites.edit( m.guild.roles.everyone, {
						ViewChannel: true
					});

					return m.reply(`Voice-chat <#${channel.id}> is now visible.`);


				}
			}

			if(args[1] == "kick"){


				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice-chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);


					let memberlist = [];

					let successful = ``;
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


					if(memberlist.length == 0){
						return m.reply(`You did not mention any valid users, use the command properly.\nExample ${config.prefix}vc kick <@${m.author.id}>`)
					}


					let kickmessage = await m.reply("Attempting to kick users...")

					let list = {};

					for(var member of memberlist){
						list[member.id] = false;
					}


					for(var member of channel.members){
						if(member[0] in list){
							await member[1].voice.disconnect();

							if(member[1].voice.channel == undefined) list[member[0]] = true;
						}
					}

					for(var member of memberlist){

						if(list[member.id]) successful += `<@${member.id}>\n`
						else failed += `<@${member.id}>\n`

					}

					if(failed.length == 0) failed = `*None*`
					if(successful.length == 0) successful = `*None*`

					const embed = new EmbedBuilder()
					.setColor(config.embedcolor)

					embed.addFields(

						{ name: 'Successfully kicked...', value: successful },
						{ name: 'Failed to kick...', value: failed}

					)
					.setFooter(footer());

					kickmessage.edit({ embeds: [embed] });



				}



			}

			if(args[1] == "ban"){


				console.log(currentchannels);

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice-chat.")
				}
				else{

					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);


					let memberlist = [];

					let successful = ``;
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


					if(memberlist.length == 0){
						return m.reply(`You did not mention any valid users, use the command properly.\nExample ${config.prefix}vc kick <@${m.author.id}>`)
					}


					let kickmessage = await m.reply("Attempting to ban users...")

					let list = {};

					for(var member of memberlist){
						list[member.id] = false;
						currentchannels[m.author.id].banlist[member.id] = true;
					}

					for(var member of channel.members){
						if(member[0] in list){
							await member[1].voice.disconnect();

							if(member[1].voice.channel == undefined) list[member[0]] = true;
						}
					}

					for(var member of memberlist){

						if(list[member.id]) successful += `<@${member.id}>\n`
						else failed += `<@${member.id}>\n`

					}

					if(failed.length == 0) failed = `*None*`
					if(successful.length == 0) successful = `*None*`

					const embed = new EmbedBuilder()
					.setColor(config.embedcolor)

					embed.addFields(

						{ name: 'Successfully banned...', value: successful },
						{ name: 'Failed to ban...', value: failed}

					)
					.setFooter(footer());

					kickmessage.edit({ embeds: [embed] });



				}



			}

			if(args[1] == "unban"){

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice-chat.")
				}
				else{
					let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);


					let memberlist = [];

					let successful = ``;
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


					if(memberlist.length == 0){
						return m.reply(`You did not mention any valid users, use the command properly.\nExample ${config.prefix}vc kick <@${m.author.id}>`)
					}


					let kickmessage = await m.reply("Attempting to ban users...")

					let list = {};

					for(var member of memberlist){
						list[member.id] = false;
						if(member.id in currentchannels[m.author.id].banlist){

							successful += `<@${member.id}>\n`
							delete currentchannels[m.author.id].banlist[member.id]

						}
					}


					if(failed.length == 0) failed = `*None*`
					if(successful.length == 0) successful = `*None*`

					const embed = new EmbedBuilder()
					.setColor(config.embedcolor)

					embed.addFields(

						{ name: 'Successfully unbanned...', value: successful },
						{ name: 'Failed to unban...', value: failed}

					)
					.setFooter(footer());

					kickmessage.edit({ embeds: [embed] });



				}



			}




			if(args[1] == "rename"){

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice chat.")
				}
				if(args.length == 2){
					return m.reply(`Provide the new name of the channel.\nExample: ${config.prefix}vc name party`)
				}

				let name = args[2];


				if(name.length >= 32) return m.reply("The name must be under 32 letters long.");

				let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

				m.reply(`Voice-chat '${channel.name}' has been renamed to '${name}'`);

				channel.setName(name);

				return;

			}
			if(args[1] == "userlimit"){

				if(m.author.id in currentchannels == false){
					return m.reply("You don't have a voice chat.")
				}
				if(args.length == 2){
					return m.reply(`Provide the user-limit of the channel.\nExample: ${config.prefix}vc userlimit 5`)
				}

				let limit = parseInt(args[2]);

				if(limit+"" == "NaN") return m.reply(`'${args[2]}' is not a valid number.`);

				let channel = m.guild.channels.cache.find(c => c.id == currentchannels[m.author.id].id);

				m.reply(`Voice-chat <#${channel.id}> now has a userlimit of ${limit}`);

				channel.setUserLimit(limit);

				return;

			}


}

function categoryfilter(config, guild){

			let currentchannels = config.voicechannels;

			let category = config.voicecategory;

			if(category != null) category = guild.channels.cache.find(c => c.id == category);

			if(category != null){


				let channellist = [];
				let keys = Object.keys(currentchannels);

				category.parent.children.cache.forEach(c => {

					let id = c.id+"";
					channellist.push(id);

				})

				console.log(keys, channellist);

				L: for(var i = 0; i < keys.length; i++){
					for(var j = 0; j < channellist.length; j++){
						if(currentchannels[keys[i]].id == channellist[j]){
							continue L;
						}
					}
					delete currentchannels[keys[i]];
				}

				console.log(keys, channellist);

			}
			else{
				config.voicechannels = {};
				config.voicecategory = null;
			}

}

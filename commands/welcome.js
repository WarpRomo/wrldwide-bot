const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

			if(args.length == 1){

				const embed = new EmbedBuilder()
				.setColor(config.embedcolor)
				.setTitle('Welcome settings')

				if(config.welcomeenabled){
					embed.addFields({ name: 'Enabled', value:`Channel: <#${config.welcomechannel}>
					Template: ${config.welcometemplate}`})
				}
				else{
					embed.addFields({ name: 'Disabled', value:`*Type '${config.prefix}welcome enable' to enable them*`})
				}

				embed.addFields(

					{ name: 'Commands', value: "```" + `
${config.prefix}welcome enable
${config.prefix}welcome disable
${config.prefix}welcome set
${config.prefix}welcome template <template here>
${config.prefix}welcome test` + "```"},
				)
				.setFooter(footer());


				m.reply({ embeds: [embed] });

				return;

			}

			if(args[1] == "enable"){

				config.welcomeenabled = true;
				if(config.welcomechannel == null){
					config.welcomechannel = m.channel.id;
					m.reply(`Welcome messages will appear in <#${m.channel.id}>.`)
				}
				else{
					m.reply(`Welcome messages are now enabled.`)
				}

			}

			if(args[1] == "set"){

				config.welcomeenabled = true;
				config.welcomechannel = m.channel.id;

				m.reply(`Welcome messages will appear in <#${m.channel.id}>.`)

			}

			if(args[1] == "disable"){

				config.welcomeenabled = false;
				m.reply("Welcome messages are now disabled.")


			}

			if(args[1] == "template"){

				if(args.length == 2){

					m.reply(`Template is currently:\n${config.welcometemplate.split("<user>").join(`<@${m.author.id}>`)}`)

				}
				else{

					let template = [];

					for(var i = 2; i < args.length; i++) template.push(args[i]);

					template = template.join(" ");

					config.welcometemplate = template;

					const embed = new EmbedBuilder()
					.setColor(config.embedcolor)
					.setTitle('Template created!')
					.setDescription(template.split("<user>").join(`<@${m.author.id}>`));

					m.reply({ embeds: [embed] });

				}


			}

			if(args[1] == "test"){

				if(config.welcomeenabled){

					let channel = m.guild.channels.cache.find(c => c.id == config.welcomechannel);

					if(channel == null){
						config.welcomeenabled = false;
					}
					else{
						channel.send(config.welcometemplate.split("<user>").join(`<@${m.author.id}>`))
					}

				}

				if(config.welcomeenabled == false){
					return m.reply("Welcome messages are disabled.")
				}


			}


}

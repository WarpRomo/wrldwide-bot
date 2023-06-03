const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

	if(config.logchannel != null && m.guild.channels.cache.find(c => c.id == config.logchannel) == null){

		config.logchannel = null;

	}

  if(args.length == 1){

		const embed = new EmbedBuilder()
		.setColor(config.embedcolor)
		.setTitle('Log settings')

		if(config.welcomeenabled){
			embed.addFields({ name: 'Log channel', value:`${config.logchannel == null ? `None` : `<#${config.logchannel}>`}`})
		}

		embed.addFields(

			{ name: 'Commands', value: `
			${config.prefix}log set
			${config.prefix}log test`},
		)
		.setFooter(footer());


		m.reply({ embeds: [embed] });
		return;


  }
  if(args[1] == "set"){

    config.logchannel = m.channel.id;


    m.reply(`Log channel is now <#${m.channel.id}>`);

  }
	if(args[1] == "test"){

		if(config.logchannel == null){
			return m.reply(`There is no log channel.`)
		}

		let logchannel = m.guild.channels.cache.find(c => c.id == config.logchannel);
		logchannel.send(`<@${m.author.id}>`);

	}





}

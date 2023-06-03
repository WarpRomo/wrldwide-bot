const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (m, config, args) => {

  	if(m.author.id in config.levels == false){
  		config.levels[m.author.id] = 1;
  	}

  	config.levels[m.author.id]++;

  	if(config.levels[m.author.id] > 0 && config.levels[m.author.id] % config.levelrate == 0){

  		let levelchannel = config.levelchannel;

  		if(levelchannel != null) levelchannel = m.guild.channels.cache.find(c => c.id == levelchannel);
  		if(levelchannel == null){
  			levelchannel = m.channel;
  			config.levelchannel = null;
  		}

      let level = config.levels[m.author.id] / config.levelrate;

  		levelchannel.send(`<@${m.author.id}> is now level ${level}!`)


  	}

}

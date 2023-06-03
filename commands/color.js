const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js");

module.exports.run = async (m, config, args) => {

    if(args.length == 1){

      let test = [9,2,3,4];

			const embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Current color: ' + config.embedcolor)
			.setFooter(footer());

			m.reply({ embeds: [embed] });

    }
    else{
      let color = args[1];

      if(/^#[0-9A-F]{6}$/i.test(color)){

        config.embedcolor = color;

        const embed = new EmbedBuilder()
        .setColor(config.embedcolor)
        .setTitle('Color changed.')
        .setFooter(footer());

        m.reply({ embeds: [embed] });

      }
      else{
        m.reply("Invalid color '" + args[1] + "', please send a valid one, example: #ff0000")
      }
    }

}

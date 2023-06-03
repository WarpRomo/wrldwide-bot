const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (interaction, config, client) => {

	let args = interaction.customId.split(" ");
	let index = parseInt(args[2]);
	let admin = false;

	if(args[1] == "garbage"){

		let roles = config.pfprandomadminroles;



		for(var role of interaction.member.roles.cache){

			console.log(role[0], roles);

			if(role[0] in roles){

				config.pfprandomlist.splice(index, 1);
				admin = true;
				interaction.reply({content: `Image has been deleted.`, ephemeral: true});
				break;

			}

		}

		if(!admin){

			return interaction.reply({content: `You cannot do that because you don't have an admin role.`, ephemeral: true});

		}


	}

	if(index >= config.pfprandomlist.length) index = config.pfprandomlist.length - 1;

	if(args[1] == "back"){

		index--;
		if(index < 0) index = config.pfprandomlist.length - 1;

	}

	if(args[1] == "next"){

		index++;
		if(index >= config.pfprandomlist.length) index = 0;

	}

	if(args[1] == "random"){
		index = Math.floor(Math.random() * config.pfprandomlist.length);
	}


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



	interaction.message.edit({ embeds: [embed], components: [row] });
	if(!admin) interaction.deferUpdate();


	return;

}

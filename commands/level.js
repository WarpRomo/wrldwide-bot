const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, AttachmentBuilder} = require("discord.js");
const {footer} = require("../footer.js")
const Canvas = require('canvas');
const {registerFont, createCanvas} = require('canvas')
const { join } = require('path')

registerFont('Black Ravens.ttf', {family: 'Black Ravens' })

module.exports.run = async (m, config, args) => {

		if(args.length == 1){

			if(config.levelsenabled == false){
				return m.reply("Levels are disabled.");
			}


			let messagecount = config.levels[m.author.id];

			let level = Math.floor(messagecount / config.levelrate);
			let messagesleft = config.levelrate - messagecount % config.levelrate;

			const canvas = Canvas.createCanvas(700, 250);
			const ctx = canvas.getContext('2d');

			const profileimage = await Canvas.loadImage(m.author.avatarURL({extension: 'jpg'}));

			const background = await Canvas.loadImage('./levelbackground.png')

			ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

			ctx.globalAlpha = 0.25;
			ctx.fillStyle = config.embedcolor;
			ctx.fillRect(0, 0, 700, 250);


			ctx.globalAlpha = 0.25;
			ctx.fillStyle = "white";

			ctx.fillRect(15, 15, 670, 220)
			ctx.globalAlpha = 1;

			ctx.font = '300px "Black Ravens"';
			ctx.fillStyle = "white"
			ctx.lineWidth = 8;
			ctx.globalAlpha = 0.2;
			ctx.textAlign = "center";

			ctx.fillText(m.member.displayName, 350, 225);
			ctx.strokeText(m.member.displayName, 350, 225);

			ctx.textAlign = "left";

			ctx.globalAlpha = 1;


			ctx.fillStyle = "black";
			ctx.lineWidth = 8;
			ctx.strokeRect(30, 50, 150, 150)
			ctx.drawImage(profileimage, 30, 50, 150, 150);

			ctx.lineWidth = 6;
			ctx.font = '40px "Black Ravens"';
			ctx.strokeStyle = "black";
			ctx.fillStyle = "white"

			let dy = 30;

			ctx.strokeText("Level " + level, 200, 130 - dy);
			ctx.fillText("Level " + level, 200, 130- dy);

			ctx.strokeText("Level " + (level+1), 540, 130- dy);
			ctx.fillText("Level " + (level+1), 540, 130- dy);

			ctx.strokeText(messagesleft + " messages left!", 305, 205- dy);
			ctx.fillText(messagesleft + " messages left!", 305, 205- dy);

			let portionleft = messagesleft / config.levelrate;

			ctx.globalAlpha = 0.5;

			ctx.fillRect(200, 140- dy, 420, 30)

			ctx.globalAlpha = 1;

			ctx.fillRect(200, 140- dy, (1-portionleft)*420, 30)

			ctx.lineWidth = 4;
			ctx.strokeRect(200, 140- dy, 420, 30)

			const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'profile-image.png' });

			return m.reply({files: [attachment]});


		}



		if(args[1] == "settings"){

			const embed = new EmbedBuilder()
			.setColor(config.embedcolor)
			.setTitle('Level settings')
			.addFields({

				name: 'Settings', value: `

				Enabled: *${config.levelsenabled+""}*
				Channel: ${config.levelchannel == null ? '*None*' : `<#${config.levelchannel}>`}
				Rate: ${config.levelrate}`

			},
			{name: 'Commands', value:"```"+`
${config.prefix}level settings
${config.prefix}level channel set
${config.prefix}level channel remove
${config.prefix}level enable
${config.prefix}level disable
${config.prefix}level rate <messages needed to level up>`+"```"}

				)
			.setFooter(footer())

			m.reply({ embeds: [embed] });


		}

		if(args[1] == "enable"){


			config.levelsenabled = true;

			m.reply("Levels are now enabled in this server.")

		}

		if(args[1] == "disable"){

			config.levelsenabled = false;

			m.reply("Levels are now disabled in this server.")

		}


		if(args[1] == "channel"){

			if(args.length == 2){


				let channel = config.levelchannel;

				if(channel == null){
					return m.reply("there is no channel set")
				}
				else{

					let foundchannel = m.guild.channels.cache.find(c => c.id == channel);

					if(foundchannel == null){

						config.levelchannel = null;

						return m.reply("there is no channel set");
					}
					else{
							m.reply("current channel is " + foundchannel.name);
					}

				}

			}

			if(args[2] == "set"){

				config.levelchannel = m.channel.id;
				m.reply("level channel set to " + m.channel.name + "! do " + config.prefix + "channel remove to remove the level channel.")

			}
			if(args[2] == "remove"){

				config.levelchannel = null;
				m.reply("message channel has now been removed, whenever someon levels up, it will tell them in the channel that htey leveled up in")


			}




		}

		if(args[1] == "rate"){

			if(args.length == 2){
				return m.reply("Current level rate is " + config.levelrate + " messages");
			}
			else{

				let amount = parseInt(args[2]);

				if(amount+"" == "NaN"){

					return m.reply(args[2] + " is not a valid number");


				}
				else{

					config.levelrate = amount;
					return m.reply("Leveling rate is now " + config.levelrate + " messages");

				}


			}


		}
}

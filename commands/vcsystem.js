const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")

module.exports.run = async (oldUser, newUser, config) => {


  let oldId = oldUser.channelId;
  let newId = newUser.channelId;
  let id = newUser.id;
  let member = newUser.guild.members.cache.find(m => m.id == id);

  categoryfilter(config, newUser.guild);

  if(config.voicecategory != null){

    if(newId == config.voicecategory){

      let currentchannel = newUser.guild.channels.cache.find(c => c.id == config.voicecategory);

      if(id in config.voicechannels){

        let voicechannel = newUser.guild.channels.cache.find(c => c.id == config.voicechannels[id].id);
        newUser.setChannel(voicechannel);

      }
      else{

        let voicechannel = await newUser.guild.channels.create({

          name: member.user.tag,
          type: ChannelType.GuildVoice,
          parent: currentchannel.parent,



        })

        config.voicechannels[id] = {
          id: voicechannel.id,
          banlist: {

          }
        };

        newUser.setChannel(voicechannel);



      }

      return;


    }

    if(newId != oldId && oldId != null){

      let keys = Object.keys(config.voicechannels);

      for(var i = 0; i < keys.length; i++){

        if(config.voicechannels[keys[i]].id == oldId){

          let voicechannel = newUser.guild.channels.cache.find(c => c.id == oldId);

          if(voicechannel.members.size == 0){

            voicechannel.delete();
            delete config.voicechannels[keys[i]];
            break;

          }


        }


      }

      return;


    }

    if(newId != null && newId != oldId){


      let keys = Object.keys(config.voicechannels);

      for(var i = 0; i < keys.length; i++){

        if(config.voicechannels[keys[i]].id == newId){

          if(id in config.voicechannels[keys[i]].banlist){

            newUser.disconnect();

          }

        }

      }

      return;

    }


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

				L: for(var i = 0; i < keys.length; i++){
					for(var j = 0; j < channellist.length; j++){
						if(currentchannels[keys[i]].id == channellist[j]){
							continue L;
						}
					}
					delete currentchannels[keys[i]];
				}

			}
			else{
				config.voicechannels = {};
				config.voicecategory = null;
			}

}

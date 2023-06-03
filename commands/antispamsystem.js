const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js");
const {jailmembers} = require("./jail.js");
const fs = require("fs");

module.exports.runchat = async (m, config, args, client) => {

  if(config.antispam == false) return;

  userspam(m, config, args, client);

  channelspam(m, config, args);


}

module.exports.runmember = async (config, member) => {



  let memberspamtime = 20;
  let memberspamcount = 8;

  if(config.antiraid == false) return;

  if("antispammember" in config == false){
    config.antispammember = {
      members: []
    }
  }

  //config.antispammember.members.push(member.id);

  if(config.antispammember.members.find(m => m == member.id) == null) config.antispammember.members.push(member.id);
  else return;

  let interval = setTimeout(() => {

    config.antispammember.members.shift();

    if(config.antispammember.members.length < memberspamcount && "kickedmembers" in config.antispammember){

      let logchannel = config.logchannel;
      if(logchannel != null) logchannel = member.guild.channels.cache.find(c => c.id == logchannel);

      if(logchannel != null){

        let userlist = "";
        let kickedmembers = config.antispammember.kickedmembers;

        for(var i = 0; i < kickedmembers.length; i++){
          userlist += `${kickedmembers[i]}\n`;
        }

        userlist = userlist.length == 0 ? `None` : userlist;

        fs.writeFileSync("../banlist.txt", userlist);

        const embed = new EmbedBuilder()
        .setColor(config.embedcolor)
        .setTitle('Spam has ended')
        .addFields(

          { name: 'User-count', value: `${kickedmembers.length} users` },

        )
        .setFooter(footer());

        logchannel.send({embeds: [embed]});
        logchannel.send({files: ["../banlist.txt"]})

        delete config.antispammember.kickedmembers;

      }


    }

  }, memberspamtime * 1000)

  if(config.antispammember.members.length >= memberspamcount){

    let members = config.antispammember.members;
    let logchannel = config.logchannel;
    if(logchannel != null) logchannel = member.guild.channels.cache.find(c => c.id == logchannel);

    if(config.antispammember.members.length - 1 < memberspamcount){


      config.antispammember.kickedmembers = [];

      if(logchannel != null){

        const embed = new EmbedBuilder()
        .setColor(config.embedcolor)
        .setTitle('Spam!')
        .setDescription(`The guild is getting spammed with members! ⚠️\n*Currently banning new members...*`)
        .setFooter(footer());

        logchannel.send({embeds: [embed]})
      }



    }


    for(var i = 0; i < members.length; i++){

      member.guild.members.fetch(members[i]).then(async m =>{


        if(config.antispammember.kickedmembers.indexOf(m.user.tag) == -1){

          config.antispammember.kickedmembers.push(m.user.id);

          m.createDM().then(dmchannel => {

            dmchannel.send("You were banned from the server because we think you are a raider.")
            m.ban().then(m2 => {

            }).catch(err2 => {

              console.log("failed to ban");

            });

          }).catch(err => {

            m.ban().then(m2 => {

            }).catch(err2 => {

              console.log("failed to ban");

            });

          })



        }

      });



    }


  }


}

module.exports.runkick = async (config, member, client) => {

  if(config.antimembernuke == false) return;

  let logs = await member.guild.fetchAuditLogs({type: AuditLogEvent.MemberKick})
  let entry = logs.entries.find(entry => entry.target.id == member.id)
  let executor = entry.executor;

  banspam(executor, member, config, client, member.guild);

};

module.exports.runban = async (config, ban, client) => {

  if(config.antimembernuke == false) return;

  let executor = ban.guild.members.cache.find(m => m.id == ban.client.user.id);
  let victim = ban.guild.members.cache.find(m => m.id == ban.user.id);

  banspam(executor, victim, config, client, ban.guild);

}

module.exports.runchanneldelete = async (config, channel, client) => {

  if(config.antichannelnuke == false) return;

  let channelcount = 2;
  let channeltime = 2;

  if("antispamchanneldelete" in config == false){
    config["antispamchanneldelete"] = {}
  }

  const channelDeleteId = channel.id;

  let logs = await channel.guild.fetchAuditLogs({type: AuditLogEvent.ChannelDelete})

  let entry = logs.entries.find(entry => entry.target.id == channelDeleteId)

  let antispam = config.antispamchanneldelete;

  if(entry != null){

    let author = entry.executor;

    if(author.id in antispam == false){

      antispam[author.id] = {

        channels: [],
        id: 0,
        user: author

      }

    }

    antispam[author.id].channels.push(channel);

    let currentid = antispam[author.id].id;

    setTimeout(() => {

      if(currentid == antispam[author.id].id){
        antispam[author.id].channels.shift();
      }

    }, channeltime * 1000);

    if(antispam[author.id].channels.length >= channelcount){

      antispam[author.id].id++

      let safetyid = antispam[author.id].id;

      if(antispam[author.id].channels.length == channelcount){
        channel.guild.members.ban(author.id).then(m => {
          antispam[author.id].banned = true;
        }).catch(err => {
          antispam[author.id].banned = false;
        });
      }

      setTimeout(() => {

        if(antispam[author.id].id == safetyid){


          let logchannel = config.logchannel;

          if(logchannel != null) logchannel = channel.guild.channels.cache.find(c => c.id == logchannel);

          if(logchannel != null){

            let channellist = ``;

            for(var i = 0; i < antispam[author.id].channels.length; i++){

              channellist += `${antispam[author.id].channels[i].name}\n`;

            }


            const embed = new EmbedBuilder()
            .setColor(config.embedcolor)
            .setTitle('Channel Nuker!')
            .setDescription(`*Attempting to recreate channels deleted by the nuker...*`)
            .addFields({

              name: "Nuker",
              value: `<@${author.id}>`

            },
            {

              name: "Banned",
              value: `${antispam[author.id].banned ? 'Yes' : `No⚠️`}`


            },
            {
              name: "Deleted channels",
              value: channellist
            })
            .setFooter(footer());

            logchannel.send({embeds: [embed]})
          }

          for(var i = 0; i < antispam[author.id].channels.length; i++){

            let deletedchannel = antispam[author.id].channels[i];

            channel.guild.channels.create({

              name: deletedchannel.name,
              type: deletedchannel.type,
              permissionOverwrites: deletedchannel.permissionOverwrites.cache

            })

          }

          delete antispam[author.id];




        }


      }, 3000)




    }




  }



}

function channelspam(m, config, args){
  let channelspamcount = 50;
  let channelspamtime = 18

  if("antispamchannels" in config == false){
    config.antispamchannels = {};
  }

  if(m.channel.id in config.antispamchannels == false){
    config.antispamchannels[m.channel.id] = {

      messages: [],
      messagecount: 0,
      count: 0,

    }
  }

  //console.log(config.antispamchannels);

  let channelconfig = config.antispamchannels[m.channel.id]

  channelconfig.messagecount++;

  let countnum = channelconfig.count;

  let interval = setTimeout(() => {

    if(channelconfig.count == countnum){
      channelconfig.messagecount--;
    }
  }, channelspamtime * 1000);

  if(channelconfig.messagecount >= channelspamcount){

    channelconfig.count++;
    channelconfig.messagecount = 0;

    m.channel.send(`This channel is now locked.`);

    m.channel.permissionOverwrites.edit(m.guild.roles.everyone, {
      SendMessages: false,
    })

    let logchannel = config.logchannel;

    if(logchannel != null) logchannel = m.guild.channels.cache.find(c => c.id == logchannel);
    if(logchannel != null){

      const embed = new EmbedBuilder()
      .setColor(config.embedcolor)
      .setTitle('Spam!')
      .setDescription(`A channel has been locked for spam.`)

      embed.addFields(
        { name: 'Channel', value: `<#${m.channel.id}>`},
      )
      .setFooter(footer());

      logchannel.send({embeds: [embed]})
    }

  }
}

function userspam(m, config, args, client){
  let userspamcount = 8;
  let userspamtime = 12;
  let userspamchances = 1;

  if("antispamusers" in config == false){
    config.antispamusers = {};
  }

  if(m.author.id in config.antispamusers == false){
    config.antispamusers[m.author.id] = {

      messages: [],
      messagecount: 0,
      warning: 0,
      warningid: 0

    }
  }

  let userconfig = config.antispamusers[m.author.id]

  userconfig.messagecount++;

  let warningnum = userconfig.warningid;

  let interval = setTimeout(() => {
    if(userconfig.warningid == warningnum){
      userconfig.messagecount--;
    }
  }, userspamtime * 1000);

  if(userconfig.messagecount >= userspamcount){

    userconfig.warning++;
    userconfig.warningid++;

    userconfig.messagecount = 0;

    if(userconfig.warning > userspamchances){
      delete userconfig;
      m.channel.send(`Sending <@${m.author.id}> to prison...`);
      jailmembers([m.member], config, m.guild, client)

      let logchannel = config.logchannel;
      if(logchannel != null) logchannel = m.guild.channels.cache.find(c => c.id == logchannel);
      if(logchannel != null){

        const embed = new EmbedBuilder()
        .setColor(config.embedcolor)
        .setTitle('Spam!')
        .setDescription(`A user has been jailed for spam.`)

        embed.addFields(
          { name: 'User', value: `<@${m.author.id}>`},
          { name: 'Channel', value: `<#${m.channel.id}>`, inline:true}

        )
        .setFooter(footer());

        logchannel.send({embeds: [embed]})
      }
    }
    else{
      return m.reply(`Warning, do not spam, or you will be banned.`);
    }

  }
}

function banspam(executor, victim, config, client, guild){

    let bancount = 3;
    let bantime = 5;

    if(executor.id == client.user.id) return;

    if("antispamban" in config == false){
      config.antispamban = {

      }
    }

    if(executor.id in config.antispamban == false){
      config.antispamban[executor.id] = {

        members: [],
        id: 0

      }
    }

    console.log(config.antispamban)

    let profile = config.antispamban[executor.id]

    profile.members.push(victim);

    let currentid = profile.id;

    setTimeout(() => {

      if(profile.id == currentid){
          config.antispamban[executor.id].members.shift();
      }

    }, bantime * 1000);

    if(profile.members.length >= bancount){

      console.log("NUKER!");

      profile.id++;

      guild.members.ban(executor.id).then(m => {
        profile.banned = true;
      }).catch(err => {
        profile.banned = false;
      });


      let safetyid = profile.id;

      setTimeout(async () => {

        if(safetyid == profile.id){


          let logchannel = config.logchannel;

          await guild.channels.fetch();

          if(logchannel != null) logchannel = guild.channels.cache.find(c => c.id == logchannel);

          if(logchannel != null){

            let userlist = "";
            let kickedmembers = profile.members;

            for(var i = 0; i < kickedmembers.length; i++){
              userlist += `${kickedmembers[i].id}\n`;
              guild.members.unban(kickedmembers[i]).then(m => {

              }).catch(err => {

              });
            }

            userlist = userlist.length == 0 ? `None` : userlist;

            fs.writeFileSync("../banlist.txt", userlist);

            const embed = new EmbedBuilder()
            .setColor(config.embedcolor)
            .setTitle('Nuker!')
            .setDescription(`*Attempting to unban users that were banned by the nuker...*`)
            .addFields(

              { name: 'Ban-count', value: `${kickedmembers.length} users` },
              { name: 'Nuker', value: `<@${executor.id}>` },
              { name: 'Banned?', value: `${profile.banned ? `Yes` : `No⚠️`}`}

            )
            .setFooter(footer());

            logchannel.send({embeds: [embed]});
            logchannel.send({files: ["../banlist.txt"]})

            delete config.antispamban[executor.id];

          }

          delete profile;

        }

      }, 3000)


    }

}

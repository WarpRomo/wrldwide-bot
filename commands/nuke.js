const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType} = require("discord.js");
const {footer} = require("../footer.js")
const fs = require("fs");

module.exports.run = async (m, config, args) => {

/*
	    if(args.length == 1){


	      const embed = new EmbedBuilder()
	      .setColor(config.embedcolor)
	    	.setTitle('Nuke Settings')
	    	.addFields(

	        { name: 'Nuke Enabled', value: `Value: **${config.nukeenabled}**
	        -*Whether nuke prevention should be enabled or not.*
	        ${config.prefix}nuke [enabled OR disable] [passcode]` },

	        { name: 'Nuke Member Limit', value: `Value: **${config.nukemembercount}** members
	        -*If this many members are banned, nuke prevention will execute if it is enabled.*
	        ${config.prefix}nuke count [amount]` },

	    		{ name: 'Nuke Time Window', value: `Value: **${config.nuketimewindow}** seconds
	        *-If **${config.nukemembercount}** members are banned by someone within **${config.nuketimewindow}** seconds, they will lose their admin privileges.*
	        ${config.prefix}nuke time [seconds]` },
	    	)
	    	.setFooter(footer());


	      m.reply({ embeds: [embed] });

	    }

	    else if(args[1] == "time"){

	      if(args.length == 2){

	        m.reply("nuke time window is " + config.nuketimewindow);

	      }
	      else{

	        let value = parseInt(args[2]);

	        if(value+"" == "NaN"){

	          m.reply("invalid nuke time value: '" + args[2] + "'");

	        }
	        else{

	          config.nuketimewindow = value;
	          m.reply("changed nuke time window to " + args[2]);

	        }

	      }

	    }

	    else if(args[1] == "count"){

	      if(args.length == 2){

	        m.reply("nuke count is " + config.nukemembercount);

	      }
	      else{

	        let value = parseInt(args[2]);

	        if(value+"" == "NaN"){

	          m.reply("invalid nuke count value: '" + args[2] + "'");

	        }
	        else{

	          config.nukemembercount = value;
	          m.reply("changed nuke member count to " + args[2]);

	        }

	      }

	    }

	    else if(args[1] == "enable" || args[1] == "disable"){
	      enableordisable(m, args);
	    }

	    else if(args[1] == "test"){

				let logchannel = config.logchannel;

				if(logchannel != null) logchannel = m.guild.channels.cache.find(c => c.id == logchannel);

	      if(logchannel == null){
					config.logchannel = null;
	        m.reply("Set a log channel to do that.");

	      }
	      else{

	        let exampleusers = "Example#0001\nExample#0001\nExample#0001\nExample#0001\nExample#0001\nExample#0001\nExample#0001\nExample#0001\nExample#0001"

	        fs.writeFileSync("./banlist.txt", exampleusers);

	        const embed = new EmbedBuilder()
	        .setColor(config.embedcolor)
	        .setTitle('NUKER DETECTED!')
	        .setAuthor({ name: m.author.tag, iconURL: m.author.avatarURL() })
	        .addFields(

	          { name: 'Banned? ', value: `FALSE :warning:` },

	          { name: 'Amount banned? ', value: `20 members :warning:` },

	        )
	        .setFooter(footer());


	        m.reply({ embeds: [embed] });
	        m.reply({ files: ["./banlist.txt"] })

	      }

	    }

	    else{

	      m.reply("that is not one of the commands")


	    }
*/
}

function enableordisable(m, args){

  let verb = args[1] == "enable" ? "Enabling" : "Disabling"
  let state = nukeenabled ? "Enabled" : "Disabled";

  if(args.length == 2){





    m.reply("Nuke protection is currently " + state + ", if you'd like to change this, enter the pass-key aswell")

  }
  else{

    if(args[2] == nukepasskey){

      if(nukeenabled != (args[1] == "enable")){
        m.reply(verb + " nuke protection...")
        nukeenabled = true;
      }
      else{
        m.reply("Nuke protection is already " + state + "!")
      }

    }
    else{
      m.reply("That is not the correct pass code")
    }


  }


}

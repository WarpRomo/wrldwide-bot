const {Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, MessageAttachment, AuditLogEvent, ChannelType, Partials} = require("discord.js");
const fs = require("fs");
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildBans,

	],
	partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});


let serverconfig = {

};


serverconfig = JSON.parse(fs.readFileSync("config.json"));

let botconfig = JSON.parse(fs.readFileSync("botconfig.json"));

client.login(botconfig.token);



let template = {
	"nuketimewindow": 10,
	"nukemembercount": 5,
	"nukeenabled": false,
	"nukepasskey": "fjweklfje",
	"prefix": ".",
	"embedcolor": "#0000ff",
	"logchannel": null,
	"reactionroles":{

	},
	"welcomeenabled": false,
	"welcomechannel": null,
	"levels":{

	},
	"jailrole": null,
	"jailchannel": null,
	"jailedusers":{

	},
	"levelchannel": null,
	"levelsenabled": false,
	"levelrate": 20,
	"levels":{

	},
	"reactionroles":{

	},
	"ticketcategory": null,
	"ticketcount": 0,
	"ticketroles":{

	},
	"ticketadminroles":{

	},
	"voicechannels":{

	},
	"voicecategory": null,
	"welcometemplate": "Howdy, <user>",
	"antiraid": true,
	"antimembernuke": true,
	"antichannelnuke": true,
	"antispam": true,
	"pfprandomchannel": null,
	"pfprandomlist": []
}

let admincommands = [
	"embedcolor",
	"jail",
	"level settings",
	"level enable",
	"level disable",
	"level channel",
	"level rate",
	"log",
	"nuke",
	"prefix",
	"reactionrole",
	"vc creator",
	"welcome",
	"ticket",
	"pfprandom channel",
	"pfprandom adminroles"
]

let commands = {};

loadcommands();
setInterval(loadcommands, botconfig.loadcommandrate)

function loadcommands(){

	fs.readdirSync("./commands").forEach(file => {

		if(file.endsWith(".js")){

			let name = file.split(".js")[0];
			let path = "./commands/" + file
			delete require.cache[fs.realpathSync(path)];

			commands[name] = require(path);
		}

	})
}


function getConfig(guildid){

	if(guildid in serverconfig == false){

		console.log("make template")
		serverconfig[guildid] = JSON.parse(JSON.stringify(template));

	}

	return serverconfig[guildid];

}

writeconfig();
setInterval(writeconfig, botconfig.saverate)

function writeconfig(){

	let unwantedkeys = ["antispammember", "antispamchannels", "antispamusers", "antispamchanneldelete"];

	let serverkeys = Object.keys(serverconfig);
	let keystemplate = Object.keys(template);

	let copy = JSON.parse(JSON.stringify(serverconfig));

	for(var j = 0; j < serverkeys.length; j++){

		for(var i =0 ; i < keystemplate.length; i++){
			if(keystemplate[i] in serverconfig[serverkeys[j]] == false){
				serverconfig[serverkeys[j]][keystemplate[i]] = template[keystemplate[i]];
			}
		}


		for(var i = 0; i < unwantedkeys.length; i++) delete copy[serverkeys[j]][unwantedkeys[i]];

	}

	fs.writeFileSync("config.json", JSON.stringify(copy));
}



client.on('messageReactionAdd', async (reaction, user) => {

	if(reaction.message.guildId == null) return;
	if(user.bot) return;

	let config = getConfig(reaction.message.guildId)
  commands["reactionrolesystem"].run(reaction, config, user, true)

});

client.on('messageReactionRemove', async (reaction, user) => {

	if(reaction.message.guildId == null) return;
	if(user.bot) return;

	let config = getConfig(reaction.message.guildId)
  commands["reactionrolesystem"].run(reaction, config, user, false)

});

client.on('voiceStateUpdate', (oldUser, newUser) => {

	let config = getConfig(newUser.guild.id)
	commands['vcsystem'].run(oldUser, newUser, config);


})

client.on('channelDelete', channel => {
  // get the channel ID

	let config = getConfig(channel.guild.id);

	commands["antispamsystem"].runchanneldelete(config, channel, client)

})



client.on("ready", () =>{

  console.log("READY");

})

client.on("interactionCreate", async (interaction) => {

	let config = getConfig(interaction.member.guild.id+"");

	if(interaction.customId.startsWith("ticket")){

		commands["ticketsystem"].run(interaction, config, client);


	}

	if(interaction.customId.startsWith("pfprandom")){
		commands["pfprandomsystem"].run(interaction, config, client);
	}



})

let userbans = {

};


client.on("guildMemberAdd", async (member) => {

	let config = getConfig(member.guild.id+"");

	commands["welcomesystem"].run(config, member);

	commands["antispamsystem"].runmember(config, member);

})

client.on("guildBanAdd", async (ban) => {

	let config = getConfig(ban.guild.id+"");

	commands["antispamsystem"].runban(config, ban, client);


})

client.on("messageCreate", async m => {

  if(m.author.bot) return;

	let config = getConfig(m.guild.id+"");
  let args = m.content.split(" ").filter(e => e.length > 0);
	let prefix = config.prefix

	commands["adminsystem"].run(m, config, args, admincommands);

	if(config.levelsenabled){
		commands["levelingsystem"].run(m, config, args)
	}

	if(args[0] == prefix + "help"){
		commands["help"].run(m, config, args);
	}

	if(args[0] == prefix + "prefix"){
		commands["prefix"].run(m, config, args);
	}

	if(args[0] == prefix + "reactionrole"){
		commands["reactionrole"].run(m, config, args, client)
	}

	if(args[0] == prefix + "level"){
		commands["level"].run(m, config, args)
	}

  if(args[0] == prefix + "nuke"){
		commands["nuke"].run(m, config, args)
  }

  if(args[0] == prefix + "color"){
		commands["color"].run(m, config, args)
  }

  if(args[0] == prefix + "log"){
		commands["log"].run(m, config, args)
  }

	if(args[0] == prefix + "ticket"){
		commands["ticket"].run(m, config, args)
	}

	if(args[0] == prefix + "jail"){
		commands["jail"].run(m, config, args, client)
	}

	if(args[0] == prefix + "welcome"){
		commands["welcome"].run(m, config, args)
	}

	if(args[0] == prefix + "vc"){
		commands["vc"].run(m, config, args)
	}

	commands["pfprandomcollector"].run(m, config, args);

	if(args[0] == prefix + "pfprandom"){
		commands["pfprandom"].run(m, config, args);
	}

	commands["antispamsystem"].runchat(m, config, args, client);

	if(args[0] == prefix + "antispam"){
		commands["antispam"].run(m, config, args);
	}

	if(args[0] == prefix + "antiraid"){
		commands["antiraid"].run(m, config, args);
	}

	if(args[0] == prefix + "antichannelnuke"){
		commands["antichannelnuke"].run(m, config, args);
	}

	if(args[0] == prefix + "antimembernuke"){
		commands["antimembernuke"].run(m, config, args);
	}

})

client.on('guildMemberRemove', async member => {

	let config = getConfig(member.guild.id+"");

	commands["antispamsystem"].runkick(config, member, client);

});
/*
async function addcount(user, victim, guild){

		let config = getConfig(guild.id+"");

    if(user.id in userbans == false){
      userbans[user.id] = {count: 1, users: [victim]};
    }
    else{
      userbans[user.id].count++;
      userbans[user.id].users.push(victim);

      if(userbans[user.id] >= config.nukemembercount){


        let member = await guild.members.fetch(user.id);

        let rolestoremove = [];

        member.roles.cache.forEach(role => {

          if(role.permissions.any((1 << 3))){

            rolestoremove.push(role);

          }


        })

        member.roles.remove(rolestoremove);

        logchannel.send("boom prevented");

      }

    }

    setTimeout(() => {

      userbans[user.id]--;

    }, config.nuketimewindow * 1000);





}
*/

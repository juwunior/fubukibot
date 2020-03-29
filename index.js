const Eris = require("eris-additions")(require("eris"))
const sagiri = require("sagiri");
const config = require("./config.json");

const wa = require('./wa.js')
const client = sagiri('246aadb10c16be60d562076bb748bba5bfc56fcb');

var bot = new Eris.CommandClient(config.d_token, {}, {
    description: "Um bot que busca imagem de anime",
    owner: "color",
    prefix: "!"
});

bot.on("ready", (msg) => {
    console.log(msg)
	game = {};
	game.name = "color chan!";
	game.type = 2;
	bot.editStatus("idle", game);
	console.log('Ready!');
});

$jamId = '<@441387335402258432>';

bot.registerCommand("ping", "pong", { description: "Test command" });

bot.registerCommand("sauce", async (msg, args) => {
	console.log(msg.content)
    splitmessage = msg.content.split(" ")
    if (splitmessage.length == 2) {
        image = splitmessage[1]
    } else {
        const urls = [];
        const responses = await bot.getMessages(msg.channel.id, 10);
        responses.forEach(res => { if (res.attachments.length > 0) urls.push(res.attachments[0].url); else if (res.embeds.length > 0 && res.embeds[0].type == 'image') urls.push(res.embeds[0].url) });
        image = urls[0];
    }
    const b64 = await wa.imgtob64(image)
    const json = await wa.callapi(b64)
    const anime = await wa.parsejson(json)
    bot.createMessage(msg.channel.id, {
        embed: {
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            url: anime.link,
            title: anime.title_romaji,
            color: 0xFF0000,
            fields: [
                { name: "Título romaji", value: anime.title_romaji, inline: true },
                { name: "Título japonês", value: anime.title_japanese, inline: false },
                { name: "Episódio", value: anime.episode, inline: false },
                { name: "Em", value: anime.at, inline: true } 
            ],
            footer: { 
                text: "Encontrado com trace.moe",
                icon_url: "https://trace.moe/favicon.png"
            },
            thumbnail: { url: image }
        }
    })
}, {
    description: "Find the anime of the provided picture (attachment).",
    usage: "attach an image.",
    fullDescription: "This command uses trace.moe to find which anime your picture is from. To use this correctly type !whatanime and add an image attachment."
});

bot.registerCommand("saucenao", async (msg, args) => {
    splitmessage = msg.content.split(" ")
    if (splitmessage.length == 2) {
        image = splitmessage[1]
    } else {
        const urls = [];
        const responses = await bot.getMessages(msg.channel.id, 20);
        responses.forEach(res => { if (res.attachments.length > 0) urls.push(res.attachments[0].url) });
        console.log(urls)
        image = urls[0];
    }
    
	var result = []; 
	
	const sauce = await client(image);
	if(sauce == 0){
		return 'Sem resultados!';
	}
	result.push({name: 'similarity', value: String(sauce[0].similarity)});
	Object.keys(sauce[0].raw.data).forEach(function(key) {
		var value = sauce[0].raw.data[key];
		if(typeof(value) == 'object'){
			value = value[0];
		}
		result.push({name: key, value: value, inline: true});
	});
	
	bot.createMessage(msg.channel.id, {
        embed: {
            author: {
                name: msg.author.username,
                icon_url: msg.author.avatarURL
            },
            url: sauce[0].url,
            title: sauce[0].site,
            color: 0xFF0000,
            fields: result,
            footer: { 
                text: "Encontrado com sauceNAO",
            },
            thumbnail: { url: image }
		}
	});
	
}, {description: "SauceNAO test command!"});

bot.connect();
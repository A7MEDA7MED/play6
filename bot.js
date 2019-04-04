const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, Util } = require('discord.js');
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const prefix = "6"

/*
البكجآت
npm install discord.js
npm install ytdl-core
npm install get-youtube-id
npm install youtube-info
npm install simple-youtube-api
npm install queue
*/
 
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`); //هنا تسجيل بسيط بالكونسل
client.user.setStatus('dnd')// هنا التغيير 
});
  client.on('ready', () => {
     client.user.setActivity("! ' DARK ♪",{type: 'LISTENING'});
 
});
 
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
client.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('**:x: Please specify a filename.**');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('لا يتوآجد لدي صلاح��ة للتكلم بهذآ الروم');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
        if (!permissions.has('EMBED_LINKS')) {
            return msg.channel.sendMessage("")
        }
 
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`);
        } else {
            try {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                    const embed1 = new Discord.RichEmbed()
                    .setDescription(`**اختر رقم المقطع : ** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    .setFooter("by ! ' DARK ♪", 'https://cdn.discordapp.com/avatars/419573470964482048/e73fcf40540f124b437c76da1e30be36.png?size=2048')
                    msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
                   
                    // eslint-disable-next-line max-depth
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 15000,
                            errors: ['time']
                        });//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send('');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send('** يرجى التأكد من الرابط **');
                }
            }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
            return handleVideo(video, msg, voiceChannel);
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('');
        if (!serverQueue) return msg.channel.send('');
        serverQueue.connection.dispatcher.end('**:stop_button: ProQueue finished!!**');
        return undefined;
    } else if (command === `stop`) {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!msg.member.voiceChannel) return msg.channel.send('');
        if (!serverQueue) return msg.channel.send('**I‘m not playing anything :unamused:**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('k :cry:');
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('');
        if (!serverQueue) return msg.channel.send('');
        if (!args[1]) return msg.channel.send(`:loud_sound: Volume: **${serverQueue.volume}**`);
        serverQueue.volume = args[1];//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`**:loud_sound: Volume:** **${args[1]}**`);
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('**I‘m not playing anything :unamused:.**');
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: Music playing : **${serverQueue.songs[0].title}**`)
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `queue`) {
        //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!serverQueue) return msg.channel.send('**I‘m not playing anything :unamused:.**');
        let index = 0;
        //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        const embedqu = new Discord.RichEmbed()
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**Music playing** ${serverQueue.songs[0].title}`)
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('k :unamused:');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        return msg.channel.send('**I‘m not playing anything :unamused:**');
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('k :slight_smile:');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        return msg.channel.send('**I‘m not playing anything :unamused:.**');
    }
 
    return undefined;
});
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
//  console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        queue.set(msg.guild.id, queueConstruct);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        queueConstruct.songs.push(song);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`);
        }
    } else {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
    }
    return undefined;
}//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    console.log(serverQueue.songs);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            play(guild, serverQueue.songs[0]);
        })//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        .on('error', error => console.error(error));//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
    serverQueue.textChannel.send(`Music playing   **${song.title}**`);
}//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
//copyright code & ♯ 𝐑eBeL .#0001 ©






client.on('message', message => {
if (message.content.startsWith('6help')) { //DiamondCodes - [ X_KillerYT ]
    let pages = [`
***__ الميوزك__***
**
        ***__أوامر الميوزك__***
**
**
**◇ dplay ~ لتشغيل مقطع 
◆ dplay Adele - Hello
◇ dskip ~ لتخطي الاغنيه الحالية 
◆dskip
◇dstop ~ لأيقاف تشغيل اغنيه والخروج من الروم الصوتي
◆dstop
◇dpause ~ لأيقاف الاغنيه مؤقتا 
◆dpause
◇dresume لتكملة تشغيل الاغنيه
◆dresume
◇drepeat لتكرار الاغنيه 
◆drepeat
◆dnp اظهار الاغنية اللي انت مشغلها حاليا
◆dnp
◇dvol ~ لإظهار مستوي الصوت الحالي / تغيير درجه الصوت
◆dvol ~ #vol 100 ~ #vol 50**
    ! ' DARK ♪ 
`]
    let page = 1;
 
    let embed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setDescription(pages[page-1])
 
    message.author.sendEmbed(embed).then(msg => {
 
        msg.react('').then( r => {
            msg.react('')
 
 
        const backwardsFilter = (reaction, user) => reaction.emoji.name === '' && user.id === message.author.id;
        const forwardsFilter = (reaction, user) => reaction.emoji.name === '' && user.id === message.author.id;
 
 
        const backwards = msg.createReactionCollector(backwardsFilter, { time: 2000000});
        const forwards = msg.createReactionCollector(forwardsFilter, { time: 2000000});
 
 
 
        backwards.on('collect', r => {
            if (page === 1) return;
            page--;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        forwards.on('collect', r => {
            if (page === pages.length) return;
     
      page++;
            embed.setDescription(pages[page-1]);
            embed.setFooter(`Page ${page} of ${pages.length}`);
            msg.edit(embed)
        })
        })
    })
    }
});

    let emoji = client.guilds.get("534014192445947915").emojis.find(r => r.name === ":505815002570031177:");





client.login(process.env.BOT_TOKEN)

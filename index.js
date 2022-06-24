const TOKEN = "h";
const GUILD = "h";

import { ChannelType, Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";

const rest = new REST({ version: 10 }).setToken(TOKEN);
const channels = await rest.get(Routes.guildChannels(GUILD));

async function unarchive(thread) {
  console.log("Unarchiving", thread.name);
  await rest.patch(Routes.channel(thread.id), {
    body: { archived: false },
    headers: { "Content-Type": "application/json" }
  });
}

async function getThreads(channel) {
  const { threads: publicThreads } = await rest.get(Routes.channelThreads(channel.id, "public"));
  const { threads: privateThreads } = await rest.get(Routes.channelThreads(channel.id, "private"));
  return [...publicThreads, ...privateThreads];
}

for (const channel of channels) {
  if (channel.type === ChannelType.GuildText) {
    const threads = await getThreads(channel);
    for (const thread of threads) await unarchive(thread);
  }
}
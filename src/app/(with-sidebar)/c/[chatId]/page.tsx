import type { Message } from './Chat';

import { Chat } from './Chat';

export default async function ChatPage({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const messages: Message[] = [
    { id: '1', text: 'Foo', role: 'user' },
    { id: '2', text: 'Bar', role: undefined },
    { id: '3', text: 'Baz', role: 'user' },
    { id: '4', text: 'Bez', role: undefined },
    { id: '5', text: overflowMessage, role: 'user' },
    { id: '6', text: 'fii', role: undefined },
  ];

  // TODO get existing chat messages
  // TODO create client message form
  return (
    <div className="container flex h-full flex-col-reverse items-center justify-center bg-zinc-800">
      <Chat chatHistory={messages} chatId={chatId} />
    </div>
  );
}

const overflowMessage = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut libero purus, feugiat sed mattis sed, feugiat id urna. Vestibulum id bibendum ipsum. Sed porttitor velit lacinia bibendum dictum. Cras et risus et mi pharetra finibus eu non libero. Nunc interdum nibh a pulvinar convallis. Nam a fringilla felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
In urna est, ultrices sed libero et, tempus scelerisque massa. Cras eu imperdiet tellus. Phasellus ut ligula ipsum. Sed non lectus eget arcu eleifend lacinia. Pellentesque bibendum quam vitae posuere congue. Pellentesque ornare felis sit amet eros euismod hendrerit. Sed vitae ante diam. Aliquam in risus arcu. Donec tempus turpis et pharetra tincidunt. Aliquam id odio non lorem auctor suscipit faucibus interdum dui.
Nulla in augue in purus semper ultrices. Aliquam erat volutpat. Integer pellentesque quis lectus ut convallis. Mauris mattis accumsan commodo. Mauris eu pharetra diam. Nullam placerat dui at libero auctor, non blandit nisi posuere. Aliquam sit amet lacus eget lorem ornare porta at in tellus. Nunc tortor nulla, aliquam id neque non, ornare varius sem. Aenean cursus urna in arcu cursus, vel cursus lorem volutpat. Donec vulputate auctor ullamcorper. Quisque tincidunt ex sem, in rutrum mi placerat ut. In et erat ut arcu tempus cursus non ut sapien. Pellentesque vulputate mattis augue nec posuere. Integer dignissim ligula ut arcu gravida dignissim. Sed semper consequat faucibus.
Aliquam erat volutpat. Duis ut orci vel quam pharetra accumsan. Integer sit amet accumsan leo. Pellentesque interdum porttitor pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc ullamcorper suscipit sem vitae tincidunt. Donec vel dolor non dolor commodo rhoncus. Quisque laoreet, ante vitae accumsan eleifend, arcu nisl vulputate libero, at lacinia magna velit sed nunc.
Vestibulum non dignissim mi. Donec eu turpis tempus erat viverra consequat et id metus. Proin tempor odio neque, vel facilisis augue ultricies hendrerit. Vestibulum suscipit sem ut est sollicitudin, ut viverra diam commodo. Quisque posuere nisi id metus ultricies elementum. Etiam non nunc varius, euismod eros sed, gravida dolor. Aliquam feugiat viverra turpis at pharetra. Suspendisse semper, ligula in luctus viverra, libero lorem molestie tortor, id efficitur nisl justo a neque. Nam sed placerat nibh, vitae varius lectus. Maecenas fermentum ante id nulla vulputate, eget pellentesque justo semper.
Morbi nec augue odio. In finibus ipsum hendrerit ligula malesuada scelerisque. Vestibulum sit amet enim dui. Aliquam tincidunt neque maximus quam dapibus sollicitudin. Vivamus metus massa, tincidunt eget bibendum at, rhoncus sit amet est. Etiam rutrum tortor congue vestibulum elementum. Nullam hendrerit tristique massa, in semper risus. In nisi justo, accumsan vel rhoncus ullamcorper, congue ac ipsum.
Curabitur at augue ultricies, dignissim mauris at, pretium leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar turpis ut mattis dapibus. Suspendisse potenti. Mauris sit amet molestie lectus. Phasellus eget hendrerit enim. Nullam sit amet tempus nulla.
Fusce quis massa ipsum. Quisque sed diam eu ipsum scelerisque venenatis vitae et nisl. Donec sed libero orci. In hac habitasse platea dictumst. Donec diam magna.`;

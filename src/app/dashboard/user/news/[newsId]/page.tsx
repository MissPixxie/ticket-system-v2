"use client";

import { api } from "~/trpc/react";
import ChatBox from "~/app/_components/chatBox";
import { use } from "react";

//import { useSocket } from "~/app/_components/socketProvider";

export default function NewsPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = use(params);
  const { data: news, isLoading } = api.news.getNewsById.useQuery({
    id: newsId,
  });

  const { data: me } = api.user.me.useQuery();
  const utils = api.useUtils();
  //const { socket } = useSocket();

  const updateNews = api.news.updateNews.useMutation({
    onSuccess: () => {
      utils.news.getNewsById.invalidate();
      utils.news.listNews.invalidate();
    },
  });

  if (isLoading || !news) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white/70">
        Laddar nyhet...
      </main>
    );
  }

  return (
    <main className="main-page-layout">
      <div className="container">
        <div className="flex flex-col gap-4 rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{news.title}</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-3 text-lg font-semibold">Beskrivning</h2>
              <p className="text-white/80">{news.content}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
              <h2 className="mb-4 text-lg font-semibold">Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-white/60">Skapad av</p>
                  <p>{news.createdBy?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-white/60">Skapad</p>
                  <p>{new Date(news.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
            {news.conversation?.id && me?.id && (
              <ChatBox conversationId={news.conversation?.id ?? null} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

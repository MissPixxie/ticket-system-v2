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
        <button
          onClick={() => history.back()}
          className="self-start text-sm text-white/60 transition hover:text-white"
        >
          ← Tillbaka
        </button>
        <div className="flex gap-4 rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg md:flex-row md:justify-between">
          <div className="">
            <h1 className="text-2xl font-bold">{news.title}</h1>
            <div className="flex gap-5">
              <div className="flex gap-2 text-sm text-white/60">
                <p>Skapad av:</p>
                <p>{news.createdBy?.name ? news.createdBy?.name : "Anonym"}</p>
              </div>
              <div className="flex gap-2 text-sm text-white/60">
                <p>Skapad:</p>
                <p>{new Date(news.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-5 text-white/80">{news.content}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
          {news.conversationId && (
            <ChatBox conversationId={news.conversationId} />
          )}
        </div>
      </div>
    </main>
  );
}

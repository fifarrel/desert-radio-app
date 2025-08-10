import { useEffect, useMemo, useState } from "react";

// tiny helper: pull the YouTube video ID from common URL shapes
function getYouTubeId(url = "") {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    // sometimes /embed/VIDEOID
    const parts = u.pathname.split("/");
    const i = parts.findIndex((p) => p === "embed");
    if (i !== -1 && parts[i + 1]) return parts[i + 1];
  } catch (_) {}
  return null;
}

export default function Episodes() {
  const [episodes, setEpisodes] = useState([]);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("audio"); // "audio" | "video"

  useEffect(() => {
    (async () => {
      const res = await fetch("/episodes.json", { cache: "no-cache" });
      const data = await res.json();
      // newest first
      data.sort(
        (a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      setEpisodes(data);
    })();
  }, []);

  const nowPlayingSrc = useMemo(() => current?.file ?? null, [current]);
  const currentYouTubeId = useMemo(
    () => (current?.youtube_url ? getYouTubeId(current.youtube_url) : null),
    [current]
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Episodes</h2>

      <ul className="space-y-3 mb-6">
        {episodes.map((ep) => {
          const hasYouTube = !!getYouTubeId(ep.youtube_url || "");
          return (
            <li
              key={ep.slug}
              className="border rounded p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{ep.title}</div>
                <div className="text-sm opacity-80">
                  {new Date(ep.published_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded border"
                  onClick={() => {
                    setCurrent(ep);
                    setMode("audio");
                  }}
                  title="Listen (audio)"
                >
                  Play
                </button>
                {hasYouTube && (
                  <button
                    className="px-3 py-1 rounded border"
                    onClick={() => {
                      setCurrent(ep);
                      setMode("video");
                    }}
                    title="Watch on YouTube"
                  >
                    Watch
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {current && (
        <div className="border rounded p-4">
          <div className="font-semibold mb-3">Now Playing: {current.title}</div>

          {/* Toggle buttons (optional, handy after you've picked one) */}
          <div className="flex gap-2 mb-3">
            <button
              className={`px-3 py-1 rounded border ${
                mode === "audio" ? "bg-gray-100" : ""
              }`}
              onClick={() => setMode("audio")}
            >
              Listen
            </button>
            {currentYouTubeId && (
              <button
                className={`px-3 py-1 rounded border ${
                  mode === "video" ? "bg-gray-100" : ""
                }`}
                onClick={() => setMode("video")}
              >
                Watch
              </button>
            )}
          </div>

          {mode === "audio" && nowPlayingSrc && (
            <audio
              key={current.slug}
              controls
              preload="none"
              src={nowPlayingSrc}
              crossOrigin="anonymous"
              style={{ width: "100%" }}
            />
          )}

          {mode === "video" && currentYouTubeId && (
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {/* 16:9 responsive iframe */}
              <iframe
                title={current.title}
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentYouTubeId}?rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

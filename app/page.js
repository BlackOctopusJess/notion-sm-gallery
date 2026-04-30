"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [filterParam, setFilterParam] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));

    const params = new URLSearchParams(window.location.search);
    setFilterParam(params.get("filter") || "");
  }, []);

  const visiblePosts = posts.filter((post) => {
    if (!filterParam) return true;
    return post.filter?.toLowerCase() === filterParam.toLowerCase();
  });

  function changeImage(postId, direction, total) {
    setActiveIndexes((current) => {
      const currentIndex = current[postId] || 0;
      const nextIndex = (currentIndex + direction + total) % total;
      return { ...current, [postId]: nextIndex };
    });
  }

  function isVideo(fileName = "") {
    const lower = fileName.toLowerCase();
    return (
      lower.endsWith(".mp4") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".m4v")
    );
  }

  return (
    <main style={{ background: "#000", minHeight: "100vh", padding: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
        }}
      >
        {visiblePosts.map((post) => {
          const activeIndex = activeIndexes[post.id] || 0;
          const media = post.media || [];
          const currentMedia = media[activeIndex];
          const hasMultiple = media.length > 1;

          return (
            <div
              key={post.id}
              className="card"
              style={{
                aspectRatio: "1080 / 1350",
                background: "#222",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {currentMedia?.url ? (
                isVideo(currentMedia.name) ? (
                  <video
                    src={currentMedia.url}
                    controls
                    muted
                    playsInline
                    className="media"
                  />
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={post.title}
                    className="media"
                  />
                )
              ) : null}

              <div className="overlay title">{post.title}</div>

              {hasMultiple && (
                <>
                  <button
                    className="overlay arrow left"
                    onClick={() => changeImage(post.id, -1, media.length)}
                  >
                    ‹
                  </button>

                  <button
                    className="overlay arrow right"
                    onClick={() => changeImage(post.id, 1, media.length)}
                  >
                    ›
                  </button>

                  <div className="overlay counter">
                    {activeIndex + 1}/{media.length}
                  </div>
                </>
              )}

              <style jsx>{`
                .card:hover .overlay {
                  opacity: 1;
                }

                .overlay {
                  opacity: 0;
                  transition: 0.2s ease;
                  position: absolute;
                  z-index: 5;
                  background: rgba(0, 0, 0, 0.65);
                  color: white;
                }

                .title {
                  top: 8px;
                  left: 8px;
                  padding: 5px 8px;
                  border-radius: 8px;
                  font-size: 12px;
                  max-width: 70%;
                  font-weight: bold;
                }

                .arrow {
                  top: 50%;
                  transform: translateY(-50%);
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  border: none;
                  cursor: pointer;
                  font-size: 20px;
                }

                .left {
                  left: 8px;
                }

                .right {
                  right: 8px;
                }

                .counter {
                  top: 8px;
                  right: 8px;
                  padding: 4px 8px;
                  border-radius: 999px;
                  font-size: 12px;
                }

                .media {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </main>
  );
}
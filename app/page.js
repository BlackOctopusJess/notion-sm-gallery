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
    <main className="page">
      <div className="gallery">
        {visiblePosts.map((post) => {
          const activeIndex = activeIndexes[post.id] || 0;
          const media = post.media || [];
          const currentMedia = media[activeIndex];
          const hasMultiple = media.length > 1;

          return (
            <div key={post.id} className="card">
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
                    aria-label="Previous attachment"
                  >
                    ‹
                  </button>

                  <button
                    className="overlay arrow right"
                    onClick={() => changeImage(post.id, 1, media.length)}
                    aria-label="Next attachment"
                  >
                    ›
                  </button>

                  <div className="overlay counter">
                    {activeIndex + 1}/{media.length}
                  </div>
                </>
              )}

              <style jsx>{`
                .page {
                  background: #000;
                  min-height: 100vh;
                  padding: 0.5rem;
                }

                .gallery {
                  display: grid;
                  grid-template-columns: repeat(3, minmax(0, 1fr));
                  gap: 0.25rem;
                }

                .card {
                  aspect-ratio: 1080 / 1350;
                  background: #222;
                  overflow: hidden;
                  position: relative;
                  width: 100%;
                }

                .media {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                }

                .overlay {
                  opacity: 0;
                  transition: opacity 0.2s ease;
                  position: absolute;
                  z-index: 5;
                  background: rgba(0, 0, 0, 0.65);
                  color: white;
                }

                .card:hover .overlay {
                  opacity: 1;
                }

                .title {
                  top: 2%;
                  left: 2%;
                  padding: 0.45em 0.7em;
                  border-radius: 0.5em;
                  font-size: clamp(9px, 1.2vw, 14px);
                  max-width: 68%;
                  font-weight: bold;
                  line-height: 1.2;
                }

                .counter {
                  top: 2%;
                  right: 2%;
                  padding: 0.35em 0.65em;
                  border-radius: 999px;
                  font-size: clamp(9px, 1.2vw, 14px);
                  line-height: 1;
                }

                .arrow {
                  top: 50%;
                  transform: translateY(-50%);
                  width: clamp(22px, 3vw, 36px);
                  height: clamp(22px, 3vw, 36px);
                  border-radius: 50%;
                  border: none;
                  cursor: pointer;
                  font-size: clamp(14px, 2vw, 22px);
                  line-height: 1;
                }

                .left {
                  left: 2%;
                }

                .right {
                  right: 2%;
                }

                @media (max-width: 600px) {
                  .gallery {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                  }

                  .overlay {
                    opacity: 1;
                  }
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </main>
  );
}
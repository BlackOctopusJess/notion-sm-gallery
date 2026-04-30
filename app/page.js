"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [filterParam, setFilterParam] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  function loadPosts() {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }

  useEffect(() => {
    loadPosts();

    const params = new URLSearchParams(window.location.search);
    setFilterParam(params.get("filter") || "");
  }, []);

  const visiblePosts = posts.filter((post) => {
    if (!filterParam) return true;
    return post.filter?.toLowerCase().includes(filterParam.toLowerCase());
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
      <div className="toolbar">
  <div className="titleText">BOS Marketing Preview</div>

  <div className="actions">
    <button onClick={loadPosts} className="button">
      Refresh
    </button>

    <button onClick={() => setShowInfo(true)} className="button">
      Info
    </button>
  </div>
</div>
      {showInfo && (
        <div className="modalBackdrop" onClick={() => setShowInfo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setShowInfo(false)}>
              ×
            </button>

            <h2>How to use this gallery</h2>

            <ol>
              <li>
                <strong>Add your media in Notion.</strong>
                <br />
                Upload previews to the <code>Attachments</code> property.
              </li>

              <li>
                <strong>Add a filter value.</strong>
                <br />
                Set the <code>Filter</code> select property, for example{" "}
                <code>BGBH</code>.
              </li>

              <li>
                <strong>Use a filtered link.</strong>
                <br />
                Add <code>?filter=BGBH</code> to the end of the gallery URL.
              </li>

              <li>
                <strong>Embed it in Notion.</strong>
                <br />
                Type <code>/embed</code> in Notion, then paste the filtered URL.
              </li>

              <li>
                <strong>Refresh when needed.</strong>
                <br />
                Click <code>Refresh</code> after changing attachments in Notion.
              </li>
            </ol>

            <div className="example">
              https://notion-sm-gallery.vercel.app?filter=BGBH
            </div>
          </div>
        </div>
      )}

      <div className="gallery">
        {visiblePosts.map((post) => {
          const activeIndex = activeIndexes[post.id] || 0;
          const media = post.media || [];
          const currentMedia = media[activeIndex];
          const hasMultiple = media.length > 1;
          const video = isVideo(currentMedia?.name);

          return (
            <div key={post.id} className="card">
              {currentMedia?.url ? (
                video ? (
                  <video
                    src={currentMedia.url}
                    muted
                    playsInline
                    className="media videoMedia"
                    onMouseEnter={(e) => {
                      e.currentTarget.controls = true;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.controls = false;
                    }}
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
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .page {
          background: #000;
          min-height: 100vh;
          padding: 8px;
        }

        .toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
}

.titleText {
  color: white;
  font-weight: 600;
  font-size: clamp(14px, 2vw, 18px);
}

.actions {
  display: flex;
  gap: 8px;
}

        .button {
          background: #111;
          color: white;
          border: 1px solid #333;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .button:hover {
          background: #222;
        }

        .gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
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
          padding: 5px 8px;
          border-radius: 8px;
          font-size: clamp(9px, 1.2vw, 13px);
          max-width: 68%;
          font-weight: bold;
        }

        .counter {
          top: 2%;
          right: 2%;
          padding: 4px 7px;
          border-radius: 999px;
          font-size: clamp(9px, 1.2vw, 13px);
        }

        .arrow {
          top: 50%;
          transform: translateY(-50%);
          width: clamp(22px, 3vw, 34px);
          height: clamp(22px, 3vw, 34px);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: clamp(14px, 2vw, 22px);
        }

        .left {
          left: 2%;
        }

        .right {
          right: 2%;
        }

        .modalBackdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal {
          position: relative;
          background: #111;
          color: white;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 22px;
          max-width: 560px;
          width: 100%;
          font-size: 14px;
          line-height: 1.5;
        }

        .modal h2 {
          margin-top: 0;
        }

        .modal ol {
          padding-left: 22px;
        }

        .modal li {
          margin-bottom: 14px;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 12px;
          background: transparent;
          color: white;
          border: 0;
          font-size: 26px;
          cursor: pointer;
        }

        code,
        .example {
          background: #222;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .example {
          display: block;
          margin-top: 14px;
          padding: 10px;
          overflow-wrap: anywhere;
        }
      `}</style>
    </main>
  );
}
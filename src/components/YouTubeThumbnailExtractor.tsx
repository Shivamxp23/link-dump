import React, { useState } from "react";

function extractVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }
    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }
  } catch (err) {
    return null;
  }
  return null;
}

interface YouTubeThumbnailExtractorProps {
  urls?: string[];
}

const THUMB_TYPES = [
  { label: "Default", value: "default" },
  { label: "Medium Quality", value: "mqdefault" },
  { label: "High Quality", value: "hqdefault" },
  { label: "Standard Definition", value: "sddefault" },
  { label: "Max Resolution", value: "maxresdefault" },
];

const fallbackOrder = [
  "maxresdefault",
  "sddefault",
  "hqdefault",
  "mqdefault",
  "default",
];

const YouTubeThumbnailExtractor: React.FC<YouTubeThumbnailExtractorProps> = ({ urls }) => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [thumbType, setThumbType] = useState("hqdefault");
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbType(e.target.value);
    setImgError({});
  };

  // For single input mode
  const videoId = extractVideoId(inputUrl);

  // For multiple URLs
  const videoIds = urls ? urls.map(extractVideoId).filter(Boolean) as string[] : [];

  // On error, fallback to next available type for a given video
  const handleImgError = (id: string, currentType: string) => {
    const currentIdx = fallbackOrder.indexOf(currentType);
    if (currentIdx < fallbackOrder.length - 1) {
      setThumbType(fallbackOrder[currentIdx + 1]);
    } else {
      setImgError((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>YouTube Thumbnail Extractor</h1>
      {!urls && (
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => { setInputUrl(e.target.value); setImgError({}); }}
          placeholder="Paste YouTube URL here"
          style={{ width: "100%", padding: "10px", fontSize: "1rem" }}
        />
      )}
      <div style={{ margin: "1rem 0" }}>
        {THUMB_TYPES.map((type) => (
          <label key={type.value} style={{ marginRight: "1rem" }}>
            <input
              type="radio"
              value={type.value}
              checked={thumbType === type.value}
              onChange={handleTypeChange}
            />
            {type.label}
          </label>
        ))}
      </div>
      {/* Single input mode */}
      {!urls && videoId && !imgError[videoId] && (
        <div style={{ marginTop: "20px" }}>
          <h3>Extracted Thumbnail ({thumbType}):</h3>
          <img
            src={`https://img.youtube.com/vi/${videoId}/${thumbType}.jpg`}
            alt="YouTube Thumbnail"
            style={{ width: "100%", borderRadius: "10px" }}
            onError={() => handleImgError(videoId, thumbType)}
          />
        </div>
      )}
      {/* Multiple URLs mode */}
      {urls && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          {videoIds.map((id) =>
            !imgError[id] ? (
              <div key={id} style={{ width: "300px" }}>
                <img
                  src={`https://img.youtube.com/vi/${id}/${thumbType}.jpg`}
                  alt="YouTube Thumbnail"
                  style={{ width: "100%", borderRadius: "10px" }}
                  onError={() => handleImgError(id, thumbType)}
                />
                <div style={{ wordBreak: "break-all", fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
                  <strong>{id}</strong>
                </div>
              </div>
            ) : (
              <div key={id} style={{ width: "300px", color: "red" }}>
                No thumbnail available for {id}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default YouTubeThumbnailExtractor;
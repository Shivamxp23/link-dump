const express = require('express');
const ogs = require('open-graph-scraper');
const cors = require('cors');
const ytsr = require('ytsr');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());

app.get('/api/og', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { result } = await ogs({ url, timeout: 8000 });
    res.json({
      image: result.ogImage?.url || '',
      title: result.ogTitle || '',
      description: result.ogDescription || '',
      favicon: result.favicon || ''
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch OG data', details: err.message });
  }
});

app.get('/api/youtube-thumbnails', async (req, res) => {
  const { channelId, channelUrl } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing YOUTUBE_API_KEY in environment' });

  let resolvedChannelId = channelId;

  // If channelUrl is provided, resolve to channelId
  if (!resolvedChannelId && channelUrl) {
    // Extract channel ID from URL
    const match = channelUrl.match(/youtube\.com\/(channel\/([\w-]+))/);
    if (match) {
      resolvedChannelId = match[2];
    } else {
      // Try to resolve custom URL to channel ID
      try {
        const resp = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
          params: {
            part: 'id',
            forUsername: channelUrl.split('/').pop(),
            key: apiKey
          }
        });
        if (resp.data.items && resp.data.items.length > 0) {
          resolvedChannelId = resp.data.items[0].id;
        }
      } catch (err) {
        return res.status(400).json({ error: 'Could not resolve channelId from channelUrl' });
      }
    }
  }

  if (!resolvedChannelId) {
    return res.status(400).json({ error: 'Missing channelId or valid channelUrl' });
  }

  // Fetch all video IDs using YouTube Data API (with pagination)
  let videos = [];
  let nextPageToken = '';
  try {
    do {
      const resp = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: apiKey,
          channelId: resolvedChannelId,
          part: 'id',
          maxResults: 50,
          order: 'date',
          pageToken: nextPageToken,
          type: 'video',
        }
      });
      if (resp.data.items) {
        videos.push(...resp.data.items.map(item => item.id.videoId));
      }
      nextPageToken = resp.data.nextPageToken;
    } while (nextPageToken);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
  }

  // Build thumbnail URLs
  const thumbnails = videos.map(videoId => ({
    videoId,
    thumbnail: `https://i3.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    fallback: `https://i3.ytimg.com/vi/${videoId}/hqdefault.jpg`
  }));

  res.json({ channelId: resolvedChannelId, thumbnails });
});

app.listen(PORT, () => {
  console.log(`OG backend running on http://localhost:${PORT}`);
}); 
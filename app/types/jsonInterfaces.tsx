export interface VideoLikeHistoryItem {
  Date: string;
  Link: String;
}

export interface VideoBrowsingHistoryItem {
  Date: Date;
  Link: string;
}


export interface ActivityData {
  "Like List": {
    ItemFavoriteList: VideoLikeHistoryItem[];
  }
  "Video Browsing History": {
    VideoList: VideoBrowsingHistoryItem[];
  }
}

export interface ParsedData {
  Activity: ActivityData;
}


from pytube import YouTube

def custom_filter(stream_obj):
    res = stream_obj.resolution
    if (res is not None):
        if (len(res) == 5):
            return True
        else:
            if (stream_obj.is_progressive):
                return True
            return False

def get_video(URL, quality=None):

    video = YouTube(URL)

    streams = video.streams
    videos = streams.filter(file_extension="mp4", custom_filter_functions=[custom_filter]).order_by("resolution").desc()
    audio = streams.get_audio_only()

    if (not quality):
        video_info = dict()
        video_info["thumbnail"] = video.thumbnail_url
        video_info["title"] = video.title
        video_info["length"] = video.length

        quality_list = []
        for video in videos:
            quality_list.append([video.resolution, int(video.is_progressive)])
        if (audio):
            quality_list.append(["MP3", "Audio"])
    
        video_info["quality"] = quality_list

        return video_info
    else:
        if (len(quality) > 5):
            quality = quality[:-2]
        
        if (quality == "MP3"):
            return {"url": audio.url}
        else:
            for video in videos:
                if (video.resolution == quality):
                    return {"url": video.url}
    
        return None
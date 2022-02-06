from http.cookiejar import Cookie
import json
from urllib.parse import urlencode
from django.http import HttpRequest, HttpResponse
from django.shortcuts import redirect, render
from django.template import RequestContext
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import permissions
import openai
from lyricsgenius import Genius
import requests
import json
# Create your views here.

@api_view()
@permission_classes((permissions.AllowAny,))
def hello_world(request):
    return Response({"message": "Hello, pussy!"})

def vibe_check(lyrics):
#     {
#   "object": "file",
#   "id": "file-Hm9bsBq1ZXUSA922pV5sYUfw",
#   "purpose": "classifications",
#   "filename": "train.jsonl",
#   "bytes": 4106,
#   "created_at": 1644056607,
#   "status": "uploaded",
#   "status_details": null
# }
    openapi_key = "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"
    openapi_url = "https://api.openai.com/v1/classifications"
    openai.api_key = openapi_key
    ai_response = openai.Classification.create(file="file-Hm9bsBq1ZXUSA922pV5sYUfw", query=lyrics, search_model="curie", model="curie", max_examples=2)
    score = ai_response["selected_examples"][1]["score"]
    normalized = score/600 + 0.5
    print(score)

    return {"label": ai_response["label"], "weight": normalized}



def get_lyrics(song_name, artist_name):
    genius = Genius("MgG2at28sUzp3Jzalys03MVLi7HcLt-bK5AADc6ur_wAxpxbTpUZxe1qlc94TH_F")    
    search_result = json.loads(genius.search_song(song_name, artist_name).to_json())
    return search_result["lyrics"]

def get_vibe_string(vibe_value: int):
    pass

@api_view()
@permission_classes((permissions.AllowAny,))
def get_audio_data(request: Request):
    song_name = request.query_params["song_name"]
    artist_name = request.query_params["artist_name"]

    headers = {"Authorization": request.headers["Authorization"], "Content-Type": "application/json"}
    search_terms = {
        "q": f"track:{song_name}+artist:{artist_name}",
        "type": "track",
        "include_external": "audio"
        }
    api_url = f"https://api.spotify.com/v1/search?" + f"q=track:{song_name}+artist:{artist_name}" + "&type=track&include_external_audio"
    response = requests.get(api_url, search_terms, headers=headers)
    if "error" in response.json().keys():        
        return Response(response.json())
    track_id = response.json()['tracks']['items'][0]['id']
    image_url = response.json()['tracks']['items'][0]['album']['images'][0]['url']
    artist = response.json()['tracks']['items'][0]['artists'][0]["name"]
    song = response.json()['tracks']['items'][0]["name"]
    api_url = f"https://api.spotify.com/v1/audio-features/{track_id}"
    response = requests.get(api_url, headers=headers)
    lyrics = get_lyrics(song_name, artist_name)
    sentiment = vibe_check(lyrics)    
    energy = response.json()["energy"]
    valence = response.json()["valence"]
    print(sentiment, response.json()["energy"])
    gpt3_value = sentiment["label"]
    vibe_value =  valence + energy
    print(gpt3_value , valence , energy, vibe_value)
    vibe = ""
    if gpt3_value == "Happy":
        if valence >= 0 and valence <= 0.4:
            if energy >= 0.6 and energy <= 1:
                vibe = "hopeful"
            else:
                vibe = "chill"
        else:
            if energy >= 0.6 and energy <= 1:
                vibe = "upbeat"
            else:
                vibe = "cheerful"
    else:
        if valence >= 0 and valence <= 0.4:
            if energy >= 0.6 and energy <= 1:
                vibe = "angry"
            else:
                vibe = "depressed"
        else:
            if energy >= 0.6 and energy <= 1:
                vibe = "angsty"
            else:
                vibe = "chill"


    return Response({"image": image_url, "vibe": vibe , "artist": artist, "song": song})



@api_view()
@permission_classes((permissions.AllowAny,))
def callback(request: Request):
    # auth_token = ""        
    # auth_token = request.query_params["access_token"]
    # http_resp = redirect("localhost:3000")
    # http_resp.set_cookie("vibe_auth_token", auth_token)
    print(request.path)
    return Response("")


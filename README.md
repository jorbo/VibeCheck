## Inspiration
My inspiration for creating Vibe Check was always rooted in my love of finding new music. One of the many ways I make playlists for music I listen to is split into different moods or vibes. For example, I like to listen to music that is pretty chill and usually has a positive tone when I am doing home or something high energy when I'm working out.  I wanted a way to look up a song to see which of my playlists it makes the most sense to add it to.

## What it does
Vibe Check uses machine learning and audio analysis to determine the vibe of a song.

## How I built it
Vibe Check is split into two parts: the front end and the back end.

### Front End
The front end is single page application written in Javascript/HTML/CSS using the React framework that takes in user input in the form of an artist's name and a song's name. It then displays the album art and the vibe that the song gives off.

### Back End
The back end is where the meat of Vibe Check rests. The back end is written in python using the Django framework. The back end talks to the OpenAI gpt3 API, the Genius API, and handles token authorization for the Spotify API.

I trained the gpt3 model to match a core feeling: happy or sad. I used Happy by Pharrell Williams for the happy learning and I miss you by blink-182 for the sad learning. While in reality, this is not much data for the model to work off of it did however give a low-accuracy approximation of the general meaning of the song's lyrics. The lyrics were provided by Genius for both the machine learning model and the classification of the user's searched song.

The Spotify API helped me do some audio analysis. While I really wanted to do some real DSP work I don't think I would have had enough time to do it in a hackathon. Maybe another day! 
The Spotify track API has a ton of different data about a song, such as tempo and BPM. The two that I used that helped a lot in my categorization were the valence and energy levels. The valence level determines how positive or sad a song is. So a 0 valence would be a really sad song whereas a 1 would be a really happy song. The energy level represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.

I then fiddled with the ranges of gpt3 output, valence, and the energy to create a few distinct vibes.

## Challenges we ran into
The biggest challenge was that I had never used React or Django before. I spent a ton of time just learning, tinkering, and trying to understand the whole React component system. I have not done a ton of web development so a lot of the tooling around the javascript ecosystem is quite new to me. I have some familiarity with Flask so Django was a little bit easier to get a grasp on as well as my python being much stronger than my javascript.

## Accomplishments that we're proud of
The biggest accomplishment that I am proud of is how much I was able to learn about React and web dev in general. I usually sit in the C/C++ world so was definitely a step in a different direction for me.

## What we learned
I learned a ton about React, Django, and machine learning models!

## What's next for Vibe Check
The biggest thing is fine-tuning the vibe-checking algorithm. The numbers could definitely be tweaked in terms of valence and energy. The gpt3 model needs much more data to more accurately understand the lyrics.

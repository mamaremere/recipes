#!/bin/bash

LOCAL_ENV_FILE="./.local.env"

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <youtube-video-url>"
    exit 1
fi

# You need to replace this with your own API key
if [ -e "$LOCAL_ENV_FILE" ]; then
    source ./.local.env
else
    echo "$LOCAL_ENV_FILE file does not exist. It should exist and contain an export YOUTUBE_API_KEY=\"YOUR_YOUTUBE_API_KEY\""
fi

VIDEO_URL=$1
VIDEO_ID=$(echo $VIDEO_URL | sed 's/.*v=\([^&]*\).*/\1/')

# Get video details using YouTube API
VIDEO_DETAILS=$(curl -s "https://www.googleapis.com/youtube/v3/videos?id=$VIDEO_ID&key=$YOUTUBE_API_KEY&part=snippet,contentDetails")
DESCRIPTION=$(echo $VIDEO_DETAILS | jq -r '.items[0].snippet.description')

# Get video captions using YouTube API
TRANSCRIPT=$(youtube_transcript_api.exe "$VIDEO_ID" --format text | awk '{printf "%s ", $0}')

# Create the prompt
PROMPT=$(cat <<EOF
Here is a transcript of a YouTube video and the video description. Please update the recipes.json file to include this recipe. Make sure to have the instructions and ingredients in Romanian and use the metric system for quantities. Also the instructions should have steps clearly differentiated.

Transcript:
"$TRANSCRIPT"

Description:
"$DESCRIPTION"

Json output for the recipe:
{
  "name": "New Recipe Name",
  "instructions": "Instructions in Romanian",
  "ingredients": [
    {
      "name": "Ingredient Name",
      "quantityMetric": "grams/ml/etc.",
      "quantityValue": 100
    }
  ]
}
EOF
)

# Output the prompt
echo ">>>>>>>>>>>>>>>>>>>>>>>"
echo ""
echo ""
echo "$PROMPT"
echo ""
echo ""
echo ">>>>>>>>>>>>>>>>>>"


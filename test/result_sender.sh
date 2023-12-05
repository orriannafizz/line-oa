echo "Sending test results to Line..."

# Variable
FILE_NAME="test/result.json"
ACTION_URL="https://github.com/$REPOSITORY_NAME/actions/runs/$RUN_ID"
COMMIT_URL="https://github.com/$REPOSITORY_NAME/commit/$COMMIT_SHA"

# Check if result.json exists
if [ ! -f "$FILE_NAME" ]; then
    echo "File not found: $FILE_NAME"
    exit 1
fi

# Test Results
PASSED_TESTS_NUM=$(jq '.numPassedTests' < "$FILE_NAME")
FAILED_TESTS_NUM=$(jq '.numFailedTests' < "$FILE_NAME")
TOTAL_TESTS_NUM=$(jq '.numTotalTests' < "$FILE_NAME")
IS_SUCCESS=$(jq -r '.success' < "$FILE_NAME")

# Color Config
GREEN_COLOR="#4BB543" 
RED_COLOR="#D0342C"  

if [[ "$IS_SUCCESS" == "true" ]]; then
    TITLE_TEXT="Test - Success 🎉"
    FAIL_TEXT_COLOR="#55555"
    TITLE_COLOR=$GREEN_COLOR 
else
    TITLE_TEXT="Test - Failure 👎"
    FAIL_TEXT_COLOR="#D0342C"
    TITLE_COLOR=$RED_COLOR  
fi

# Ensure variables BAREAR_AUTH and USER_ID are set
if [[ -z "${BAREAR_AUTH}" || -z "${USER_ID}" ]]; then
    echo "Authorization token or user ID is not set."
    exit 1
fi




MESSAGE='{
  "type": "bubble",
  "size": "mega",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [

      {
        "type": "text",
        "text": "'"$TITLE_TEXT"'",
        "weight": "bold",
        "color": "'"$TITLE_COLOR"'",
        "size": "xl",
        "align": "start",
        "margin": "md"
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "md",
        "spacing": "sm",
        "contents": [
                                {
            "type": "text",
            "text": "Event Summary",
            "weight": "bold",
            "size": "sm",
            "margin": "sm",
            "color": "#000000"
          },
          {
            "type": "text",
            "text": "Branch: '"$BRANCH_NAME"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Author: '"$AUTHOR_NAME"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Event: '"$EVENT_NAME"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Workflow: '"$WORKFLOW_NAME"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Commit: '"${COMMIT_SHA:0:7}"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
        ]
      },
      {
        "type": "separator",
        "margin": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "md",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "Test Results",
            "weight": "bold",
            "size": "sm",
            "margin": "sm",
            "color": "#000000"
          },
          {
            "type": "text",
            "text": "Total test: '"$TOTAL_TESTS_NUM"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Failed test: '"$FAILED_TESTS_NUM"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          },
          {
            "type": "text",
            "text": "Passed test: '"$PASSED_TESTS_NUM"'",
            "size": "sm",
            "color": "#555555",
            "margin": "sm"
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "primary",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "View Job Details",
          "uri": "'"$ACTION_URL"'"
        }
      }
    ]
  }
}'

      


curl -X POST https://api.line.me/v2/bot/message/push \
-H 'Content-Type: application/json' \
-H "Authorization: Bearer ${BAREAR_AUTH}" \
-d '{
    "to": "'"${USER_ID}"'",
    "messages": [
    {
      "type": "flex",
      "altText": "'"${TITLE_TEXT}"'",
      "contents": '"${MESSAGE}"'
    }
  ]
}'

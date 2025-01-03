api keys sk-759b85e5468d4e48b165fd51a2dccdf3
  

Your First API Call
The DeepSeek API uses an API format compatible with OpenAI. By modifying the configuration, you can use the OpenAI SDK or softwares compatible with the OpenAI API to access the DeepSeek API.

PARAM	VALUE
base_url *       	https://api.deepseek.com
api_key	apply for an API key
* To be compatible with OpenAI, you can also use https://api.deepseek.com/v1 as the base_url. But note that the v1 here has NO relationship with the model's version.

* The deepseek-chat model has been upgraded to DeepSeek-V3. The API remains unchanged. You can invoke DeepSeek-V3 by specifying model='deepseek-chat'.

Invoke The Chat API
Once you have obtained an API key, you can access the DeepSeek API using the following example scripts. This is a non-stream example, you can set the stream parameter to true to get stream response.

curl
python
nodejs
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <DeepSeek API Key>" \
  -d '{
        "model": "deepseek-chat",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        "stream": false
      }'


Next

DeepSeek API
The DeepSeek API. To use the DeepSeek API, please create an API key first.

Authentication
HTTP: Bearer Auth
Security Scheme Type:

http

HTTP Authorization Scheme:

bearer


API ReferenceChatCreate Chat Completion
Create Chat Completion
POST
https://api.deepseek.com/chat/completions
Creates a model response for the given chat conversation.

Request
application/json
Body

required

messages

object[]

required

model
string
required
Possible values: [deepseek-chat]

ID of the model to use. You can use deepseek-chat.

frequency_penalty
number
nullable
Possible values: >= -2 and <= 2

Default value: 0

Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.

max_tokens
integer
nullable
Possible values: > 1

Integer between 1 and 8192. The maximum number of tokens that can be generated in the chat completion.

The total length of input tokens and generated tokens is limited by the model's context length.

If max_tokens is not specified, the default value 4096 is used.

presence_penalty
number
nullable
Possible values: >= -2 and <= 2

Default value: 0

Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.

response_format

object

nullable

stop

object

nullable

stream
boolean
nullable
If set, partial message deltas will be sent. Tokens will be sent as data-only server-sent events (SSE) as they become available, with the stream terminated by a data: [DONE] message.

stream_options

object

nullable

temperature
number
nullable
Possible values: <= 2

Default value: 1

What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

We generally recommend altering this or top_p but not both.

top_p
number
nullable
Possible values: <= 1

Default value: 1

An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.

We generally recommend altering this or temperature but not both.

tools

object[]

nullable

tool_choice

object

nullable

logprobs
boolean
nullable
Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the content of message.

top_logprobs
integer
nullable
Possible values: <= 20

An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used.

Responses
200 (No streaming)
200 (Streaming)
OK, returns a chat completion object

application/json
Schema
Example (from schema)
Example
Schema

id
string
required
A unique identifier for the chat completion.

choices

object[]

required

created
integer
required
The Unix timestamp (in seconds) of when the chat completion was created.

model
string
required
The model used for the chat completion.

system_fingerprint
string
required
This fingerprint represents the backend configuration that the model runs with.

object
string
required
Possible values: [chat.completion]

The object type, which is always chat.completion.

usage

object

curl
python
go
nodejs
ruby
csharp
php
java
powershell
OpenAI SDK
import OpenAI from "openai";

# for backward compatibility, you can still use `https://api.deepseek.com/v1` as `baseURL`.
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: '<your API key>'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();


AXIOS
NATIVE
const axios = require('axios');
let data = JSON.stringify({
  "messages": [
    {
      "content": "You are a helpful assistant",
      "role": "system"
    },
    {
      "content": "Hi",
      "role": "user"
    }
  ],
  "model": "deepseek-chat",
  "frequency_penalty": 0,
  "max_tokens": 2048,
  "presence_penalty": 0,
  "response_format": {
    "type": "text"
  },
  "stop": null,
  "stream": false,
  "stream_options": null,
  "temperature": 1,
  "top_p": 1,
  "tools": null,
  "tool_choice": "none",
  "logprobs": false,
  "top_logprobs": null
});

let config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://api.deepseek.com/chat/completions',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json', 
    'Authorization': 'Bearer <TOKEN>'
  },
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});



Request
Collapse all
Base URL
https://api.deepseek.com
Auth
Bearer Token
Bearer Token
Body
 required
{
  "messages": [
    {
      "content": "You are a helpful assistant",
      "role": "system"
    },
    {
      "content": "Hi",
      "role": "user"
    }
  ],
  "model": "deepseek-chat",
  "frequency_penalty": 0,
  "max_tokens": 2048,
  "presence_penalty": 0,
  "response_format": {
    "type": "text"
  },
  "stop": null,
  "stream": false,
  "stream_options": null,
  "temperature": 1,
  "top_p": 1,
  "tools": null,
  "tool_choice": "none",
  "logprobs": false,
  "top_logprobs": null
}
Send API Request
Response
Clear
Click the Send API Request button above and see the response here!

Previous
Introduction
Next
Create FIM Completion



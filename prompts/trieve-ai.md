curl --request POST \
  --url https://api.trieve.ai/api/chunk \
  --header 'Authorization: <api-key>' \
  --header 'Content-Type: application/json' \
  --header 'TR-Dataset: <tr-dataset>' \
  --data '{
  "chunk_html": "<p>Some HTML content</p>",
  "fulltext_boost": {
    "boost_factor": 5,
    "phrase": "foo"
  },
  "group_ids": [
    "d290f1ee-6c54-4b01-90e6-d701748f0851"
  ],
  "group_tracking_ids": [
    "group_tracking_id"
  ],
  "image_urls": [
    "https://example.com/red",
    "https://example.com/blue"
  ],
  "link": "https://example.com",
  "location": {
    "lat": -34,
    "lon": 151
  },
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "semantic_boost": {
    "distance_factor": 0.5,
    "phrase": "flagship"
  },
  "tag_set": [
    "tag1",
    "tag2"
  ],
  "time_stamp": "2021-01-01 00:00:00.000",
  "tracking_id": "tracking_id"
}', 

Upload File
Upload a file to S3 bucket attached to your dataset. You can select between a naive chunking strategy where the text is extracted with Apache Tika and split into segments with a target number of segments per chunk OR you can use a vision LLM to convert the file to markdown and create chunks per page. Auth’ed user must be an admin or owner of the dataset’s organization to upload a file.

POST

api.trieve.ai

/
api
/
file
Send

Authorization

Header

Body

cURL

Python

JavaScript

PHP

Go

Java

curl --request POST \
  --url https://api.trieve.ai/api/file \
  --header 'Authorization: <api-key>' \
  --header 'Content-Type: application/json' \
  --header 'TR-Dataset: <tr-dataset>' \
  --data '{
  "base64_file": "<base64_encoded_file>",
  "create_chunks": true,
  "description": "This is an example file",
  "file_name": "example.pdf",
  "link": "https://example.com",
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "split_delimiters": [
    ",",
    ".",
    "\n"
  ],
  "tag_set": [
    "tag1",
    "tag2"
  ],
  "target_splits_per_chunk": 20,
  "time_stamp": "2021-01-01 00:00:00.000Z",
  "use_pdf2md_ocr": false
}'

200

400

{
  "file_metadata": {
    "created_at": "2021-01-01 00:00:00.000",
    "dataset_id": "e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3",
    "file_name": "file.txt",
    "id": "e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3",
    "link": "https://trieve.ai",
    "metadata": {
      "key": "value"
    },
    "size": 1000,
    "tag_set": "tag1,tag2",
    "time_stamp": "2021-01-01 00:00:00.000",
    "updated_at": "2021-01-01 00:00:00.000"
  }
}
Authorizations
​
Authorization
string
header
required
Headers
​
TR-Dataset
string
required
The dataset id or tracking_id to use for the request. We assume you intend to use an id if the value is a valid uuid.

Body
application/json
​
base64_file
string
required
Base64 encoded file. This is the standard base64url encoding.

​
file_name
string
required
Name of the file being uploaded, including the extension.

​
create_chunks
boolean | null
Create chunks is a boolean which determines whether or not to create chunks from the file. If false, you can manually chunk the file and send the chunks to the create_chunk endpoint with the file_id to associate chunks with the file. Meant mostly for advanced users.

​
description
string | null
Description is an optional convience field so you do not have to remember what the file contains or is about. It will be included on the group resulting from the file which will hold its chunk.

​
group_tracking_id
string | null
Group tracking id is an optional field which allows you to specify the tracking id of the group that is created from the file. Chunks created will be created with the tracking id of group_tracking_id|<index of chunk>

​
link
string | null
Link to the file. This can also be any string. This can be used to filter when searching for the file's resulting chunks. The link value will not affect embedding creation.

​
metadata
any | null
Metadata is a JSON object which can be used to filter chunks. This is useful for when you want to filter chunks by arbitrary metadata. Unlike with tag filtering, there is a performance hit for filtering on metadata. Will be passed down to the file's chunks.

​
pdf2md_options
object

Show child attributes

​
rebalance_chunks
boolean | null
Rebalance chunks is an optional field which allows you to specify whether or not to rebalance the chunks created from the file. If not specified, the default true is used. If true, Trieve will evenly distribute remainder splits across chunks such that 66 splits with a target_splits_per_chunk of 20 will result in 3 chunks with 22 splits each.

​
split_delimiters
string[] | null
Split delimiters is an optional field which allows you to specify the delimiters to use when splitting the file before chunking the text. If not specified, the default [.!?\n] are used to split into sentences. However, you may want to use spaces or other delimiters.

​
tag_set
string[] | null
Tag set is a comma separated list of tags which will be passed down to the chunks made from the file. Tags are used to filter chunks when searching. HNSW indices are created for each tag such that there is no performance loss when filtering on them.

​
target_splits_per_chunk
integer | null
Target splits per chunk. This is an optional field which allows you to specify the number of splits you want per chunk. If not specified, the default 20 is used. However, you may want to use a different number.

Required range: x > 0
​
time_stamp
string | null
Time stamp should be an ISO 8601 combined date and time without timezone. Time_stamp is used for time window filtering and recency-biasing search results. Will be passed down to the file's chunks.

Create Presigned CSV/JSONL S3 PUT URL
This route is useful for uploading very large CSV or JSONL files. Once you have completed the upload, chunks will be automatically created from the file for each line in the CSV or JSONL file. The chunks will be indexed and searchable. Auth’ed user must be an admin or owner of the dataset’s organization to upload a file.

POST

api.trieve.ai

/
api
/
file
/
csv_or_jsonl
Send

Authorization

Header

Body

cURL

Python

JavaScript

PHP

Go

Java

curl --request POST \
  --url https://api.trieve.ai/api/file/csv_or_jsonl \
  --header 'Authorization: <api-key>' \
  --header 'Content-Type: application/json' \
  --header 'TR-Dataset: <tr-dataset>' \
  --data '{
  "description": "This is an example file",
  "file_name": "example.pdf",
  "link": "https://example.com",
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "tag_set": [
    "tag1",
    "tag2"
  ],
  "time_stamp": "2021-01-01 00:00:00.000Z"
}'

200

400

{
  "file_metadata": {
    "created_at": "2021-01-01 00:00:00.000",
    "dataset_id": "e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3",
    "file_name": "file.txt",
    "id": "e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e3e3",
    "link": "https://trieve.ai",
    "metadata": {
      "key": "value"
    },
    "size": 1000,
    "tag_set": "tag1,tag2",
    "time_stamp": "2021-01-01 00:00:00.000",
    "updated_at": "2021-01-01 00:00:00.000"
  },
  "presigned_put_url": "<string>"
}
Authorizations
​
Authorization
string
header
required
Headers
​
TR-Dataset
string
required
The dataset id or tracking_id to use for the request. We assume you intend to use an id if the value is a valid uuid.

Body
application/json
​
file_name
string
required
Name of the file being uploaded, including the extension. Will be used to determine CSV or JSONL for processing.

​
description
string | null
Description is an optional convience field so you do not have to remember what the file contains or is about. It will be included on the group resulting from the file which will hold its chunk.

​
fulltext_boost_factor
number | null
Amount to multiplicatevly increase the frequency of the tokens in the boost phrase for each row's chunk by. Applies to fulltext (SPLADE) and keyword (BM25) search.

​
group_tracking_id
string | null
Group tracking id is an optional field which allows you to specify the tracking id of the group that is created from the file. Chunks created will be created with the tracking id of group_tracking_id|<index of chunk>

​
link
string | null
Link to the file. This can also be any string. This can be used to filter when searching for the file's resulting chunks. The link value will not affect embedding creation.

​
mappings
object[]
Specify all of the mappings between columns or fields in a CSV or JSONL file and keys in the ChunkReqPayload. Array fields like tag_set and image_urls can have multiple mappings. Boost phrase can also have multiple mappings which get concatenated. Other fields can only have one mapping and only the last mapping will be used.


Show child attributes

​
metadata
any | null
Metadata is a JSON object which can be used to filter chunks. This is useful for when you want to filter chunks by arbitrary metadata. Unlike with tag filtering, there is a performance hit for filtering on metadata. Will be passed down to the file's chunks.

​
semantic_boost_factor
number | null
Arbitrary float (positive or negative) specifying the multiplicate factor to apply before summing the phrase vector with the chunk_html embedding vector. Applies to semantic (embedding model) search.

​
tag_set
string[] | null
Tag set is a comma separated list of tags which will be passed down to the chunks made from the file. Each tag will be joined with what's creatd per row of the CSV or JSONL file.

​
time_stamp
string | null
Time stamp should be an ISO 8601 combined date and time without timezone. Time_stamp is used for time window filtering and recency-biasing search results. Will be passed down to the file's chunks.

​
upsert_by_tracking_id
boolean | null
Upsert by tracking_id. If true, chunks will be upserted by tracking_id. If false, chunks with the same tracking_id as another already existing chunk will be ignored. Defaults to true.

Response
200 - application/json
​
file_metadata
object
required

Show child attributes

​
presigned_put_url
string
required
Signed URL to upload the file to.
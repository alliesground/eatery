# require 'httparty'
require 'aws-sdk-s3'
require 'json'
require 'base64'
require './util'

def create(event:, context:)

  parsed_event_body = Util.parse_multipart_hash(event)

  mime = parsed_event_body["file"][:mime]
  file_extension = /\/(.*)/.match(mime)[1]

  index = 1
  title = 'test_item'
  key_name = "items/test/#{index}_#{title}.#{file_extension}"

  s3 = Aws::S3::Client.new(
    access_key_id: 'AKIAQSJMQ6OMPB75OJ7U',
    secret_access_key: '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',
    region: 'ap-southeast-2'
  )

  s3.put_object(
    bucket: 'restro-development',
    key: key_name,
    body: Base64.encode64(parsed_event_body["file"][:data])
  )

  {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: {
      message: "Item created successfully",
      # location: response.body
    }.to_json
  }
end

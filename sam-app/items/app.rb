# require 'httparty'
require 'aws-sdk-s3'
require 'json'

def create(event:, context:)

  # save data 
  # get id of the data
  # use that id as a part of key name for s3 object

  id = 1
  title = 'test_item'

  key_name = "items/test/#{id}.#{title}"

  s3 = Aws::S3::Client.new(
    access_key_id: 'AKIAQSJMQ6OMPB75OJ7U',
    secret_access_key: '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',
    region: 'ap-southeast-2'
  )

  s3.put_object(
    bucket: 'restro-development',
    key: key_name,
    body: event['body']
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

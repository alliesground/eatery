# require 'httparty'
require 'aws-sdk-s3'
require 'json'
require 'base64'
require './util'
require 'pg'

def create(event:, context:)

  parsed_event_body = Util.parse_multipart_hash(event)

  item_name = parsed_event_body["name"][0]
  item_description = parsed_event_body["description"][0]
  item_price = parsed_event_body["price"][0]

  puts "Name => #{item_name}, Description: #{item_description}, Price: #{item_price}"

  # Get Uploaded files url from the file's key passed from client
  # Save Item data with the S3 file url to psql

  conn = PG.connect(dbname: 'eatery', 
                    user: 'eatery', 
                    host: 'db', 
                    port: 5432, 
                    password: '')

  res = conn.exec( "SELECT count(*) from items" )

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

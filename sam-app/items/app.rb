# require 'httparty'
require 'aws-sdk-s3'
require 'json'
require 'base64'
require './util'
require 'pg'

def create(event:, context:)

  item = JSON.parse(Base64.decode64(event["body"]))

  # Get Uploaded files url from the file's key passed from client
  # Save Item data with the S3 file url to psql

  conn = PG.connect(dbname: 'eatery', 
                    user: 'eatery', 
                    host: 'db', 
                    port: 5432, 
                    password: '')

  sql = <<~SQL.gsub(/\s+/, " ").strip
    INSERT INTO items (name, description, price)
    VALUES ('#{item['name']}', '#{item['description']}', #{item['price'].to_i});
  SQL

  res = conn.exec(sql)

  puts "Sql response => #{res}"

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

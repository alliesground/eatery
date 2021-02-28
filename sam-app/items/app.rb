# require 'httparty'
require 'aws-sdk-s3'
require 'aws-sdk'
require 'json'
require 'base64'
require './util'
require 'pg'

def create(event:, context:)

  item = JSON.parse(Base64.decode64(event["body"]))

  @conn = PG.connect(dbname: 'eatery', 
                    user: 'eatery', 
                    host: 'db', 
                    port: 5432, 
                    password: '')

  create_item = <<~SQL.gsub(/\s+/, " ").strip
    INSERT INTO items (name, description, price)
    VALUES ('#{item['name']}', '#{item['description']}', #{item['price'].to_i}) RETURNING id;
  SQL

  create_item_image = <<~SQL.gsub(/\s+/, " ").strip
    INSERT INTO images (url, item_id)
    VALUES ($1, $2);
  SQL

  @conn.transaction do |conn|
    res = conn.exec(create_item)
    item_id = res[0]['id']

    item['imageUrls'].each do |url|
      conn.exec_params(create_item_image, [url, item_id]).clear
    end

    res.clear
  end

  {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: "Item created successfully"
  }

rescue StandardError => error
  puts "Error => #{error}"

  {
    statusCode: 500,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
    },
    body: "Internal Server Error."
  }
end

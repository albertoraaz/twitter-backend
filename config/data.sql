DROP TABLE IF EXISTS tweet;
CREATE TABLE tweet(
   id                           int NOT NULL AUTO_INCREMENT 
  ,created_at                   VARCHAR(30) 
  ,twitter_text                 VARCHAR(200)
  ,user_screen_name             VARCHAR(50) 
  ,user_profile_image_url       VARCHAR(250)
  ,user_name                    VARCHAR(250)
  ,PRIMARY KEY (id)
);
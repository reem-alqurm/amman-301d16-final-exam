
CREATE TABLE IF NOT EXISTS
character(
  id SERIAL PRIMARY KEY ,
  character VARCHAR(256) ,
  image VARCHAR(256) ,
  quote VARCHAR(256), 
  characterDirection VARCHAR(256) 
);
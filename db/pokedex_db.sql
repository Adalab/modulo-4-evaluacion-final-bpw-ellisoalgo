CREATE DATABASE pokedex;
USE pokedex;
CREATE TABLE pokemon (
	id INT auto_increment primary key,
    name VARCHAR(30) not null,
    photo VARCHAR(250),
    type VARCHAR(45) not null,
    height INT,
    weight INT
);

INSERT INTO pokemon (name, photo, type, height, weight) VALUES 
	("bulbasaur","https://tinyurl.com/24bdjzpf","grass","7","69"),
    ("charmander","https://tinyurl.com/2772wmkz","fire","6","85"),
    ("squirtle","https://tinyurl.com/5n7yx5tm","water","5","90");

CREATE TABLE users (
	userId INT auto_increment primary key,
    email VARCHAR(45) unique,
    name VARCHAR(45),
    address VARCHAR(250),
    password VARCHAR(30)
    );
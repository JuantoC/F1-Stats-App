CREATE TABLE IF NOT EXISTS tracks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    name VARCHAR(255) NULL,
    length VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS races (
    id INT AUTO_INCREMENT PRIMARY KEY,
    track_id INT NOT NULL,
    date_start DATE NOT NULL,
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

CREATE TABLE IF NOT EXISTS car_racers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS car_manufacturer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    race_id INT NOT NULL,
    car_racer_id INT NOT NULL,
    car_manufacturer_id INT NOT NULL,
    time INT NULL,
    pos_starter INT NOT NULL,
    pos_finisher INT NOT NULL,
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (car_racer_id) REFERENCES car_racers(id),
    FOREIGN KEY (car_manufacturer_id) REFERENCES car_manufacturer(id)
);

CREATE TABLE IF NOT EXISTS laps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    result_id INT NOT NULL,
    time INT NULL,
    pos INT NOT NULL,
    FOREIGN KEY (result_id) REFERENCES results(id)
);
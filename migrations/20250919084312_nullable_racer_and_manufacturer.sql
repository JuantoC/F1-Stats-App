ALTER TABLE results
MODIFY car_racer_id INT NULL,
MODIFY car_manufacturer_id INT NULL;

ALTER TABLE results
DROP FOREIGN KEY results_ibfk_2,
DROP FOREIGN KEY results_ibfk_3;

ALTER TABLE results
ADD CONSTRAINT fk_results_racer
    FOREIGN KEY (car_racer_id) REFERENCES car_racers(id)
    ON DELETE SET NULL,
ADD CONSTRAINT fk_results_manufacturer
    FOREIGN KEY (car_manufacturer_id) REFERENCES car_manufacturer(id)
    ON DELETE SET NULL;

--saber el nombre de la secuencia
SELECT pg_get_serial_sequence('"FormExt"', 'id');
--SABER EN QUE CONTADOR ESTA
SELECT last_value, is_called
FROM "FormExt_id_seq";


-- LLEVAR EL VALOR AL ULTIMO CORRECTO
SELECT setval(
  pg_get_serial_sequence('"FormExt"', 'id'),
  (SELECT MAX(id) FROM "FormExt")
);

SELECT setval(
  pg_get_serial_sequence('"FormInt"', 'id'),
  (SELECT MAX(id) FROM "FormInt")
);

---

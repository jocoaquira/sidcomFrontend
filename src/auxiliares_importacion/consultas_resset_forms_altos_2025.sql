
-- Listar de acuerdo a numero de esa cadena y ordenar
SELECT *
FROM public."FormExt"
WHERE nro_formulario LIKE 'E-%/2025'
ORDER BY
  CAST(SUBSTRING(nro_formulario FROM 'E-(\d+)/2025') AS INTEGER) DESC;

-- Actualizar datos que esten fuera de rango del 2025
UPDATE public."FormExt"
SET nro_formulario =
  'E-' || SUBSTRING(nro_formulario FROM 'E-(\d+)/\d{4}') || '/2024'
WHERE
  CAST(SUBSTRING(nro_formulario FROM 'E-(\d+)/\d{4}') AS INTEGER) > 20000
  AND nro_formulario LIKE 'E-%/2025';

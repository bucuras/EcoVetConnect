-- Create sample alerts for demonstration
INSERT INTO public.alerts (user_id, title, message, severity, category, notes) VALUES
-- Critical alerts
(auth.uid(), 'Temperatură critică detectată', 'Temperatura animalului "Bella" a atins 40.2°C. Este necesară intervenția imediată a veterinarului.', 'critical', 'animal', 'Temperatura ridicată detectată.'),
(auth.uid(), 'Calitate apă contaminată', 'Testele au detectat niveluri periculoase de bacterii în sursa de apă principală. Opriți imediat consumul.', 'critical', 'environment', 'Contaminare detectată în sursa de apă.'),

-- High priority alerts
(auth.uid(), 'Simptome respiratorii observate', 'Animalul "Max" prezintă dificultăți de respirație și tuse persistentă. Recomandăm consultul veterinar.', 'high', 'animal', 'Simptome respiratorii severe.'),
(auth.uid(), 'Nivel ridicat de amoniac', 'Concentrația de amoniac în grajd a depășit limitele normale. Ventilația trebuie îmbunătățită urgent.', 'high', 'environment', 'Nivel ridicat de amoniac detectat.'),

-- Medium priority alerts
(auth.uid(), 'Scădere apetit observată', 'Animalul "Luna" a refuzat hrana în ultimele 24 de ore. Monitorizați îndeaproape.', 'medium', 'animal', 'Scădere apetit observată.'),
(auth.uid(), 'pH sol în afara limitelor', 'Testul solului din sectorul A arată un pH de 8.2, peste valoarea optimă pentru culturile actuale.', 'medium', 'environment', 'pH sol în afara limitelor.'),

-- Low priority alerts
(auth.uid(), 'Programare control veterinar', 'Este timpul pentru controlul veterinar lunar. Programați vizita în următoarele 7 zile.', 'low', 'animal', 'Control veterinar programat.'),
(auth.uid(), 'Mentenanță echipamente monitorizare', 'Senzorii de mediu necesită calibrare. Programați mentenanța în următoarea săptămână.', 'low', 'environment', 'Mentenanță necesară pentru echipamente.');
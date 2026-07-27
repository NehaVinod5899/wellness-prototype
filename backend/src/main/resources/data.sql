-- Seed data matching the Figma prototype (Section 5.3.3) so the app looks
-- populated on first run, exactly as shown in the design screenshots.

INSERT INTO contacts (name, phone_number, role) VALUES ('Sarah', '+353871234567', 'FAVOURITE');
INSERT INTO contacts (name, phone_number, role) VALUES ('Emma', '+353871234568', 'REGULAR');
INSERT INTO contacts (name, phone_number, role) VALUES ('Son', '+353871234569', 'REGULAR');
INSERT INTO contacts (name, phone_number, role) VALUES ('Emergency Services', '112', 'EMERGENCY');

INSERT INTO community_groups (name, schedule, joined) VALUES ('Walking Club', 'Tuesday 10:00', false);
INSERT INTO community_groups (name, schedule, joined) VALUES ('Coffee Morning', 'Wednesday 11:00', false);
INSERT INTO community_groups (name, schedule, joined) VALUES ('Book Club', 'Friday 14:00', false);



INSERT INTO contacts (name, phone_number, role) VALUES ('Sarah', '+353871234567', 'FAVOURITE');
INSERT INTO contacts (name, phone_number, role) VALUES ('Emma', '+353871234568', 'REGULAR');
INSERT INTO contacts (name, phone_number, role) VALUES ('Son', '+353871234569', 'REGULAR');
INSERT INTO contacts (name, phone_number, role) VALUES ('Emergency Services', '112', 'EMERGENCY');

INSERT INTO community_groups (name, schedule, joined) VALUES ('Walking Club', 'Tuesday 10:00', false);
INSERT INTO community_groups (name, schedule, joined) VALUES ('Coffee Morning', 'Wednesday 11:00', false);
INSERT INTO community_groups (name, schedule, joined) VALUES ('Book Club', 'Friday 14:00', false);

INSERT INTO messages (contact_id, contact_name, text, sent_at) VALUES (1, 'Sarah', 'Are you free for a walk later?', CURRENT_TIMESTAMP);
INSERT INTO messages (contact_id, contact_name, text, sent_at) VALUES (3, 'Son', 'Call me when you get a chance', DATEADD('DAY', -1, CURRENT_TIMESTAMP));
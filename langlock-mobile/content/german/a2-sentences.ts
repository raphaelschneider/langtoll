import type { SentenceItem } from './types';

// A2 sentences: past tense creeps in, subordinate clauses appear, real
// situations (travel, health, work). clozeIndex picks the load-bearing word.

export const A2_SENTENCES: SentenceItem[] = [
  { id: 'a2s001', de: 'Ich bin heute um sieben Uhr aufgestanden.', en: 'I got up at seven o’clock today.', level: 'A2', clozeIndex: 6, clozeDistractors: ['eingeschlafen', 'angekommen', 'ausgegangen'] },
  { id: 'a2s002', de: 'Der Zug hat zwanzig Minuten Verspätung.', en: 'The train is twenty minutes late.', level: 'A2', clozeIndex: 5, clozeDistractors: ['Gepäck', 'Gleis', 'Pause'] },
  { id: 'a2s003', de: 'Wir müssen in Köln umsteigen.', en: 'We have to change trains in Cologne.', level: 'A2', clozeIndex: 4, clozeDistractors: ['einkaufen', 'aufstehen', 'anrufen'] },
  { id: 'a2s004', de: 'Ich habe starke Schmerzen im Rücken.', en: 'I have bad pain in my back.', level: 'A2', clozeIndex: 3, clozeDistractors: ['Wolken', 'Aufgaben', 'Angebote'] },
  { id: 'a2s005', de: 'Kann ich einen Termin für morgen bekommen?', en: 'Can I get an appointment for tomorrow?', level: 'A2', clozeIndex: 3, clozeDistractors: ['Schlüssel', 'Mantel', 'Kunden'] },
  { id: 'a2s006', de: 'Morgen soll es den ganzen Tag regnen.', en: 'It is supposed to rain all day tomorrow.', level: 'A2', clozeIndex: 6, clozeDistractors: ['schneien', 'arbeiten', 'kochen'] },
  { id: 'a2s007', de: 'Gehen Sie geradeaus und dann links.', en: 'Go straight ahead and then left.', level: 'A2', clozeIndex: 2, clozeDistractors: ['plötzlich', 'meistens', 'zufrieden'] },
  { id: 'a2s008', de: 'Die Besprechung beginnt um zehn Uhr.', en: 'The meeting starts at ten o’clock.', level: 'A2', clozeIndex: 1, clozeDistractors: ['Erkältung', 'Wohnung', 'Fahrkarte'] },
  { id: 'a2s009', de: 'Nach der Arbeit habe ich endlich Feierabend.', en: 'After work I finally have my evening off.', level: 'A2', clozeIndex: 6, clozeDistractors: ['Fieber', 'Gewitter', 'Gepäck'] },
  { id: 'a2s010', de: 'Kann ich diese Jacke bitte anprobieren?', en: 'Can I try on this jacket, please?', level: 'A2', clozeIndex: 5, clozeDistractors: ['umtauschen', 'verdienen', 'verpassen'] },
  { id: 'a2s011', de: 'Die Wohnung ist schön, aber die Miete ist zu hoch.', en: 'The apartment is nice, but the rent is too high.', level: 'A2', clozeIndex: 7, clozeDistractors: ['Größe', 'Ampel', 'Pause'] },
  { id: 'a2s012', de: 'Ich habe gestern meinen Schlüssel verloren.', en: 'I lost my key yesterday.', level: 'A2', clozeIndex: 4, clozeDistractors: ['Nachbarn', 'Kaffee', 'Regen'] },
  { id: 'a2s013', de: 'Er ist enttäuscht, weil das Spiel verloren ging.', en: 'He is disappointed because the game was lost.', level: 'A2', clozeIndex: 2, clozeDistractors: ['stolz', 'gelangweilt', 'überrascht'] },
  { id: 'a2s014', de: 'Ich freue mich auf das Wochenende.', en: 'I am looking forward to the weekend.', level: 'A2', clozeIndex: 1, clozeDistractors: ['ärgere', 'erinnere', 'kümmere'] },
  { id: 'a2s015', de: 'Wir sind letztes Jahr nach Spanien gereist.', en: 'We traveled to Spain last year.', level: 'A2', clozeIndex: 6, clozeDistractors: ['gearbeitet', 'gekocht', 'geblieben'] },
  { id: 'a2s016', de: 'Meistens frühstücke ich nur einen Kaffee.', en: 'Usually I just have a coffee for breakfast.', level: 'A2', clozeIndex: 0, clozeDistractors: ['Selten', 'Sofort', 'Übermorgen'] },
  { id: 'a2s017', de: 'Der Kühlschrank ist schon wieder leer.', en: 'The fridge is empty again already.', level: 'A2', clozeIndex: 1, clozeDistractors: ['Stadtplan', 'Feierabend', 'Bahnhof'] },
  { id: 'a2s018', de: 'Sie hat sich um die neue Stelle beworben.', en: 'She applied for the new position.', level: 'A2', clozeIndex: 7, clozeDistractors: ['gekümmert', 'gefreut', 'erinnert'] },
  { id: 'a2s019', de: 'Ohne Rezept bekommen Sie dieses Medikament nicht.', en: 'You won’t get this medicine without a prescription.', level: 'A2', clozeIndex: 1, clozeDistractors: ['Gehalt', 'Angebot', 'Gewitter'] },
  { id: 'a2s020', de: 'Plötzlich hat es angefangen zu schneien.', en: 'Suddenly it started to snow.', level: 'A2', clozeIndex: 0, clozeDistractors: ['Geradeaus', 'Zufrieden', 'Meistens'] },
  { id: 'a2s021', de: 'Wir ziehen nächsten Monat in eine größere Wohnung um.', en: 'We are moving to a bigger apartment next month.', level: 'A2', clozeIndex: 8, clozeDistractors: ['an', 'aus', 'auf'] },
  { id: 'a2s022', de: 'An der Kasse war eine lange Schlange.', en: 'There was a long queue at the checkout.', level: 'A2', clozeIndex: 2, clozeDistractors: ['Ampel', 'Brücke', 'Heizung'] },
];

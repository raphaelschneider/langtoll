import type { SentenceItem } from './types';

// B1 sentences: subordinate clauses, Konjunktiv creeping in, opinions and
// real argumentation. clozeIndex targets connectors and load-bearing verbs.

export const B1_SENTENCES: SentenceItem[] = [
  { id: 'b1s001', de: 'Obwohl es regnete, sind wir wandern gegangen.', en: 'Although it was raining, we went hiking.', level: 'B1', clozeIndex: 0, clozeDistractors: ['Trotzdem', 'Deshalb', 'Außerdem'] },
  { id: 'b1s002', de: 'Meiner Meinung nach ist das keine gute Idee.', en: 'In my opinion, that is not a good idea.', level: 'B1', clozeIndex: 1, clozeDistractors: ['Erfahrung', 'Regierung', 'Beziehung'] },
  { id: 'b1s003', de: 'Er hat mich überzeugt, obwohl ich skeptisch war.', en: 'He convinced me, although I was skeptical.', level: 'B1', clozeIndex: 3, clozeDistractors: ['entlassen', 'verglichen', 'vermisst'] },
  { id: 'b1s004', de: 'Die Regierung hat ein neues Gesetz beschlossen.', en: 'The government passed a new law.', level: 'B1', clozeIndex: 5, clozeDistractors: ['Vertrauen', 'Angebot', 'Verhalten'] },
  { id: 'b1s005', de: 'Wir sollten mehr auf die Umwelt achten.', en: 'We should pay more attention to the environment.', level: 'B1', clozeIndex: 5, clozeDistractors: ['Wahl', 'Miete', 'Meinung'] },
  { id: 'b1s006', de: 'Je mehr du übst, desto besser wirst du.', en: 'The more you practice, the better you get.', level: 'B1', clozeIndex: 5, clozeDistractors: ['trotzdem', 'obwohl', 'sondern'] },
  { id: 'b1s007', de: 'Ich habe die Nase voll von diesen Ausreden.', en: 'I am fed up with these excuses.', level: 'B1', clozeIndex: 3, clozeDistractors: ['Hand', 'Stirn', 'Zunge'] },
  { id: 'b1s008', de: 'Sie hat sich endlich entschieden, zu kündigen.', en: 'She finally decided to quit.', level: 'B1', clozeIndex: 4, clozeDistractors: ['gewöhnt', 'versöhnt', 'verlassen'] },
  { id: 'b1s009', de: 'Es lohnt sich, jeden Tag ein bisschen zu lernen.', en: 'It is worth learning a little every day.', level: 'B1', clozeIndex: 1, clozeDistractors: ['trennt', 'erinnert', 'ärgert'] },
  { id: 'b1s010', de: 'Trotzdem hat er sich bei mir entschuldigt.', en: 'Nevertheless, he apologized to me.', level: 'B1', clozeIndex: 0, clozeDistractors: ['Obwohl', 'Deshalb', 'Falls'] },
  { id: 'b1s011', de: 'Man kann sich immer auf sie verlassen.', en: 'You can always rely on her.', level: 'B1', clozeIndex: 6, clozeDistractors: ['versöhnen', 'gewöhnen', 'freuen'] },
  { id: 'b1s012', de: 'Nach dem Streit haben sie sich wieder versöhnt.', en: 'After the argument, they made up again.', level: 'B1', clozeIndex: 2, clozeDistractors: ['Vorschlag', 'Vorteil', 'Lebenslauf'] },
  { id: 'b1s013', de: 'Im Vorstellungsgespräch war sie sehr überzeugend.', en: 'She was very convincing in the job interview.', level: 'B1', clozeIndex: 1, clozeDistractors: ['Klimawandel', 'Kühlschrank', 'Feierabend'] },
  { id: 'b1s014', de: 'Wir müssen unnötigen Müll unbedingt vermeiden.', en: 'We absolutely have to avoid unnecessary waste.', level: 'B1', clozeIndex: 5, clozeDistractors: ['verbrauchen', 'vergleichen', 'verzeihen'] },
  { id: 'b1s015', de: 'Falls du Hilfe brauchst, ruf mich einfach an.', en: 'In case you need help, just call me.', level: 'B1', clozeIndex: 0, clozeDistractors: ['Obwohl', 'Deshalb', 'Außerdem'] },
  { id: 'b1s016', de: 'Ich drücke dir für die Prüfung die Daumen.', en: 'I’ll keep my fingers crossed for your exam.', level: 'B1', clozeIndex: 7, clozeDistractors: ['Hände', 'Finger', 'Ohren'] },
  { id: 'b1s017', de: 'Die Firma hat letzten Monat zwanzig Leute eingestellt.', en: 'The company hired twenty people last month.', level: 'B1', clozeIndex: 7, clozeDistractors: ['entlassen', 'befördert', 'verglichen'] },
  { id: 'b1s018', de: 'Deshalb verzichte ich dieses Jahr auf Flugreisen.', en: 'That is why I am giving up air travel this year.', level: 'B1', clozeIndex: 1, clozeDistractors: ['vergesse', 'verbessere', 'vergleiche'] },
  { id: 'b1s019', de: 'Können wir das bitte unter vier Augen besprechen?', en: 'Can we please discuss this in private?', level: 'B1', clozeIndex: 5, clozeDistractors: ['Ohren', 'Händen', 'Wänden'] },
  { id: 'b1s020', de: 'Sowohl der Chef als auch die Kollegen waren begeistert.', en: 'Both the boss and the colleagues were thrilled.', level: 'B1', clozeIndex: 0, clozeDistractors: ['Weder', 'Entweder', 'Obwohl'] },
];

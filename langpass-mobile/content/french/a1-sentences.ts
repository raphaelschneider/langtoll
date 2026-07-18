import type { SentenceItem } from '@/content/german/types';

// French A1 sentences. `de` holds the French text. clozeIndex targets the
// load-bearing word (never the article), and clozeDistractors are same-class
// words that would be grammatical but wrong — so the exercise tests meaning,
// not pattern-matching on word shape.
//
// Two French-specific rules the blanks respect:
//  · French puts a space before ? ! : ; so the "?" is its own token — the last
//    real word of a question is therefore clean and safe to blank.
//  · Adjective distractors agree with the noun they describe (une grande sœur
//    → petite / jolie / vieille, never petit / joli / vieux).
//
// `gloss` carries the non-English UI locales; see a1-vocab.ts for the rule.

export const A1_SENTENCES: SentenceItem[] = [
  { id: 'fr1s001', de: 'Bonjour, comment allez-vous ?', en: 'Hello, how are you?', gloss: { de: 'Guten Tag, wie geht es Ihnen?', es: 'Buenos días, ¿cómo está usted?', it: 'Buongiorno, come sta?', pt: 'Bom dia, como vai o senhor?' }, level: 'A1', clozeIndex: 1, clozeDistractors: ['pourquoi', 'combien', 'quand'] },
  { id: 'fr1s002', de: 'Je veux un café, s’il vous plaît.', en: 'I want a coffee, please.', gloss: { de: 'Ich möchte einen Kaffee, bitte.', es: 'Quiero un café, por favor.', it: 'Voglio un caffè, per favore.', pt: 'Quero um café, por favor.' }, level: 'A1', clozeIndex: 1, clozeDistractors: ['bois', 'mange', 'parle'] },
  { id: 'fr1s003', de: 'Où sont les toilettes ?', en: 'Where are the toilets?', gloss: { de: 'Wo ist die Toilette?', es: '¿Dónde está el baño?', it: 'Dov’è il bagno?', pt: 'Onde fica o banheiro?' }, level: 'A1', clozeIndex: 0, clozeDistractors: ['Quand', 'Comment', 'Qui'] },
  { id: 'fr1s004', de: 'J’habite dans une petite maison.', en: 'I live in a small house.', gloss: { de: 'Ich wohne in einem kleinen Haus.', es: 'Vivo en una casa pequeña.', it: 'Abito in una casa piccola.', pt: 'Moro numa casa pequena.' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['grande', 'vieille', 'jolie'] },
  { id: 'fr1s005', de: 'Combien coûte la bière ?', en: 'How much does the beer cost?', gloss: { de: 'Wie viel kostet das Bier?', es: '¿Cuánto cuesta la cerveza?', it: 'Quanto costa la birra?', pt: 'Quanto custa a cerveja?' }, level: 'A1', clozeIndex: 0, clozeDistractors: ['Comment', 'Pourquoi', 'Quand'] },
  { id: 'fr1s006', de: 'La nourriture est très bonne.', en: 'The food is very good.', gloss: { de: 'Das Essen ist sehr gut.', es: 'La comida está muy buena.', it: 'Il cibo è molto buono.', pt: 'A comida está muito boa.' }, level: 'A1', clozeIndex: 1, clozeDistractors: ['bière', 'viande', 'pomme'] },
  { id: 'fr1s007', de: 'Je ne parle pas très bien français.', en: 'I don’t speak French very well.', gloss: { de: 'Ich spreche nicht sehr gut Französisch.', es: 'No hablo francés muy bien.', it: 'Non parlo molto bene il francese.', pt: 'Não falo francês muito bem.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['mange', 'travaille', 'comprends'] },
  { id: 'fr1s008', de: 'Aujourd’hui je vais au travail.', en: 'Today I am going to work.', gloss: { de: 'Heute gehe ich zur Arbeit.', es: 'Hoy voy al trabajo.', it: 'Oggi vado al lavoro.', pt: 'Hoje eu vou ao trabalho.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['suis', 'fais', 'veux'] },
  { id: 'fr1s009', de: 'Elle a une grande sœur.', en: 'She has a big sister.', gloss: { de: 'Sie hat eine große Schwester.', es: 'Ella tiene una hermana mayor.', it: 'Lei ha una sorella grande.', pt: 'Ela tem uma irmã mais velha.' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['petite', 'jolie', 'vieille'] },
  { id: 'fr1s010', de: 'J’aime la plage et la mer.', en: 'I like the beach and the sea.', gloss: { de: 'Ich mag den Strand und das Meer.', es: 'Me gusta la playa y el mar.', it: 'Mi piace la spiaggia e il mare.', pt: 'Gosto da praia e do mar.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['ville', 'gare', 'rue'] },
  { id: 'fr1s011', de: 'Le restaurant est très cher.', en: 'The restaurant is very expensive.', gloss: { de: 'Das Restaurant ist sehr teuer.', es: 'El restaurante es muy caro.', it: 'Il ristorante è molto caro.', pt: 'O restaurante é muito caro.' }, level: 'A1', clozeIndex: 1, clozeDistractors: ['magasin', 'marché', 'hôtel'] },
  { id: 'fr1s012', de: 'Demain je vais au marché.', en: 'Tomorrow I am going to the market.', gloss: { de: 'Morgen gehe ich zum Markt.', es: 'Mañana voy al mercado.', it: 'Domani vado al mercato.', pt: 'Amanhã eu vou ao mercado.' }, level: 'A1', clozeIndex: 0, clozeDistractors: ['Hier', 'Maintenant', 'Toujours'] },
  { id: 'fr1s013', de: 'Ma mère travaille dans un magasin.', en: 'My mother works in a shop.', gloss: { de: 'Meine Mutter arbeitet in einem Laden.', es: 'Mi madre trabaja en una tienda.', it: 'Mia madre lavora in un negozio.', pt: 'Minha mãe trabalha numa loja.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['habite', 'mange', 'parle'] },
  { id: 'fr1s014', de: 'Je ne comprends pas la question.', en: 'I don’t understand the question.', gloss: { de: 'Ich verstehe die Frage nicht.', es: 'No entiendo la pregunta.', it: 'Non capisco la domanda.', pt: 'Não entendo a pergunta.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['parle', 'veux', 'mange'] },
  { id: 'fr1s015', de: 'La maison est nouvelle et très jolie.', en: 'The house is new and very pretty.', gloss: { de: 'Das Haus ist neu und sehr hübsch.', es: 'La casa es nueva y muy bonita.', it: 'La casa è nuova e molto carina.', pt: 'A casa é nova e muito bonita.' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['vieille', 'petite', 'chère'] },
  { id: 'fr1s016', de: 'J’ai deux frères.', en: 'I have two brothers.', gloss: { de: 'Ich habe zwei Brüder.', es: 'Tengo dos hermanos.', it: 'Ho due fratelli.', pt: 'Tenho dois irmãos.' }, level: 'A1', clozeIndex: 1, clozeDistractors: ['trois', 'cinq', 'dix'] },
  { id: 'fr1s017', de: 'Le garçon boit du lait.', en: 'The boy drinks milk.', gloss: { de: 'Der Junge trinkt Milch.', es: 'El niño bebe leche.', it: 'Il ragazzo beve il latte.', pt: 'O menino bebe leite.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['mange', 'achète', 'veut'] },
  { id: 'fr1s018', de: 'Pourquoi es-tu fatigué ?', en: 'Why are you tired?', gloss: { de: 'Warum bist du müde?', es: '¿Por qué estás cansado?', it: 'Perché sei stanco?', pt: 'Por que você está cansado?' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['content', 'petit', 'nouveau'] },
  { id: 'fr1s019', de: 'Le café coûte trois euros.', en: 'The coffee costs three euros.', gloss: { de: 'Der Kaffee kostet drei Euro.', es: 'El café cuesta tres euros.', it: 'Il caffè costa tre euro.', pt: 'O café custa três euros.' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['deux', 'cinq', 'neuf'] },
  { id: 'fr1s020', de: 'Je mange toujours du pain le matin.', en: 'I always eat bread in the morning.', gloss: { de: 'Ich esse morgens immer Brot.', es: 'Siempre como pan por la mañana.', it: 'Mangio sempre pane la mattina.', pt: 'Sempre como pão de manhã.' }, level: 'A1', clozeIndex: 2, clozeDistractors: ['jamais', 'demain', 'hier'] },
  { id: 'fr1s021', de: 'Où est la gare ?', en: 'Where is the train station?', gloss: { de: 'Wo ist der Bahnhof?', es: '¿Dónde está la estación?', it: 'Dov’è la stazione?', pt: 'Onde fica a estação?' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['plage', 'école', 'rue'] },
  { id: 'fr1s022', de: 'Le livre est sur la table.', en: 'The book is on the table.', gloss: { de: 'Das Buch liegt auf dem Tisch.', es: 'El libro está sobre la mesa.', it: 'Il libro è sul tavolo.', pt: 'O livro está sobre a mesa.' }, level: 'A1', clozeIndex: 3, clozeDistractors: ['sous', 'dans', 'avec'] },
];

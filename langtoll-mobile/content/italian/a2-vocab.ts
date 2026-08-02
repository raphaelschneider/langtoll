import type { VocabItem } from '@/content/german/types';

// Italian (it-IT) A2 vocabulary. The `de` field holds the Italian text (see the
// note in content/german/types.ts). Nouns ship with their article, which in
// Italian is picked by the SOUND that follows, not just the gender:
//   il  — masculine before most consonants (il treno, il letto)
//   lo  — masculine before s+consonant, z, gn, ps, y (lo sconto, lo stipendio)
//   l'  — masculine or feminine before a vowel (l’aereo, l’azienda)
//   la  — feminine before a consonant (la valigia)
//   i / gli / le — plurals (i pantaloni, gli occhiali, le scarpe)
//
// A2 assumes A1 (content/italian/a1-vocab.ts) and does not repeat it: no
// greetings, no family, no numbers 1–10, no essere/avere/fare/andare. A2 owns
// daily routine and reflexives, travel, shopping and money, work and study,
// health and the body, weather, feelings, comparatives, house and clothing.
//
// `gloss` carries the other UI locales. English lives in `en` and is the
// guaranteed fallback; Italian itself is never glossed, so each item covers
// de / es / fr / pt.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine ─────────────────────────────────────────────────────
  { id: 'it2v001', de: 'svegliarsi', en: ['to wake up'], gloss: { de: ['aufwachen'], es: ['despertarse'], fr: ['se réveiller'], pt: ['acordar'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'it2v002', de: 'alzarsi', en: ['to get up'], gloss: { de: ['aufstehen'], es: ['levantarse'], fr: ['se lever'], pt: ['levantar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'it2v003', de: 'lavarsi', en: ['to wash oneself'], gloss: { de: ['sich waschen'], es: ['lavarse'], fr: ['se laver'], pt: ['lavar-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'it2v004', de: 'vestirsi', en: ['to get dressed'], gloss: { de: ['sich anziehen'], es: ['vestirse'], fr: ['s’habiller'], pt: ['vestir-se'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'it2v005', de: 'addormentarsi', en: ['to fall asleep'], gloss: { de: ['einschlafen'], es: ['dormirse'], fr: ['s’endormir'], pt: ['adormecer'] }, pos: 'verb', level: 'A2', category: 'daily' },
  { id: 'it2v006', de: 'la colazione', en: ['the breakfast'], gloss: { de: ['das Frühstück'], es: ['el desayuno'], fr: ['le petit-déjeuner'], pt: ['o café da manhã'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'it2v007', de: 'la doccia', en: ['the shower'], gloss: { de: ['die Dusche'], es: ['la ducha'], fr: ['la douche'], pt: ['o chuveiro'] }, pos: 'noun', level: 'A2', category: 'daily' },
  { id: 'it2v008', de: 'di solito', en: ['usually'], gloss: { de: ['normalerweise'], es: ['normalmente'], fr: ['d’habitude'], pt: ['normalmente'] }, pos: 'adv', level: 'A2', category: 'daily' },
  { id: 'it2v009', de: 'presto', en: ['early'], gloss: { de: ['früh'], es: ['temprano'], fr: ['tôt'], pt: ['cedo'] }, pos: 'adv', level: 'A2', category: 'daily' },
  { id: 'it2v010', de: 'tardi', en: ['late'], gloss: { de: ['spät'], es: ['tarde'], fr: ['tard'], pt: ['tarde'] }, pos: 'adv', level: 'A2', category: 'daily' },

  // ── travel & transport ────────────────────────────────────────────────
  { id: 'it2v011', de: 'il treno', en: ['the train'], gloss: { de: ['der Zug'], es: ['el tren'], fr: ['le train'], pt: ['o trem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v012', de: 'l’aereo', en: ['the plane'], gloss: { de: ['das Flugzeug'], es: ['el avión'], fr: ['l’avion'], pt: ['o avião'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v013', de: 'l’autobus', en: ['the bus'], gloss: { de: ['der Bus'], es: ['el autobús'], fr: ['le bus'], pt: ['o ônibus'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v014', de: 'il biglietto', en: ['the ticket'], gloss: { de: ['die Fahrkarte'], es: ['el billete'], fr: ['le billet'], pt: ['a passagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v015', de: 'il viaggio', en: ['the trip', 'the journey'], gloss: { de: ['die Reise'], es: ['el viaje'], fr: ['le voyage'], pt: ['a viagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v016', de: 'la valigia', en: ['the suitcase'], gloss: { de: ['der Koffer'], es: ['la maleta'], fr: ['la valise'], pt: ['a mala'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v017', de: 'la partenza', en: ['the departure'], gloss: { de: ['die Abfahrt'], es: ['la salida'], fr: ['le départ'], pt: ['a partida'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v018', de: 'l’arrivo', en: ['the arrival'], gloss: { de: ['die Ankunft'], es: ['la llegada'], fr: ['l’arrivée'], pt: ['a chegada'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v019', de: 'il passaporto', en: ['the passport'], gloss: { de: ['der Reisepass'], es: ['el pasaporte'], fr: ['le passeport'], pt: ['o passaporte'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v020', de: 'la macchina', en: ['the car'], gloss: { de: ['das Auto'], es: ['el coche'], fr: ['la voiture'], pt: ['o carro'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v021', de: 'prenotare', en: ['to book', 'to reserve'], gloss: { de: ['buchen'], es: ['reservar'], fr: ['réserver'], pt: ['reservar'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── shopping, money & clothing ────────────────────────────────────────
  { id: 'it2v022', de: 'il prezzo', en: ['the price'], gloss: { de: ['der Preis'], es: ['el precio'], fr: ['le prix'], pt: ['o preço'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v023', de: 'i soldi', en: ['the money'], gloss: { de: ['das Geld'], es: ['el dinero'], fr: ['l’argent'], pt: ['o dinheiro'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v024', de: 'lo sconto', en: ['the discount'], gloss: { de: ['der Rabatt'], es: ['el descuento'], fr: ['la réduction'], pt: ['o desconto'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v025', de: 'la cassa', en: ['the checkout', 'the till'], gloss: { de: ['die Kasse'], es: ['la caja'], fr: ['la caisse'], pt: ['o caixa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v026', de: 'la carta di credito', en: ['the credit card'], gloss: { de: ['die Kreditkarte'], es: ['la tarjeta de crédito'], fr: ['la carte de crédit'], pt: ['o cartão de crédito'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v027', de: 'la taglia', en: ['the size'], gloss: { de: ['die Größe'], es: ['la talla'], fr: ['la taille'], pt: ['o tamanho'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v028', de: 'il supermercato', en: ['the supermarket'], gloss: { de: ['der Supermarkt'], es: ['el supermercado'], fr: ['le supermarché'], pt: ['o supermercado'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v029', de: 'i pantaloni', en: ['the trousers'], gloss: { de: ['die Hose'], es: ['los pantalones'], fr: ['le pantalon'], pt: ['a calça'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v030', de: 'la camicia', en: ['the shirt'], gloss: { de: ['das Hemd'], es: ['la camisa'], fr: ['la chemise'], pt: ['a camisa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v031', de: 'le scarpe', en: ['the shoes'], gloss: { de: ['die Schuhe'], es: ['los zapatos'], fr: ['les chaussures'], pt: ['os sapatos'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'it2v032', de: 'la giacca', en: ['the jacket'], gloss: { de: ['die Jacke'], es: ['la chaqueta'], fr: ['la veste'], pt: ['a jaqueta'] }, pos: 'noun', level: 'A2', category: 'shopping' },

  // ── work & study ──────────────────────────────────────────────────────
  { id: 'it2v033', de: 'la riunione', en: ['the meeting'], gloss: { de: ['die Besprechung'], es: ['la reunión'], fr: ['la réunion'], pt: ['a reunião'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v034', de: 'il capo', en: ['the boss'], gloss: { de: ['der Chef'], es: ['el jefe'], fr: ['le chef'], pt: ['o chefe'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v035', de: 'il collega', en: ['the colleague'], gloss: { de: ['der Kollege'], es: ['el colega'], fr: ['le collègue'], pt: ['o colega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v036', de: 'lo stipendio', en: ['the salary'], gloss: { de: ['das Gehalt'], es: ['el sueldo'], fr: ['le salaire'], pt: ['o salário'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v037', de: 'l’azienda', en: ['the company'], gloss: { de: ['die Firma'], es: ['la empresa'], fr: ['l’entreprise'], pt: ['a empresa'] }, pos: 'noun', gender: 'f', level: 'A2', category: 'work' },
  { id: 'it2v038', de: 'la ditta', en: ['the firm'], gloss: { de: ['der Betrieb'], es: ['la compañía'], fr: ['la société'], pt: ['a firma'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v039', de: 'il corso', en: ['the course'], gloss: { de: ['der Kurs'], es: ['el curso'], fr: ['le cours'], pt: ['o curso'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v040', de: 'l’esame', en: ['the exam'], gloss: { de: ['die Prüfung'], es: ['el examen'], fr: ['l’examen'], pt: ['o exame'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'work' },
  { id: 'it2v041', de: 'la lezione', en: ['the lesson', 'the class'], gloss: { de: ['die Unterrichtsstunde'], es: ['la clase'], fr: ['le cours'], pt: ['a aula'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v042', de: 'il computer', en: ['the computer'], gloss: { de: ['der Computer'], es: ['el ordenador'], fr: ['l’ordinateur'], pt: ['o computador'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'it2v043', de: 'studiare', en: ['to study'], gloss: { de: ['lernen'], es: ['estudiar'], fr: ['étudier'], pt: ['estudar'] }, pos: 'verb', level: 'A2', category: 'work' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'it2v044', de: 'il medico', en: ['the doctor'], gloss: { de: ['der Arzt'], es: ['el médico'], fr: ['le médecin'], pt: ['o médico'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v045', de: 'l’ospedale', en: ['the hospital'], gloss: { de: ['das Krankenhaus'], es: ['el hospital'], fr: ['l’hôpital'], pt: ['o hospital'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'health' },
  { id: 'it2v046', de: 'la farmacia', en: ['the pharmacy'], gloss: { de: ['die Apotheke'], es: ['la farmacia'], fr: ['la pharmacie'], pt: ['a farmácia'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v047', de: 'la medicina', en: ['the medicine'], gloss: { de: ['das Medikament'], es: ['la medicina'], fr: ['le médicament'], pt: ['o remédio'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v048', de: 'la febbre', en: ['the fever'], gloss: { de: ['das Fieber'], es: ['la fiebre'], fr: ['la fièvre'], pt: ['a febre'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v049', de: 'il raffreddore', en: ['the cold'], gloss: { de: ['die Erkältung'], es: ['el resfriado'], fr: ['le rhume'], pt: ['o resfriado'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v050', de: 'la testa', en: ['the head'], gloss: { de: ['der Kopf'], es: ['la cabeza'], fr: ['la tête'], pt: ['a cabeça'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v051', de: 'la mano', en: ['the hand'], gloss: { de: ['die Hand'], es: ['la mano'], fr: ['la main'], pt: ['a mão'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v052', de: 'la gamba', en: ['the leg'], gloss: { de: ['das Bein'], es: ['la pierna'], fr: ['la jambe'], pt: ['a perna'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v053', de: 'il braccio', en: ['the arm'], gloss: { de: ['der Arm'], es: ['el brazo'], fr: ['le bras'], pt: ['o braço'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v054', de: 'lo stomaco', en: ['the stomach'], gloss: { de: ['der Magen'], es: ['el estómago'], fr: ['l’estomac'], pt: ['o estômago'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'it2v055', de: 'la schiena', en: ['the back'], gloss: { de: ['der Rücken'], es: ['la espalda'], fr: ['le dos'], pt: ['as costas'] }, pos: 'noun', level: 'A2', category: 'health' },

  // ── feelings & opinions ───────────────────────────────────────────────
  { id: 'it2v056', de: 'felice', en: ['happy'], gloss: { de: ['glücklich'], es: ['feliz'], fr: ['heureux'], pt: ['feliz'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v057', de: 'triste', en: ['sad'], gloss: { de: ['traurig'], es: ['triste'], fr: ['triste'], pt: ['triste'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v058', de: 'arrabbiato', en: ['angry'], gloss: { de: ['wütend'], es: ['enfadado'], fr: ['en colère'], pt: ['bravo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v059', de: 'preoccupato', en: ['worried'], gloss: { de: ['besorgt'], es: ['preocupado'], fr: ['inquiet'], pt: ['preocupado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v060', de: 'contento', en: ['pleased', 'glad'], gloss: { de: ['zufrieden'], es: ['contento'], fr: ['content'], pt: ['contente'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v061', de: 'nervoso', en: ['nervous'], gloss: { de: ['nervös'], es: ['nervioso'], fr: ['nerveux'], pt: ['nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v062', de: 'annoiato', en: ['bored'], gloss: { de: ['gelangweilt'], es: ['aburrido'], fr: ['ennuyé'], pt: ['entediado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v063', de: 'sorpreso', en: ['surprised'], gloss: { de: ['überrascht'], es: ['sorprendido'], fr: ['surpris'], pt: ['surpreso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v064', de: 'tranquillo', en: ['calm'], gloss: { de: ['ruhig'], es: ['tranquilo'], fr: ['tranquille'], pt: ['tranquilo'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'it2v065', de: 'la paura', en: ['the fear'], gloss: { de: ['die Angst'], es: ['el miedo'], fr: ['la peur'], pt: ['o medo'] }, pos: 'noun', level: 'A2', category: 'feelings' },
  { id: 'it2v066', de: 'secondo me', en: ['in my opinion'], gloss: { de: ['meiner Meinung nach'], es: ['en mi opinión'], fr: ['à mon avis'], pt: ['na minha opinião'] }, pos: 'phrase', level: 'A2', category: 'feelings' },

  // ── house & furniture ─────────────────────────────────────────────────
  { id: 'it2v067', de: 'la camera', en: ['the room', 'the bedroom'], gloss: { de: ['das Zimmer'], es: ['la habitación'], fr: ['la chambre'], pt: ['o quarto'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v068', de: 'la cucina', en: ['the kitchen'], gloss: { de: ['die Küche'], es: ['la cocina'], fr: ['la cuisine'], pt: ['a cozinha'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v069', de: 'il letto', en: ['the bed'], gloss: { de: ['das Bett'], es: ['la cama'], fr: ['le lit'], pt: ['a cama'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v070', de: 'la sedia', en: ['the chair'], gloss: { de: ['der Stuhl'], es: ['la silla'], fr: ['la chaise'], pt: ['a cadeira'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v071', de: 'il tavolo', en: ['the table'], gloss: { de: ['der Tisch'], es: ['la mesa'], fr: ['la table'], pt: ['a mesa'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v072', de: 'l’armadio', en: ['the wardrobe'], gloss: { de: ['der Schrank'], es: ['el armario'], fr: ['l’armoire'], pt: ['o armário'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v073', de: 'la finestra', en: ['the window'], gloss: { de: ['das Fenster'], es: ['la ventana'], fr: ['la fenêtre'], pt: ['a janela'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v074', de: 'il divano', en: ['the sofa'], gloss: { de: ['das Sofa'], es: ['el sofá'], fr: ['le canapé'], pt: ['o sofá'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v075', de: 'la chiave', en: ['the key'], gloss: { de: ['der Schlüssel'], es: ['la llave'], fr: ['la clé'], pt: ['a chave'] }, pos: 'noun', level: 'A2', category: 'home' },
  { id: 'it2v076', de: 'l’appartamento', en: ['the flat', 'the apartment'], gloss: { de: ['die Wohnung'], es: ['el apartamento'], fr: ['l’appartement'], pt: ['o apartamento'] }, pos: 'noun', gender: 'm', level: 'A2', category: 'home' },
  { id: 'it2v077', de: 'la porta', en: ['the door'], gloss: { de: ['die Tür'], es: ['la puerta'], fr: ['la porte'], pt: ['a porta'] }, pos: 'noun', level: 'A2', category: 'home' },

  // ── food & eating out ─────────────────────────────────────────────────
  { id: 'it2v078', de: 'il pranzo', en: ['the lunch'], gloss: { de: ['das Mittagessen'], es: ['el almuerzo'], fr: ['le déjeuner'], pt: ['o almoço'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v079', de: 'la cena', en: ['the dinner'], gloss: { de: ['das Abendessen'], es: ['la cena'], fr: ['le dîner'], pt: ['o jantar'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v080', de: 'la verdura', en: ['the vegetables'], gloss: { de: ['das Gemüse'], es: ['la verdura'], fr: ['les légumes'], pt: ['a verdura'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v081', de: 'il riso', en: ['the rice'], gloss: { de: ['der Reis'], es: ['el arroz'], fr: ['le riz'], pt: ['o arroz'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v082', de: 'il dolce', en: ['the dessert', 'the sweet'], gloss: { de: ['der Nachtisch'], es: ['el postre'], fr: ['le dessert'], pt: ['a sobremesa'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v083', de: 'il sale', en: ['the salt'], gloss: { de: ['das Salz'], es: ['la sal'], fr: ['le sel'], pt: ['o sal'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v084', de: 'l’insalata', en: ['the salad'], gloss: { de: ['der Salat'], es: ['la ensalada'], fr: ['la salade'], pt: ['a salada'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v085', de: 'il bicchiere', en: ['the glass'], gloss: { de: ['das Glas'], es: ['el vaso'], fr: ['le verre'], pt: ['o copo'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v086', de: 'la forchetta', en: ['the fork'], gloss: { de: ['die Gabel'], es: ['el tenedor'], fr: ['la fourchette'], pt: ['o garfo'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v087', de: 'il coltello', en: ['the knife'], gloss: { de: ['das Messer'], es: ['el cuchillo'], fr: ['le couteau'], pt: ['a faca'] }, pos: 'noun', level: 'A2', category: 'food' },
  { id: 'it2v088', de: 'il cameriere', en: ['the waiter'], gloss: { de: ['der Kellner'], es: ['el camarero'], fr: ['le serveur'], pt: ['o garçom'] }, pos: 'noun', level: 'A2', category: 'food' },

  // ── weather ───────────────────────────────────────────────────────────
  { id: 'it2v089', de: 'il tempo', en: ['the weather'], gloss: { de: ['das Wetter'], es: ['el tiempo'], fr: ['le temps'], pt: ['o tempo'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v090', de: 'la pioggia', en: ['the rain'], gloss: { de: ['der Regen'], es: ['la lluvia'], fr: ['la pluie'], pt: ['a chuva'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v091', de: 'il sole', en: ['the sun'], gloss: { de: ['die Sonne'], es: ['el sol'], fr: ['le soleil'], pt: ['o sol'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v092', de: 'la neve', en: ['the snow'], gloss: { de: ['der Schnee'], es: ['la nieve'], fr: ['la neige'], pt: ['a neve'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v093', de: 'il vento', en: ['the wind'], gloss: { de: ['der Wind'], es: ['el viento'], fr: ['le vent'], pt: ['o vento'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v094', de: 'la nuvola', en: ['the cloud'], gloss: { de: ['die Wolke'], es: ['la nube'], fr: ['le nuage'], pt: ['a nuvem'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v095', de: 'il cielo', en: ['the sky'], gloss: { de: ['der Himmel'], es: ['el cielo'], fr: ['le ciel'], pt: ['o céu'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v096', de: 'l’ombrello', en: ['the umbrella'], gloss: { de: ['der Regenschirm'], es: ['el paraguas'], fr: ['le parapluie'], pt: ['o guarda-chuva'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'it2v097', de: 'piovere', en: ['to rain'], gloss: { de: ['regnen'], es: ['llover'], fr: ['pleuvoir'], pt: ['chover'] }, pos: 'verb', level: 'A2', category: 'weather' },
  { id: 'it2v098', de: 'nevicare', en: ['to snow'], gloss: { de: ['schneien'], es: ['nevar'], fr: ['neiger'], pt: ['nevar'] }, pos: 'verb', level: 'A2', category: 'weather' },

  // ── verbs ─────────────────────────────────────────────────────────────
  { id: 'it2v099', de: 'potere', en: ['to be able to', 'can'], gloss: { de: ['können'], es: ['poder'], fr: ['pouvoir'], pt: ['poder'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v100', de: 'dovere', en: ['to have to', 'must'], gloss: { de: ['müssen'], es: ['deber'], fr: ['devoir'], pt: ['dever'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v101', de: 'sapere', en: ['to know'], gloss: { de: ['wissen'], es: ['saber'], fr: ['savoir'], pt: ['saber'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v102', de: 'conoscere', en: ['to know', 'to be acquainted with'], gloss: { de: ['kennen'], es: ['conocer'], fr: ['connaître'], pt: ['conhecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v103', de: 'prendere', en: ['to take'], gloss: { de: ['nehmen'], es: ['tomar'], fr: ['prendre'], pt: ['pegar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v104', de: 'uscire', en: ['to go out'], gloss: { de: ['ausgehen'], es: ['salir'], fr: ['sortir'], pt: ['sair'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v105', de: 'tornare', en: ['to come back', 'to return'], gloss: { de: ['zurückkommen'], es: ['volver'], fr: ['revenir'], pt: ['voltar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v106', de: 'scrivere', en: ['to write'], gloss: { de: ['schreiben'], es: ['escribir'], fr: ['écrire'], pt: ['escrever'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v107', de: 'leggere', en: ['to read'], gloss: { de: ['lesen'], es: ['leer'], fr: ['lire'], pt: ['ler'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v108', de: 'dormire', en: ['to sleep'], gloss: { de: ['schlafen'], es: ['dormir'], fr: ['dormir'], pt: ['dormir'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v109', de: 'perdere', en: ['to lose', 'to miss'], gloss: { de: ['verlieren'], es: ['perder'], fr: ['perdre'], pt: ['perder'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v110', de: 'dimenticare', en: ['to forget'], gloss: { de: ['vergessen'], es: ['olvidar'], fr: ['oublier'], pt: ['esquecer'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v111', de: 'pagare', en: ['to pay'], gloss: { de: ['bezahlen'], es: ['pagar'], fr: ['payer'], pt: ['pagar'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── adjectives & comparison ───────────────────────────────────────────
  { id: 'it2v112', de: 'più', en: ['more'], gloss: { de: ['mehr'], es: ['más'], fr: ['plus'], pt: ['mais'] }, pos: 'adv', level: 'A2', category: 'adjectives' },
  { id: 'it2v113', de: 'meno', en: ['less'], gloss: { de: ['weniger'], es: ['menos'], fr: ['moins'], pt: ['menos'] }, pos: 'adv', level: 'A2', category: 'adjectives' },
  { id: 'it2v114', de: 'migliore', en: ['better'], gloss: { de: ['besser'], es: ['mejor'], fr: ['meilleur'], pt: ['melhor'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v115', de: 'peggiore', en: ['worse'], gloss: { de: ['schlechter'], es: ['peor'], fr: ['pire'], pt: ['pior'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v116', de: 'veloce', en: ['fast', 'quick'], gloss: { de: ['schnell'], es: ['rápido'], fr: ['rapide'], pt: ['rápido'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v117', de: 'lento', en: ['slow'], gloss: { de: ['langsam'], es: ['lento'], fr: ['lent'], pt: ['lento'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v118', de: 'pulito', en: ['clean'], gloss: { de: ['sauber'], es: ['limpio'], fr: ['propre'], pt: ['limpo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v119', de: 'sporco', en: ['dirty'], gloss: { de: ['schmutzig'], es: ['sucio'], fr: ['sale'], pt: ['sujo'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v120', de: 'pieno', en: ['full'], gloss: { de: ['voll'], es: ['lleno'], fr: ['plein'], pt: ['cheio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v121', de: 'vuoto', en: ['empty'], gloss: { de: ['leer'], es: ['vacío'], fr: ['vide'], pt: ['vazio'] }, pos: 'adj', level: 'A2', category: 'adjectives' },
  { id: 'it2v122', de: 'simpatico', en: ['nice', 'likeable'], gloss: { de: ['sympathisch'], es: ['simpático'], fr: ['sympathique'], pt: ['simpático'] }, pos: 'adj', level: 'A2', category: 'adjectives' },

  // ── the city & finding your way ───────────────────────────────────────
  { id: 'it2v123', de: 'la piazza', en: ['the square'], gloss: { de: ['der Platz'], es: ['la plaza'], fr: ['la place'], pt: ['a praça'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'it2v124', de: 'il ponte', en: ['the bridge'], gloss: { de: ['die Brücke'], es: ['el puente'], fr: ['le pont'], pt: ['a ponte'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'it2v125', de: 'il semaforo', en: ['the traffic light'], gloss: { de: ['die Ampel'], es: ['el semáforo'], fr: ['le feu'], pt: ['o semáforo'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'it2v126', de: 'la fermata', en: ['the stop'], gloss: { de: ['die Haltestelle'], es: ['la parada'], fr: ['l’arrêt'], pt: ['a parada'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'it2v127', de: 'il centro', en: ['the centre'], gloss: { de: ['das Zentrum'], es: ['el centro'], fr: ['le centre'], pt: ['o centro'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'it2v128', de: 'girare', en: ['to turn'], gloss: { de: ['abbiegen'], es: ['girar'], fr: ['tourner'], pt: ['virar'] }, pos: 'verb', level: 'A2', category: 'city' },
  { id: 'it2v129', de: 'attraversare', en: ['to cross'], gloss: { de: ['überqueren'], es: ['cruzar'], fr: ['traverser'], pt: ['atravessar'] }, pos: 'verb', level: 'A2', category: 'city' },
  { id: 'it2v130', de: 'a destra', en: ['on the right'], gloss: { de: ['rechts'], es: ['a la derecha'], fr: ['à droite'], pt: ['à direita'] }, pos: 'phrase', level: 'A2', category: 'city' },
  { id: 'it2v131', de: 'a sinistra', en: ['on the left'], gloss: { de: ['links'], es: ['a la izquierda'], fr: ['à gauche'], pt: ['à esquerda'] }, pos: 'phrase', level: 'A2', category: 'city' },
  { id: 'it2v132', de: 'dritto', en: ['straight ahead'], gloss: { de: ['geradeaus'], es: ['recto'], fr: ['tout droit'], pt: ['em frente'] }, pos: 'adv', level: 'A2', category: 'city' },

  // ── technology ────────────────────────────────────────────────────────
  { id: 'it2v133', de: 'il cellulare', en: ['the mobile phone'], gloss: { de: ['das Handy'], es: ['el móvil'], fr: ['le portable'], pt: ['o celular'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'it2v134', de: 'lo schermo', en: ['the screen'], gloss: { de: ['der Bildschirm'], es: ['la pantalla'], fr: ['l’écran'], pt: ['a tela'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'it2v135', de: 'la tastiera', en: ['the keyboard'], gloss: { de: ['die Tastatur'], es: ['el teclado'], fr: ['le clavier'], pt: ['o teclado'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'it2v136', de: 'il messaggio', en: ['the message'], gloss: { de: ['die Nachricht'], es: ['el mensaje'], fr: ['le message'], pt: ['a mensagem'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'it2v137', de: 'il sito', en: ['the website'], gloss: { de: ['die Website'], es: ['el sitio web'], fr: ['le site'], pt: ['o site'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'it2v138', de: 'scaricare', en: ['to download'], gloss: { de: ['herunterladen'], es: ['descargar'], fr: ['télécharger'], pt: ['baixar'] }, pos: 'verb', level: 'A2', category: 'technology' },
  { id: 'it2v139', de: 'accendere', en: ['to switch on'], gloss: { de: ['einschalten'], es: ['encender'], fr: ['allumer'], pt: ['ligar'] }, pos: 'verb', level: 'A2', category: 'technology' },
  { id: 'it2v140', de: 'spegnere', en: ['to switch off'], gloss: { de: ['ausschalten'], es: ['apagar'], fr: ['éteindre'], pt: ['desligar'] }, pos: 'verb', level: 'A2', category: 'technology' },

  // ── free time & sport ─────────────────────────────────────────────────
  { id: 'it2v141', de: 'il calcio', en: ['the football'], gloss: { de: ['der Fußball'], es: ['el fútbol'], fr: ['le football'], pt: ['o futebol'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'it2v142', de: 'la palestra', en: ['the gym'], gloss: { de: ['das Fitnessstudio'], es: ['el gimnasio'], fr: ['la salle de sport'], pt: ['a academia'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'it2v143', de: 'la partita', en: ['the match', 'the game'], gloss: { de: ['das Spiel'], es: ['el partido'], fr: ['le match'], pt: ['a partida'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'it2v144', de: 'il film', en: ['the film'], gloss: { de: ['der Film'], es: ['la película'], fr: ['le film'], pt: ['o filme'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'it2v145', de: 'la musica', en: ['the music'], gloss: { de: ['die Musik'], es: ['la música'], fr: ['la musique'], pt: ['a música'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'it2v146', de: 'giocare', en: ['to play'], gloss: { de: ['spielen'], es: ['jugar'], fr: ['jouer'], pt: ['jogar'] }, pos: 'verb', level: 'A2', category: 'leisure' },
  { id: 'it2v147', de: 'correre', en: ['to run'], gloss: { de: ['laufen'], es: ['correr'], fr: ['courir'], pt: ['correr'] }, pos: 'verb', level: 'A2', category: 'leisure' },
  { id: 'it2v148', de: 'nuotare', en: ['to swim'], gloss: { de: ['schwimmen'], es: ['nadar'], fr: ['nager'], pt: ['nadar'] }, pos: 'verb', level: 'A2', category: 'leisure' },
  { id: 'it2v149', de: 'ballare', en: ['to dance'], gloss: { de: ['tanzen'], es: ['bailar'], fr: ['danser'], pt: ['dançar'] }, pos: 'verb', level: 'A2', category: 'leisure' },

  // ── travel, practical ─────────────────────────────────────────────────
  { id: 'it2v150', de: 'la prenotazione', en: ['the booking', 'the reservation'], gloss: { de: ['die Buchung'], es: ['la reserva'], fr: ['la réservation'], pt: ['a reserva'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v151', de: 'il bagaglio', en: ['the luggage'], gloss: { de: ['das Gepäck'], es: ['el equipaje'], fr: ['les bagages'], pt: ['a bagagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v152', de: 'il ritardo', en: ['the delay'], gloss: { de: ['die Verspätung'], es: ['el retraso'], fr: ['le retard'], pt: ['o atraso'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v153', de: 'il binario', en: ['the platform', 'the track'], gloss: { de: ['das Gleis'], es: ['el andén'], fr: ['le quai'], pt: ['a plataforma'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v154', de: 'il parcheggio', en: ['the car park'], gloss: { de: ['der Parkplatz'], es: ['el aparcamiento'], fr: ['le parking'], pt: ['o estacionamento'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v155', de: 'la benzina', en: ['the petrol'], gloss: { de: ['das Benzin'], es: ['la gasolina'], fr: ['l’essence'], pt: ['a gasolina'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'it2v156', de: 'noleggiare', en: ['to rent', 'to hire'], gloss: { de: ['mieten'], es: ['alquilar'], fr: ['louer'], pt: ['alugar'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── describing people ─────────────────────────────────────────────────
  { id: 'it2v157', de: 'alto', en: ['tall', 'high'], gloss: { de: ['groß'], es: ['alto'], fr: ['grand'], pt: ['alto'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v158', de: 'basso', en: ['short', 'low'], gloss: { de: ['klein'], es: ['bajo'], fr: ['petit'], pt: ['baixo'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v159', de: 'magro', en: ['thin', 'slim'], gloss: { de: ['schlank'], es: ['delgado'], fr: ['mince'], pt: ['magro'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v160', de: 'giovane', en: ['young'], gloss: { de: ['jung'], es: ['joven'], fr: ['jeune'], pt: ['jovem'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v161', de: 'anziano', en: ['elderly'], gloss: { de: ['älter'], es: ['anciano'], fr: ['âgé'], pt: ['idoso'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v162', de: 'gentile', en: ['kind', 'polite'], gloss: { de: ['nett'], es: ['amable'], fr: ['gentil'], pt: ['gentil'] }, pos: 'adj', level: 'A2', category: 'people' },
  { id: 'it2v163', de: 'bravo', en: ['good', 'skilled'], gloss: { de: ['tüchtig'], es: ['bueno'], fr: ['doué'], pt: ['bom'] }, pos: 'adj', level: 'A2', category: 'people' },

  // ── quantity ──────────────────────────────────────────────────────────
  { id: 'it2v164', de: 'molto', en: ['a lot', 'very'], gloss: { de: ['viel'], es: ['mucho'], fr: ['beaucoup'], pt: ['muito'] }, pos: 'adv', level: 'A2', category: 'quantity' },
  { id: 'it2v165', de: 'poco', en: ['little', 'few'], gloss: { de: ['wenig'], es: ['poco'], fr: ['peu'], pt: ['pouco'] }, pos: 'adv', level: 'A2', category: 'quantity' },
  { id: 'it2v166', de: 'troppo', en: ['too much'], gloss: { de: ['zu viel'], es: ['demasiado'], fr: ['trop'], pt: ['demais'] }, pos: 'adv', level: 'A2', category: 'quantity' },
  { id: 'it2v167', de: 'abbastanza', en: ['enough', 'quite'], gloss: { de: ['genug'], es: ['bastante'], fr: ['assez'], pt: ['bastante'] }, pos: 'adv', level: 'A2', category: 'quantity' },
  { id: 'it2v168', de: 'qualche', en: ['some', 'a few'], gloss: { de: ['einige'], es: ['algunos'], fr: ['quelques'], pt: ['alguns'] }, pos: 'adj', level: 'A2', category: 'quantity' },
  { id: 'it2v169', de: 'tutto', en: ['all', 'everything'], gloss: { de: ['alles'], es: ['todo'], fr: ['tout'], pt: ['tudo'] }, pos: 'adj', level: 'A2', category: 'quantity' },
  { id: 'it2v170', de: 'niente', en: ['nothing'], gloss: { de: ['nichts'], es: ['nada'], fr: ['rien'], pt: ['nada'] }, pos: 'pronoun', level: 'A2', category: 'quantity' },

  // ── more verbs ────────────────────────────────────────────────────────
  { id: 'it2v171', de: 'aiutare', en: ['to help'], gloss: { de: ['helfen'], es: ['ayudar'], fr: ['aider'], pt: ['ajudar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v172', de: 'portare', en: ['to bring', 'to carry'], gloss: { de: ['bringen'], es: ['llevar'], fr: ['apporter'], pt: ['levar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v173', de: 'chiedere', en: ['to ask'], gloss: { de: ['fragen'], es: ['preguntar'], fr: ['demander'], pt: ['perguntar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v174', de: 'rispondere', en: ['to answer'], gloss: { de: ['antworten'], es: ['responder'], fr: ['répondre'], pt: ['responder'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v175', de: 'incontrare', en: ['to meet'], gloss: { de: ['treffen'], es: ['encontrar'], fr: ['rencontrer'], pt: ['encontrar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v176', de: 'aspettare', en: ['to wait'], gloss: { de: ['warten'], es: ['esperar'], fr: ['attendre'], pt: ['esperar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v177', de: 'spiegare', en: ['to explain'], gloss: { de: ['erklären'], es: ['explicar'], fr: ['expliquer'], pt: ['explicar'] }, pos: 'verb', level: 'A2', category: 'verbs' },
  { id: 'it2v178', de: 'provare', en: ['to try'], gloss: { de: ['versuchen'], es: ['probar'], fr: ['essayer'], pt: ['experimentar'] }, pos: 'verb', level: 'A2', category: 'verbs' },

  // ── time expressions ──────────────────────────────────────────────────
  { id: 'it2v179', de: 'scorso', en: ['last'], gloss: { de: ['letzter'], es: ['pasado'], fr: ['dernier'], pt: ['passado'] }, pos: 'adj', level: 'A2', category: 'time' },
  { id: 'it2v180', de: 'prossimo', en: ['next'], gloss: { de: ['nächster'], es: ['próximo'], fr: ['prochain'], pt: ['próximo'] }, pos: 'adj', level: 'A2', category: 'time' },
  { id: 'it2v181', de: 'fa', en: ['ago'], gloss: { de: ['vor'], es: ['hace'], fr: ['il y a'], pt: ['atrás'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'it2v182', de: 'ancora', en: ['still', 'yet'], gloss: { de: ['noch'], es: ['todavía'], fr: ['encore'], pt: ['ainda'] }, pos: 'adv', level: 'A2', category: 'time' },
];

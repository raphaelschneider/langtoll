import type { VocabItem } from './types';

// German A2 vocabulary. Everyday life beyond survival: routines, travel,
// health, weather, city, work, shopping, feelings. Categories stay chunky
// (8+ items) so the exercise generator always finds plausible distractors.

export const A2_VOCAB: VocabItem[] = [
  // ── daily routine (verbs) ─────────────────────────────────────────────
  { id: 'a2v001', de: 'aufstehen', en: ['to get up'], gloss: { es: ['levantarse'], fr: ['se lever'], it: ['alzarsi'], pt: ['levantar-se'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v002', de: 'aufwachen', en: ['to wake up'], gloss: { es: ['despertarse'], fr: ['se réveiller'], it: ['svegliarsi'], pt: ['acordar'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v003', de: 'sich anziehen', en: ['to get dressed'], gloss: { es: ['vestirse'], fr: ['s’habiller'], it: ['vestirsi'], pt: ['vestir-se'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v004', de: 'sich duschen', en: ['to shower'], gloss: { es: ['ducharse'], fr: ['se doucher'], it: ['farsi la doccia'], pt: ['tomar banho'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v005', de: 'frühstücken', en: ['to have breakfast'], gloss: { es: ['desayunar'], fr: ['prendre le petit-déjeuner'], it: ['fare colazione'], pt: ['tomar o café da manhã'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v006', de: 'einkaufen', en: ['to shop', 'to buy groceries'], gloss: { es: ['hacer la compra', 'comprar'], fr: ['faire les courses'], it: ['fare la spesa'], pt: ['fazer compras'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v007', de: 'aufräumen', en: ['to tidy up'], gloss: { es: ['ordenar', 'recoger'], fr: ['ranger'], it: ['mettere in ordine'], pt: ['arrumar'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v008', de: 'abwaschen', en: ['to do the dishes'], gloss: { es: ['fregar los platos'], fr: ['faire la vaisselle'], it: ['lavare i piatti'], pt: ['lavar a louça'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v009', de: 'einschlafen', en: ['to fall asleep'], gloss: { es: ['dormirse'], fr: ['s’endormir'], it: ['addormentarsi'], pt: ['adormecer'] }, pos: 'verb', level: 'A2', category: 'routine' },
  { id: 'a2v010', de: 'ausgehen', en: ['to go out'], gloss: { es: ['salir'], fr: ['sortir'], it: ['uscire'], pt: ['sair'] }, pos: 'verb', level: 'A2', category: 'routine' },

  // ── travel ────────────────────────────────────────────────────────────
  { id: 'a2v011', de: 'die Reise', en: ['the trip', 'the journey'], gloss: { es: ['el viaje'], fr: ['le voyage'], it: ['il viaggio'], pt: ['a viagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v012', de: 'der Flughafen', en: ['the airport'], gloss: { es: ['el aeropuerto'], fr: ['l’aéroport'], it: ['l’aeroporto'], pt: ['o aeroporto'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v013', de: 'der Bahnhof', en: ['the train station'], gloss: { es: ['la estación de tren'], fr: ['la gare'], it: ['la stazione'], pt: ['a estação de trem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v014', de: 'das Gleis', en: ['the platform', 'the track'], gloss: { es: ['el andén', 'la vía'], fr: ['le quai', 'la voie'], it: ['il binario'], pt: ['a plataforma', 'o trilho'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v015', de: 'die Verspätung', en: ['the delay'], gloss: { es: ['el retraso'], fr: ['le retard'], it: ['il ritardo'], pt: ['o atraso'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v016', de: 'der Koffer', en: ['the suitcase'], gloss: { es: ['la maleta'], fr: ['la valise'], it: ['la valigia'], pt: ['a mala'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v017', de: 'das Gepäck', en: ['the luggage'], gloss: { es: ['el equipaje'], fr: ['les bagages'], it: ['il bagaglio'], pt: ['a bagagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v018', de: 'die Fahrkarte', en: ['the ticket (transport)'], gloss: { es: ['el billete'], fr: ['le billet'], it: ['il biglietto'], pt: ['a passagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v019', de: 'umsteigen', en: ['to change (trains)'], gloss: { es: ['hacer transbordo'], fr: ['changer de train'], it: ['cambiare treno'], pt: ['trocar de trem'] }, pos: 'verb', level: 'A2', category: 'travel' },
  { id: 'a2v020', de: 'die Unterkunft', en: ['the accommodation'], gloss: { es: ['el alojamiento'], fr: ['l’hébergement'], it: ['l’alloggio'], pt: ['a hospedagem'] }, pos: 'noun', level: 'A2', category: 'travel' },
  { id: 'a2v021', de: 'buchen', en: ['to book'], gloss: { es: ['reservar'], fr: ['réserver'], it: ['prenotare'], pt: ['reservar'] }, pos: 'verb', level: 'A2', category: 'travel' },
  { id: 'a2v022', de: 'verpassen', en: ['to miss (a train)'], gloss: { es: ['perder (el tren)'], fr: ['rater (un train)'], it: ['perdere (il treno)'], pt: ['perder (o trem)'] }, pos: 'verb', level: 'A2', category: 'travel' },

  // ── health & body ─────────────────────────────────────────────────────
  { id: 'a2v023', de: 'der Kopf', en: ['the head'], gloss: { es: ['la cabeza'], fr: ['la tête'], it: ['la testa'], pt: ['a cabeça'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v024', de: 'der Bauch', en: ['the belly', 'the stomach'], gloss: { es: ['la barriga', 'el estómago'], fr: ['le ventre'], it: ['la pancia'], pt: ['a barriga'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v025', de: 'der Rücken', en: ['the back'], gloss: { es: ['la espalda'], fr: ['le dos'], it: ['la schiena'], pt: ['as costas'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v026', de: 'die Erkältung', en: ['the cold (illness)'], gloss: { es: ['el resfriado'], fr: ['le rhume'], it: ['il raffreddore'], pt: ['o resfriado'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v027', de: 'das Fieber', en: ['the fever'], gloss: { es: ['la fiebre'], fr: ['la fièvre'], it: ['la febbre'], pt: ['a febre'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v028', de: 'die Schmerzen', en: ['the pain'], gloss: { es: ['los dolores'], fr: ['les douleurs'], it: ['i dolori'], pt: ['as dores'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v029', de: 'der Termin', en: ['the appointment'], gloss: { es: ['la cita'], fr: ['le rendez-vous'], it: ['l’appuntamento'], pt: ['o compromisso'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v030', de: 'die Apotheke', en: ['the pharmacy'], gloss: { es: ['la farmacia'], fr: ['la pharmacie'], it: ['la farmacia'], pt: ['a farmácia'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v031', de: 'das Rezept', en: ['the prescription', 'the recipe'], gloss: { es: ['la receta'], fr: ['l’ordonnance', 'la recette'], it: ['la ricetta'], pt: ['a receita'] }, pos: 'noun', level: 'A2', category: 'health' },
  { id: 'a2v032', de: 'sich fühlen', en: ['to feel'], gloss: { es: ['sentirse'], fr: ['se sentir'], it: ['sentirsi'], pt: ['sentir-se'] }, pos: 'verb', level: 'A2', category: 'health' },
  { id: 'a2v033', de: 'wehtun', en: ['to hurt'], gloss: { es: ['doler'], fr: ['faire mal'], it: ['fare male'], pt: ['doer'] }, pos: 'verb', level: 'A2', category: 'health' },

  // ── weather & nature ──────────────────────────────────────────────────
  { id: 'a2v034', de: 'das Wetter', en: ['the weather'], gloss: { es: ['el tiempo'], fr: ['le temps'], it: ['il tempo'], pt: ['o tempo'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v035', de: 'der Regen', en: ['the rain'], gloss: { es: ['la lluvia'], fr: ['la pluie'], it: ['la pioggia'], pt: ['a chuva'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v036', de: 'der Schnee', en: ['the snow'], gloss: { es: ['la nieve'], fr: ['la neige'], it: ['la neve'], pt: ['a neve'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v037', de: 'die Wolke', en: ['the cloud'], gloss: { es: ['la nube'], fr: ['le nuage'], it: ['la nuvola'], pt: ['a nuvem'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v038', de: 'der Wind', en: ['the wind'], gloss: { es: ['el viento'], fr: ['le vent'], it: ['il vento'], pt: ['o vento'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v039', de: 'das Gewitter', en: ['the thunderstorm'], gloss: { es: ['la tormenta'], fr: ['l’orage'], it: ['il temporale'], pt: ['a tempestade'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v040', de: 'der Wald', en: ['the forest'], gloss: { es: ['el bosque'], fr: ['la forêt'], it: ['il bosco'], pt: ['a floresta'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v041', de: 'der See', en: ['the lake'], gloss: { es: ['el lago'], fr: ['le lac'], it: ['il lago'], pt: ['o lago'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v042', de: 'das Meer', en: ['the sea'], gloss: { es: ['el mar'], fr: ['la mer'], it: ['il mare'], pt: ['o mar'] }, pos: 'noun', level: 'A2', category: 'weather' },
  { id: 'a2v043', de: 'regnen', en: ['to rain'], gloss: { es: ['llover'], fr: ['pleuvoir'], it: ['piovere'], pt: ['chover'] }, pos: 'verb', level: 'A2', category: 'weather' },

  // ── city & directions ─────────────────────────────────────────────────
  { id: 'a2v044', de: 'die Kreuzung', en: ['the junction'], gloss: { es: ['el cruce'], fr: ['le carrefour'], it: ['l’incrocio'], pt: ['o cruzamento'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v045', de: 'die Ampel', en: ['the traffic light'], gloss: { es: ['el semáforo'], fr: ['le feu (tricolore)'], it: ['il semaforo'], pt: ['o semáforo'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v046', de: 'die Brücke', en: ['the bridge'], gloss: { es: ['el puente'], fr: ['le pont'], it: ['il ponte'], pt: ['a ponte'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v047', de: 'der Platz', en: ['the square', 'the place'], gloss: { es: ['la plaza'], fr: ['la place'], it: ['la piazza'], pt: ['a praça'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v048', de: 'die Ecke', en: ['the corner'], gloss: { es: ['la esquina'], fr: ['le coin'], it: ['l’angolo'], pt: ['a esquina'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v049', de: 'geradeaus', en: ['straight ahead'], gloss: { es: ['todo recto'], fr: ['tout droit'], it: ['dritto'], pt: ['em frente'] }, pos: 'adv', level: 'A2', category: 'city' },
  { id: 'a2v050', de: 'links abbiegen', en: ['to turn left'], gloss: { es: ['girar a la izquierda'], fr: ['tourner à gauche'], it: ['girare a sinistra'], pt: ['virar à esquerda'] }, pos: 'phrase', level: 'A2', category: 'city' },
  { id: 'a2v051', de: 'die Innenstadt', en: ['the city centre'], gloss: { es: ['el centro de la ciudad'], fr: ['le centre-ville'], it: ['il centro città'], pt: ['o centro da cidade'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v052', de: 'der Stadtplan', en: ['the city map'], gloss: { es: ['el plano de la ciudad'], fr: ['le plan de la ville'], it: ['la piantina della città'], pt: ['o mapa da cidade'] }, pos: 'noun', level: 'A2', category: 'city' },
  { id: 'a2v053', de: 'die Haltestelle', en: ['the (bus) stop'], gloss: { es: ['la parada'], fr: ['l’arrêt (de bus)'], it: ['la fermata'], pt: ['o ponto (de ônibus)'] }, pos: 'noun', level: 'A2', category: 'city' },

  // ── work & school ─────────────────────────────────────────────────────
  { id: 'a2v054', de: 'die Besprechung', en: ['the meeting'], gloss: { es: ['la reunión'], fr: ['la réunion'], it: ['la riunione'], pt: ['a reunião'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v055', de: 'der Kollege', en: ['the colleague (male)'], gloss: { es: ['el compañero de trabajo'], fr: ['le collègue'], it: ['il collega'], pt: ['o colega'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v056', de: 'die Aufgabe', en: ['the task'], gloss: { es: ['la tarea'], fr: ['la tâche'], it: ['il compito'], pt: ['a tarefa'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v057', de: 'die Pause', en: ['the break'], gloss: { es: ['la pausa', 'el descanso'], fr: ['la pause'], it: ['la pausa'], pt: ['a pausa'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v058', de: 'der Feierabend', en: ['the end of the workday'], gloss: { es: ['el fin de la jornada laboral'], fr: ['la fin de la journée de travail'], it: ['la fine della giornata lavorativa'], pt: ['o fim do expediente'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v059', de: 'die Prüfung', en: ['the exam'], gloss: { es: ['el examen'], fr: ['l’examen'], it: ['l’esame'], pt: ['a prova'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v060', de: 'das Gehalt', en: ['the salary'], gloss: { es: ['el sueldo'], fr: ['le salaire'], it: ['lo stipendio'], pt: ['o salário'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v061', de: 'kündigen', en: ['to quit', 'to give notice'], gloss: { es: ['dimitir', 'renunciar'], fr: ['démissionner'], it: ['licenziarsi'], pt: ['pedir demissão'] }, pos: 'verb', level: 'A2', category: 'work' },
  { id: 'a2v062', de: 'verdienen', en: ['to earn'], gloss: { es: ['ganar'], fr: ['gagner'], it: ['guadagnare'], pt: ['ganhar'] }, pos: 'verb', level: 'A2', category: 'work' },
  { id: 'a2v063', de: 'sich bewerben', en: ['to apply (for a job)'], gloss: { es: ['solicitar un empleo'], fr: ['postuler'], it: ['candidarsi'], pt: ['se candidatar'] }, pos: 'verb', level: 'A2', category: 'work' },

  // ── shopping & clothes ────────────────────────────────────────────────
  { id: 'a2v064', de: 'das Geschäft', en: ['the shop', 'the shop'], gloss: { es: ['la tienda'], fr: ['le magasin'], it: ['il negozio'], pt: ['a loja'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v065', de: 'der Kunde', en: ['the customer'], gloss: { es: ['el cliente'], fr: ['le client'], it: ['il cliente'], pt: ['o cliente'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v066', de: 'das Angebot', en: ['the offer', 'the deal'], gloss: { es: ['la oferta'], fr: ['l’offre'], it: ['l’offerta'], pt: ['a oferta'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v067', de: 'die Größe', en: ['the size'], gloss: { es: ['la talla'], fr: ['la taille'], it: ['la taglia'], pt: ['o tamanho'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v068', de: 'anprobieren', en: ['to try on'], gloss: { es: ['probarse'], fr: ['essayer'], it: ['provare'], pt: ['experimentar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'a2v069', de: 'umtauschen', en: ['to exchange (goods)'], gloss: { es: ['cambiar'], fr: ['échanger'], it: ['cambiare'], pt: ['trocar'] }, pos: 'verb', level: 'A2', category: 'shopping' },
  { id: 'a2v070', de: 'die Jacke', en: ['the jacket'], gloss: { es: ['la chaqueta'], fr: ['la veste'], it: ['la giacca'], pt: ['a jaqueta'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v071', de: 'der Mantel', en: ['the coat'], gloss: { es: ['el abrigo'], fr: ['le manteau'], it: ['il cappotto'], pt: ['o casaco'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v072', de: 'die Hose', en: ['the trousers'], gloss: { es: ['los pantalones'], fr: ['le pantalon'], it: ['i pantaloni'], pt: ['a calça'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v073', de: 'das Hemd', en: ['the shirt'], gloss: { es: ['la camisa'], fr: ['la chemise'], it: ['la camicia'], pt: ['a camisa'] }, pos: 'noun', level: 'A2', category: 'shopping' },
  { id: 'a2v074', de: 'die Kasse', en: ['the checkout', 'the till'], gloss: { es: ['la caja'], fr: ['la caisse'], it: ['la cassa'], pt: ['o caixa'] }, pos: 'noun', level: 'A2', category: 'shopping' },

  // ── feelings & adjectives ─────────────────────────────────────────────
  { id: 'a2v075', de: 'zufrieden', en: ['satisfied', 'content'], gloss: { es: ['satisfecho', 'contento'], fr: ['satisfait', 'content'], it: ['soddisfatto', 'contento'], pt: ['satisfeito', 'contente'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v076', de: 'aufgeregt', en: ['excited', 'nervous'], gloss: { es: ['emocionado', 'nervioso'], fr: ['enthousiaste', 'impatient'], it: ['emozionato', 'agitato'], pt: ['animado', 'nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v077', de: 'enttäuscht', en: ['disappointed'], gloss: { es: ['decepcionado'], fr: ['déçu'], it: ['deluso'], pt: ['decepcionado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v078', de: 'überrascht', en: ['surprised'], gloss: { es: ['sorprendido'], fr: ['surpris'], it: ['sorpreso'], pt: ['surpreso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v079', de: 'stolz', en: ['proud'], gloss: { es: ['orgulloso'], fr: ['fier'], it: ['orgoglioso'], pt: ['orgulhoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v080', de: 'eifersüchtig', en: ['jealous'], gloss: { es: ['celoso'], fr: ['jaloux'], it: ['geloso'], pt: ['ciumento'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v081', de: 'gelangweilt', en: ['bored'], gloss: { es: ['aburrido'], fr: ['ennuyé'], it: ['annoiato'], pt: ['entediado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v082', de: 'besorgt', en: ['worried'], gloss: { es: ['preocupado'], fr: ['inquiet'], it: ['preoccupato'], pt: ['preocupado'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v083', de: 'erschöpft', en: ['exhausted'], gloss: { es: ['agotado'], fr: ['épuisé'], it: ['esausto'], pt: ['exausto'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v084', de: 'sich freuen auf', en: ['to look forward to'], gloss: { es: ['tener ganas de'], fr: ['avoir hâte de'], it: ['non vedere l’ora di'], pt: ['estar ansioso por'] }, pos: 'phrase', level: 'A2', category: 'feelings' },

  // ── time & frequency ──────────────────────────────────────────────────
  { id: 'a2v085', de: 'gestern', en: ['yesterday'], gloss: { es: ['ayer'], fr: ['hier'], it: ['ieri'], pt: ['ontem'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v086', de: 'vorgestern', en: ['the day before yesterday'], gloss: { es: ['anteayer'], fr: ['avant-hier'], it: ['l’altro ieri'], pt: ['anteontem'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v087', de: 'übermorgen', en: ['the day after tomorrow'], gloss: { es: ['pasado mañana'], fr: ['après-demain'], it: ['dopodomani'], pt: ['depois de amanhã'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v088', de: 'meistens', en: ['mostly', 'usually'], gloss: { es: ['normalmente', 'la mayoría de las veces'], fr: ['la plupart du temps'], it: ['di solito'], pt: ['geralmente'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v089', de: 'selten', en: ['rarely', 'seldom'], gloss: { es: ['pocas veces', 'raramente'], fr: ['rarement'], it: ['raramente'], pt: ['raramente'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v090', de: 'nie', en: ['never'], gloss: { es: ['nunca'], fr: ['jamais'], it: ['mai'], pt: ['nunca'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v091', de: 'schon', en: ['already'], gloss: { es: ['ya'], fr: ['déjà'], it: ['già'], pt: ['já'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v092', de: 'noch nicht', en: ['not yet'], gloss: { es: ['todavía no'], fr: ['pas encore'], it: ['non ancora'], pt: ['ainda não'] }, pos: 'phrase', level: 'A2', category: 'time' },
  { id: 'a2v093', de: 'sofort', en: ['immediately', 'right away'], gloss: { es: ['inmediatamente', 'enseguida'], fr: ['tout de suite'], it: ['subito'], pt: ['imediatamente'] }, pos: 'adv', level: 'A2', category: 'time' },
  { id: 'a2v094', de: 'plötzlich', en: ['suddenly'], gloss: { es: ['de repente'], fr: ['soudain'], it: ['improvvisamente'], pt: ['de repente'] }, pos: 'adv', level: 'A2', category: 'time' },

  // ── household ─────────────────────────────────────────────────────────
  { id: 'a2v095', de: 'die Wohnung', en: ['the flat', 'the flat'], gloss: { es: ['el piso'], fr: ['l’appartement'], it: ['l’appartamento'], pt: ['o apartamento'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v096', de: 'die Miete', en: ['the rent'], gloss: { es: ['el alquiler'], fr: ['le loyer'], it: ['l’affitto'], pt: ['o aluguel'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v097', de: 'der Nachbar', en: ['the neighbour'], gloss: { es: ['el vecino'], fr: ['le voisin'], it: ['il vicino'], pt: ['o vizinho'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v098', de: 'der Schlüssel', en: ['the key'], gloss: { es: ['la llave'], fr: ['la clé'], it: ['la chiave'], pt: ['a chave'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v099', de: 'die Waschmaschine', en: ['the washing machine'], gloss: { es: ['la lavadora'], fr: ['la machine à laver'], it: ['la lavatrice'], pt: ['a máquina de lavar'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v100', de: 'der Kühlschrank', en: ['the fridge'], gloss: { es: ['la nevera'], fr: ['le réfrigérateur'], it: ['il frigorifero'], pt: ['a geladeira'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v101', de: 'der Herd', en: ['the cooker'], gloss: { es: ['la cocina (aparato)'], fr: ['la cuisinière'], it: ['il fornello'], pt: ['o fogão'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v102', de: 'die Heizung', en: ['the heating'], gloss: { es: ['la calefacción'], fr: ['le chauffage'], it: ['il riscaldamento'], pt: ['o aquecimento'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v103', de: 'umziehen', en: ['to move (house)'], gloss: { es: ['mudarse'], fr: ['déménager'], it: ['traslocare'], pt: ['mudar-se'] }, pos: 'verb', level: 'A2', category: 'household' },
  { id: 'a2v104', de: 'mieten', en: ['to rent'], gloss: { es: ['alquilar'], fr: ['louer'], it: ['affittare'], pt: ['alugar'] }, pos: 'verb', level: 'A2', category: 'household' },

  // ── eating out & cooking ──────────────────────────────────────────────
  { id: 'a2v105', de: 'das Mittagessen', en: ['the lunch'], gloss: { es: ['el almuerzo', 'la comida'], fr: ['le déjeuner'], it: ['il pranzo'], pt: ['o almoço'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v106', de: 'das Abendessen', en: ['the dinner'], gloss: { es: ['la cena'], fr: ['le dîner'], it: ['la cena'], pt: ['o jantar'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v107', de: 'die Speisekarte', en: ['the menu'], gloss: { es: ['la carta'], fr: ['la carte'], it: ['il menù'], pt: ['o cardápio'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v108', de: 'die Vorspeise', en: ['the starter'], gloss: { es: ['el entrante'], fr: ['l’entrée'], it: ['l’antipasto'], pt: ['a entrada'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v109', de: 'die Nachspeise', en: ['the dessert'], gloss: { es: ['el postre'], fr: ['le dessert'], it: ['il dolce'], pt: ['a sobremesa'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v110', de: 'bestellen', en: ['to order'], gloss: { es: ['pedir'], fr: ['commander'], it: ['ordinare'], pt: ['pedir'] }, pos: 'verb', level: 'A2', category: 'eating' },
  { id: 'a2v111', de: 'das Trinkgeld', en: ['the tip'], gloss: { es: ['la propina'], fr: ['le pourboire'], it: ['la mancia'], pt: ['a gorjeta'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v112', de: 'die Rechnung', en: ['the bill'], gloss: { es: ['la cuenta'], fr: ['l’addition'], it: ['il conto'], pt: ['a conta'] }, pos: 'noun', level: 'A2', category: 'eating' },
  { id: 'a2v113', de: 'backen', en: ['to bake'], gloss: { es: ['hornear'], fr: ['cuire au four'], it: ['cuocere al forno'], pt: ['assar'] }, pos: 'verb', level: 'A2', category: 'eating' },
  { id: 'a2v114', de: 'braten', en: ['to fry', 'to roast'], gloss: { es: ['freír', 'asar'], fr: ['faire revenir', 'rôtir'], it: ['friggere', 'arrostire'], pt: ['fritar', 'assar'] }, pos: 'verb', level: 'A2', category: 'eating' },

  // ── money & paperwork ─────────────────────────────────────────────────
  { id: 'a2v115', de: 'das Bargeld', en: ['the cash'], gloss: { es: ['el efectivo'], fr: ['les espèces'], it: ['i contanti'], pt: ['o dinheiro em espécie'] }, pos: 'noun', level: 'A2', category: 'money' },
  { id: 'a2v116', de: 'die Quittung', en: ['the receipt'], gloss: { es: ['el recibo'], fr: ['le reçu'], it: ['la ricevuta'], pt: ['o recibo'] }, pos: 'noun', level: 'A2', category: 'money' },
  { id: 'a2v117', de: 'das Konto', en: ['the bank account'], gloss: { es: ['la cuenta bancaria'], fr: ['le compte bancaire'], it: ['il conto bancario'], pt: ['a conta bancária'] }, pos: 'noun', level: 'A2', category: 'money' },
  { id: 'a2v118', de: 'überweisen', en: ['to transfer (money)'], gloss: { es: ['transferir'], fr: ['virer'], it: ['fare un bonifico'], pt: ['transferir'] }, pos: 'verb', level: 'A2', category: 'money' },
  { id: 'a2v119', de: 'sparen', en: ['to save (money)'], gloss: { es: ['ahorrar'], fr: ['économiser'], it: ['risparmiare'], pt: ['economizar'] }, pos: 'verb', level: 'A2', category: 'money' },
  { id: 'a2v120', de: 'das Formular', en: ['the form'], gloss: { es: ['el formulario'], fr: ['le formulaire'], it: ['il modulo'], pt: ['o formulário'] }, pos: 'noun', level: 'A2', category: 'money' },
  { id: 'a2v121', de: 'unterschreiben', en: ['to sign'], gloss: { es: ['firmar'], fr: ['signer'], it: ['firmare'], pt: ['assinar'] }, pos: 'verb', level: 'A2', category: 'money' },
  { id: 'a2v122', de: 'die Gebühr', en: ['the fee'], gloss: { es: ['la tasa'], fr: ['les frais'], it: ['la tassa'], pt: ['a taxa'] }, pos: 'noun', level: 'A2', category: 'money' },

  // ── technology ────────────────────────────────────────────────────────
  { id: 'a2v123', de: 'das Internet', en: ['the internet'], gloss: { es: ['internet'], fr: ['internet'], it: ['internet'], pt: ['a internet'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'a2v124', de: 'die E-Mail', en: ['the email'], gloss: { es: ['el correo electrónico'], fr: ['l’e-mail'], it: ['l’email'], pt: ['o e-mail'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'a2v125', de: 'der Bildschirm', en: ['the screen'], gloss: { es: ['la pantalla'], fr: ['l’écran'], it: ['lo schermo'], pt: ['a tela'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'a2v126', de: 'das Passwort', en: ['the password'], gloss: { es: ['la contraseña'], fr: ['le mot de passe'], it: ['la password'], pt: ['a senha'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'a2v127', de: 'die Datei', en: ['the file'], gloss: { es: ['el archivo'], fr: ['le fichier'], it: ['il file'], pt: ['o arquivo'] }, pos: 'noun', level: 'A2', category: 'technology' },
  { id: 'a2v128', de: 'herunterladen', en: ['to download'], gloss: { es: ['descargar'], fr: ['télécharger'], it: ['scaricare'], pt: ['baixar'] }, pos: 'verb', level: 'A2', category: 'technology' },
  { id: 'a2v129', de: 'speichern', en: ['to save (a file)'], gloss: { es: ['guardar'], fr: ['enregistrer'], it: ['salvare'], pt: ['salvar'] }, pos: 'verb', level: 'A2', category: 'technology' },
  { id: 'a2v130', de: 'ausschalten', en: ['to switch off'], gloss: { es: ['apagar'], fr: ['éteindre'], it: ['spegnere'], pt: ['desligar'] }, pos: 'verb', level: 'A2', category: 'technology' },

  // ── free time & sport ─────────────────────────────────────────────────
  { id: 'a2v131', de: 'das Hobby', en: ['the hobby'], gloss: { es: ['el pasatiempo'], fr: ['le loisir'], it: ['l’hobby'], pt: ['o passatempo'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v132', de: 'der Verein', en: ['the club', 'the association'], gloss: { es: ['el club', 'la asociación'], fr: ['le club', 'l’association'], it: ['il club', 'l’associazione'], pt: ['o clube', 'a associação'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v133', de: 'die Mannschaft', en: ['the team'], gloss: { es: ['el equipo'], fr: ['l’équipe'], it: ['la squadra'], pt: ['o time'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v134', de: 'das Schwimmbad', en: ['the swimming pool'], gloss: { es: ['la piscina'], fr: ['la piscine'], it: ['la piscina'], pt: ['a piscina'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v135', de: 'das Fahrrad', en: ['the bicycle'], gloss: { es: ['la bicicleta'], fr: ['le vélo'], it: ['la bicicletta'], pt: ['a bicicleta'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v136', de: 'das Konzert', en: ['the concert'], gloss: { es: ['el concierto'], fr: ['le concert'], it: ['il concerto'], pt: ['o show'] }, pos: 'noun', level: 'A2', category: 'leisure' },
  { id: 'a2v137', de: 'wandern', en: ['to hike'], gloss: { es: ['hacer senderismo'], fr: ['faire de la randonnée'], it: ['fare escursioni'], pt: ['fazer trilha'] }, pos: 'verb', level: 'A2', category: 'leisure' },
  { id: 'a2v138', de: 'trainieren', en: ['to train', 'to work out'], gloss: { es: ['entrenar'], fr: ['s’entraîner'], it: ['allenarsi'], pt: ['treinar'] }, pos: 'verb', level: 'A2', category: 'leisure' },

  // ── car & road ────────────────────────────────────────────────────────
  { id: 'a2v139', de: 'das Benzin', en: ['the petrol'], gloss: { es: ['la gasolina'], fr: ['l’essence'], it: ['la benzina'], pt: ['a gasolina'] }, pos: 'noun', level: 'A2', category: 'road' },
  { id: 'a2v140', de: 'die Tankstelle', en: ['the petrol station'], gloss: { es: ['la gasolinera'], fr: ['la station-service'], it: ['il distributore'], pt: ['o posto de gasolina'] }, pos: 'noun', level: 'A2', category: 'road' },
  { id: 'a2v141', de: 'der Führerschein', en: ['the driving licence'], gloss: { es: ['el carné de conducir'], fr: ['le permis de conduire'], it: ['la patente'], pt: ['a carteira de motorista'] }, pos: 'noun', level: 'A2', category: 'road' },
  { id: 'a2v142', de: 'die Autobahn', en: ['the motorway'], gloss: { es: ['la autopista'], fr: ['l’autoroute'], it: ['l’autostrada'], pt: ['a rodovia'] }, pos: 'noun', level: 'A2', category: 'road' },
  { id: 'a2v143', de: 'die Panne', en: ['the breakdown (car)'], gloss: { es: ['la avería'], fr: ['la panne'], it: ['il guasto'], pt: ['a pane'] }, pos: 'noun', level: 'A2', category: 'road' },
  { id: 'a2v144', de: 'parken', en: ['to park'], gloss: { es: ['aparcar'], fr: ['se garer'], it: ['parcheggiare'], pt: ['estacionar'] }, pos: 'verb', level: 'A2', category: 'road' },

  // ── more work ─────────────────────────────────────────────────────────
  { id: 'a2v145', de: 'der Chef', en: ['the boss'], gloss: { es: ['el jefe'], fr: ['le patron'], it: ['il capo'], pt: ['o chefe'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v146', de: 'der Vertrag', en: ['the contract'], gloss: { es: ['el contrato'], fr: ['le contrat'], it: ['il contratto'], pt: ['o contrato'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v147', de: 'die Überstunden', en: ['the overtime'], gloss: { es: ['las horas extras'], fr: ['les heures supplémentaires'], it: ['gli straordinari'], pt: ['as horas extras'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v148', de: 'die Bewerbung', en: ['the job application'], gloss: { es: ['la solicitud de empleo'], fr: ['la candidature'], it: ['la candidatura'], pt: ['a candidatura'] }, pos: 'noun', level: 'A2', category: 'work' },
  { id: 'a2v149', de: 'das Praktikum', en: ['the internship'], gloss: { es: ['las prácticas'], fr: ['le stage'], it: ['il tirocinio'], pt: ['o estágio'] }, pos: 'noun', level: 'A2', category: 'work' },

  // ── more feelings & character ─────────────────────────────────────────
  { id: 'a2v150', de: 'nervös', en: ['nervous'], gloss: { es: ['nervioso'], fr: ['nerveux'], it: ['nervoso'], pt: ['nervoso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v151', de: 'neugierig', en: ['curious'], gloss: { es: ['curioso'], fr: ['curieux'], it: ['curioso'], pt: ['curioso'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v152', de: 'ehrlich', en: ['honest'], gloss: { es: ['honesto', 'sincero'], fr: ['honnête'], it: ['onesto', 'sincero'], pt: ['honesto', 'sincero'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v153', de: 'freundlich', en: ['friendly', 'kind'], gloss: { es: ['amable'], fr: ['gentil', 'aimable'], it: ['gentile'], pt: ['simpático', 'gentil'] }, pos: 'adj', level: 'A2', category: 'feelings' },
  { id: 'a2v154', de: 'höflich', en: ['polite'], gloss: { es: ['educado', 'cortés'], fr: ['poli'], it: ['educato', 'cortese'], pt: ['educado', 'cortês'] }, pos: 'adj', level: 'A2', category: 'feelings' },

  // ── more household ────────────────────────────────────────────────────
  { id: 'a2v155', de: 'putzen', en: ['to clean'], gloss: { es: ['limpiar'], fr: ['nettoyer'], it: ['pulire'], pt: ['limpar'] }, pos: 'verb', level: 'A2', category: 'household' },
  { id: 'a2v156', de: 'die Wäsche', en: ['the laundry'], gloss: { es: ['la colada'], fr: ['le linge'], it: ['il bucato'], pt: ['a roupa para lavar'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v157', de: 'der Staubsauger', en: ['the vacuum cleaner'], gloss: { es: ['la aspiradora'], fr: ['l’aspirateur'], it: ['l’aspirapolvere'], pt: ['o aspirador de pó'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v158', de: 'der Balkon', en: ['the balcony'], gloss: { es: ['el balcón'], fr: ['le balcon'], it: ['il balcone'], pt: ['a varanda'] }, pos: 'noun', level: 'A2', category: 'household' },
  { id: 'a2v159', de: 'der Keller', en: ['the cellar', 'the basement'], gloss: { es: ['el sótano'], fr: ['la cave'], it: ['la cantina'], pt: ['o porão'] }, pos: 'noun', level: 'A2', category: 'household' },

  // ── study & culture ───────────────────────────────────────────────────
  { id: 'a2v160', de: 'die Bibliothek', en: ['the library'], gloss: { es: ['la biblioteca'], fr: ['la bibliothèque'], it: ['la biblioteca'], pt: ['a biblioteca'] }, pos: 'noun', level: 'A2', category: 'study' },
  { id: 'a2v161', de: 'das Museum', en: ['the museum'], gloss: { es: ['el museo'], fr: ['le musée'], it: ['il museo'], pt: ['o museu'] }, pos: 'noun', level: 'A2', category: 'study' },
  { id: 'a2v162', de: 'die Universität', en: ['the university'], gloss: { es: ['la universidad'], fr: ['l’université'], it: ['l’università'], pt: ['a universidade'] }, pos: 'noun', level: 'A2', category: 'study' },
  { id: 'a2v163', de: 'der Kurs', en: ['the course'], gloss: { es: ['el curso'], fr: ['le cours'], it: ['il corso'], pt: ['o curso'] }, pos: 'noun', level: 'A2', category: 'study' },
  { id: 'a2v164', de: 'das Wörterbuch', en: ['the dictionary'], gloss: { es: ['el diccionario'], fr: ['le dictionnaire'], it: ['il dizionario'], pt: ['o dicionário'] }, pos: 'noun', level: 'A2', category: 'study' },
];

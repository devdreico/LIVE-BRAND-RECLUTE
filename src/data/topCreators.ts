export interface TopCreator {
  name: string
  handle: string
  followers: string
  category: string
}

/**
 * Cifras públicas de seguidores consultadas en 2026 (Tokfluence, Scrumball,
 * La República, Favikon). Se muestran como referentes del ecosistema
 * colombiano de TikTok, no como clientes de Live Brand.
 */
export const topCreators: TopCreator[] = [
  { name: 'Carlos Feria', handle: 'carlosferiag', followers: '47.2M', category: 'Humor' },
  { name: 'La Granja del Borrego', handle: 'lagranjadelborrego', followers: '36.1M', category: 'Familiar' },
  { name: 'Alejandro Nieto', handle: 'soybans', followers: '34.5M', category: 'Comedia' },
  { name: 'Jeison Giraldo', handle: 'jeison_giraldo', followers: '30.9M', category: 'Humor' },
  { name: 'Adri Latina', handle: 'adrilatinatv', followers: '30.1M', category: 'Entretenimiento' },
  { name: 'JuanDa', handle: 'juandamc', followers: '28.9M', category: 'Comedia' },
  { name: 'Karen Torres', handle: 'xkarentorresx', followers: '26.7M', category: 'Lifestyle' },
  { name: 'Gemelas Abello', handle: 'gemelasabello2', followers: '25.9M', category: 'Lifestyle' },
  { name: 'Deiry Vargas', handle: 'deiryvargas', followers: '22.5M', category: 'Humor' },
  { name: 'Daniela Giraldo', handle: 'daniela_giraldo1', followers: '22.1M', category: 'Lifestyle' },
  { name: 'Yeferson Cossio', handle: 'yefersoncossio', followers: '19.9M', category: 'Comedia' },
  { name: 'LERMITA', handle: 'la_lerma', followers: '16.5M', category: 'Humor · Bogotá' },
  { name: 'Lina Tejeiro', handle: 'linatejeiro8', followers: '5.9M', category: 'Lifestyle' },
  { name: 'Julián Pinilla', handle: 'julianpinilla', followers: '5.9M', category: 'Humor · Bogotá' },
  { name: 'Andrea Valdiri', handle: 'andreavaldirisos1', followers: '4.5M', category: 'Lifestyle' },
]

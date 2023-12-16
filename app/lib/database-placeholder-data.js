// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const teachers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/teachers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/teachers/lee-robinson.png',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Hector Simpson',
    email: 'hector@simpson.com',
    image_url: '/teachers/hector-simpson.png',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Steven Tey',
    email: 'steven@tey.com',
    image_url: '/teachers/steven-tey.png',
  },
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    name: 'Steph Dietz',
    email: 'steph@dietz.com',
    image_url: '/teachers/steph-dietz.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/teachers/michael-novotny.png',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/teachers/evil-rabbit.png',
  },
  {
    id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
    name: 'Emil Kowalski',
    email: 'emil@kowalski.com',
    image_url: '/teachers/emil-kowalski.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/teachers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/teachers/balazs-orban.png',
  },
];

const dictations = [
  {
    teacher_id: teachers[0].id,
    title: `Dawn's Serenity`,
    content: `The first light of dawn casts a serene glow over the sleepy town. Streets, still damp with the night's dew, glisten under the awakening sun. Birds start their melodious chatter, welcoming the day. The world, in these precious moments, seems at peace, untouched by the hustle of daily life.`,
    date: '2023-05-21',
    status: 'published',
    words_count: 51
  },
  {
    teacher_id: teachers[1].id,
    title: `Shadows of the Forest`,
    content: `Deep in the heart of the forest, where light filters through the dense canopy, ancient trees stand tall, their roots entwined with the earth's secrets. The air is thick with the scent of moss and damp earth, and every step is cushioned by layers of fallen leaves. In this secluded haven, time moves to the rhythm of nature's whispers.`,
    date: '2023-06-10',
    status: 'draft',
    words_count: 58,
  },
  {
    teacher_id: teachers[2].id,
    title: `Twilight Whispers`,
    content: `As twilight descends, the horizon is painted with strokes of pink and orange, casting a spellbinding hue over the city's skyline. Streets, once teeming with the day's hustle, now surrender to the tranquil embrace of the evening. Windows light up, one by one, mirroring the stars emerging in the dusky sky. The air, filled with the fragrance of blooming nightflowers, carries the whispers of the night. These whispers speak of rest and dreams, of stars and silent wishes. Shadows stretch across the pavements, dancing to the rhythm of the gentle night breeze. In the quiet corners of the city, cats prowl and owls watch, guardians of the nocturnal world. The world, beneath the twilight sky, is a canvas of peace and mystery, inviting souls to pause and embrace the beauty of the transitioning time.`,
    date: '2023-07-07',
    status: 'published',
    words_count: 134,
  },
  {
    teacher_id: teachers[6].id,
    title: `Reflections on a Rainy Day`,
    content: `Raindrops patter against the window, each tracing its own path on the glass. Outside, the world is a blur of greys and greens, a living watercolor. Inside, the rain's symphony is soothing, a backdrop to moments of reflection. The sound evokes memories, thoughts wandering back to days filled with laughter and whispers of love. The rain, unrelenting in its melody, creates a cocoon of serenity, a reminder of nature's gentle rhythms and life's simple joys.`,
    date: '2023-08-22',
    status: 'published',
    words_count: 75,
  },
  {
    teacher_id: teachers[1].id,
    title: `The Dance of the Fireflies`,
    content: `On warm summer evenings, when the sky wears a cloak of twilight, the meadows transform into a stage for the dance of fireflies. These tiny luminous beings flicker and swirl in the darkness, orchestrating a ballet of light. Each flash is a moment of brilliance, a silent tale of nature's mystery and wonder. This spectacle, a timeless performance, captivates the hearts of those who watch, reminding them of the enchanting stories woven in the tapestry of the night. The air, warm and fragrant with the scent of summer blooms, enhances the magic. The fireflies, in their fleeting luminescence, speak of life's transient beauty, urging us to cherish each glowing moment.`,
    date: '2023-09-05',
    status: 'draft',
    words_count: 110,
  },
  {
    teacher_id: teachers[4].id,
    title: `The Whispering Pines`,
    content: `In the heart of the forest, the whispering pines tell tales of old. Their needles dance in the wind, creating a hushed symphony. The forest floor, blanketed with pine cones and moss, cushions the steps of wanderers who venture into this verdant realm. As the sun sets, the trees cast long shadows, and the forest becomes a mystical world, alive with the spirits of nature.`,
    date: '2023-05-15',
    status: 'published',
    words_count: 60,
  },
  {
    teacher_id: teachers[3].id,
    title: `Echoes of the Sea`,
    content: `The sea, a vast expanse of undulating waves, speaks in hushed tones to those who listen. Its surface reflects the moods of the sky, from the fiery hues of sunrise to the somber grays of a storm. Sailors and poets alike have pondered its depths, finding both fear and fascination in its waters. The sea's timeless song is an echo of the world's heartbeat, a reminder of the eternal cycle of tides and time.`,
    date: '2023-06-21',
    status: 'draft',
    words_count: 75,
  },
  {
    teacher_id: teachers[8].id,
    title: `Under the Harvest Moon`,
    content: `As the harvest moon rises, bathing the fields in a soft, golden light, farmers toil under the night sky. The rustle of cornstalks and the rhythmic sound of threshing fill the air. This is the time of reaping, of gathering the bounty that the earth has provided. It's a time of gratitude and hard work, where each kernel of corn and strand of wheat tells a story of dedication and connection to the land. The moon's glow embraces the countryside, illuminating the faces of those who labor with love, ensuring that the fruits of their toil will nourish many.`,
    date: '2023-07-30',
    status: 'published',
    words_count: 99,
  },
  {
    teacher_id: teachers[9].id,
    title: `The Artisan's Craft`,
    content: `In the artisan's workshop, creativity takes physical form. Surrounded by tools and materials, the artisan works with skillful hands, transforming raw materials into objects of beauty and function. Each stroke of the brush, each chisel's cut, is a testament to years of practice and passion. The workshop, with its array of creations, is a sanctuary where art and craftsmanship converge, celebrating the timeless tradition of making by hand. Here, every crafted piece tells a story, a narrative woven from imagination and skill, capturing moments of inspiration in wood, clay, or paint. The artisan's craft is not just a profession; it is a dance of the hands with the heart's desires.`,
    date: '2023-08-18',
    status: 'draft',
    words_count: 110,
  },
  {
    teacher_id: teachers[9].id,
    title: `Winter's Embrace`,
    content: `Winter wraps the world in a blanket of snow, transforming the landscape into a wonderland of white. Trees stand like sentinels, their branches frosted with ice. Children laugh as they play in the snow, their breath forming clouds in the crisp air. Inside, families gather around the warmth of the hearth, sharing stories and savoring the coziness of home. Winter, with its cold touch, brings people together, reminding them of the warmth of human connection. Streets glisten under the moonlight, and the silence of a snowy night speaks volumes. Each snowflake, unique and intricate, adds to the beauty of this chilly season, creating a tapestry of frost and joy.`,
    date: '2023-09-12',
    status: 'published',
    words_count: 109,
  },
];

module.exports = {
  users,
  teachers,
  dictations,
};

// ─────────────────────────────────────────────────────────────
//  EVERYTHING PERSONAL LIVES IN THIS FILE.
//  Photos: drop files into  src/assets/photos/  and use just the
//  file name below (e.g. "photo1.jpg"). Any missing photo shows a
//  soft placeholder instead of breaking.
//  Music: put a file in  src/assets/music/  (e.g. birthday-song.mp3).
//  No file = the music button hides itself.
// ─────────────────────────────────────────────────────────────

export const birthdayData = {
  name: 'Shravani',
  age: 23,

  // Opening screen
  introLines: ['Hey Shravani...', 'Someone has a little surprise for you.'],
  introButton: 'Open your surprise',

  heroTitle: 'Happy 23rd Birthday',
  heroSubtitle: '23 looks beautiful on you already. ✨',

  // Letter — each string is one paragraph. The LAST one is highlighted.
  letterTitle: 'A Little Letter For You 💌',
  birthdayMessage: [
    'Happy 23rd Birthday, Shravani! ❤️',
    'I could have simply wished you "Happy Birthday" like everyone else...',
    'but you\'re not exactly an "everyone else" person to me.',
    'So I wanted to create something a little different.',
    'Something that keeps a few memories, a few laughs, a few wishes and a tiny reminder of how special you are.',
    'We\'ve shared so many random conversations, stupid jokes, unforgettable moments and memories that probably wouldn\'t make sense to anyone else. 😂',
    'And honestly, that\'s what makes them special.',
    'I hope 23 brings you everything you\'re hoping for — happiness, success, peace, crazy adventures, beautiful memories and countless reasons to smile.',
    'Keep being the amazing person you are.',
    'And please remember...',
    'You deserve a beautiful year ahead. ❤️',
  ],
  letterSignature: 'Your best friend',

  // Gallery — 10 to 20 photos work best. `image` is a file name in src/assets/photos/
  galleryTitle: 'Our Memories',
  gallerySubtitle: 'a few frames worth keeping',
  photos: [
    { image: 'photo1.jpg', caption: 'Night out vibes with the squad 🌙' },
    { image: 'photo2.jpg', caption: 'The birthday princess herself 👑' },
    { image: 'photo3.jpg', caption: 'Selfie with a rose — this one\'s so us 🌹' },
    { image: 'photo4.jpg', caption: 'Stunning in that black saree ✨' },
    { image: 'photo5.jpg', caption: 'Mirror selfie game strong 📸' },
    { image: 'photo6.jpg', caption: 'That smile by the window in pink 💕' },
    { image: 'photo7.jpg', caption: 'Golden hour glow-up ☀️' },
    { image: 'photo8.jpg', caption: 'Cozy sweater vibes & that smirk 😏' },
    { image: 'photo9.jpg', caption: 'Café smiles & good company ☕' },
    { image: 'photo10.jpg', caption: 'Nature queen in pink 🌸' },
    { image: 'photo11.jpg', caption: 'Christmas vibes & cake 🎄🎂' },
    { image: 'photo12.jpg', caption: 'Twirling in that dress — fairytale moment 🧚' },
    { image: 'photo13.jpg', caption: 'Date night at the rooftop café 🌿' },
    { image: 'photo14.jpg', caption: 'Temple visit looking graceful 🙏' },
    { image: 'photo15.jpg', caption: 'Birthday girl with her cake! 🎂❤️' },
    { image: 'photo16.jpg', caption: 'Beach rocks and that fearless spirit 🌊' },
    { image: 'photo17.jpg', caption: 'City lights & that stunning black dress 🖤✨' },
    { image: 'photo18.jpg', caption: 'Yellow lehenga selfie — absolute fire 🔥' },
    { image: 'photo19.jpg', caption: 'Diwali sparklers & that smile 🪔✨' },
    { image: 'photo20.jpg', caption: 'Just being goofy — classic you 😂' },
    { image: 'photo21.jpg', caption: 'Lost in thought at the restaurant 💭' },
    { image: 'photo22.jpg', caption: 'Sunset, a book, and peace — dreamy 📖🌅' },
    { image: 'photo23.jpg', caption: 'The \"I just woke up\" look 😴😂' },
    { image: 'photo24.jpg', caption: 'Mirror selfie — serving looks as always 💅' },
    { image: 'photo25.jpg', caption: 'Black saree, golden highlights — elegant ✨' },
    { image: 'photo26.jpg', caption: 'Lakeside smile — peaceful & pretty 💙' },
    { image: 'photo27.jpg', caption: 'Canyon explorer — adventure suits you 🏔️' },
    { image: 'photo28.jpg', caption: 'Red roses & that elegant gown 🌹' },
    { image: 'photo29.jpg', caption: 'Roses in hand, smile on point 💐' },
    { image: 'photo30.jpg', caption: 'Waterfall vibes — arms wide open 🌊✨' },
    { image: 'photo31.jpg', caption: 'Radha Rani look — absolutely stunning 💖' },
  ],

  // Timeline
  memoriesTitle: 'Little Moments, Big Memories',
  memoriesSubtitle: 'the ones that don\'t need a reason',
  memories: [
    {
      title: 'The Random Conversations 😂',
      description: 'Somehow a simple conversation could turn into a completely unrelated two-hour discussion.',
      image: 'photo1.jpg',
      date: '',
    },
    {
      title: 'The Laughs ❤️',
      description: 'Some memories are special simply because of who you shared them with.',
      image: 'photo15.jpg',
      date: '',
    },
    {
      title: 'The Unplanned Moments ✨',
      description: 'The best memories aren\'t always planned.',
      image: 'photo27.jpg',
      date: '',
    },
  ],

  // "Why you're special" — icon must be one of:
  // Smile, HeartHandshake, Laugh, PartyPopper, Sun, Coffee, Sparkles, Heart, Camera
  reasonsTitle: 'A Few Things That Make You... You ❤️',
  reasonsSubtitle: 'tap a card',
  reasons: [
    { icon: 'Smile', title: 'Your "Koreee"', text: 'That one word from you instantly softens everything. No matter the mood, hearing "Koreee" feels like home.' },
    { icon: 'HeartHandshake', title: 'Your Thoughtfulness', text: 'From planning birthday surprises to asking, "Kya chahiye?" before I even realize I need something — you always think of me first.' },
    { icon: 'Laugh', title: 'Your Sense of Humor', text: '"Gendu," "Chota don," "Ayee gundaa"… your ridiculous nicknames and random jokes somehow turn even boring days into our funniest memories.' },
    { icon: 'PartyPopper', title: 'Your Craziness', text: 'The way you send 50 stickers in a row, start random "sticker wars," or say completely unexpected things — life with you is never dull.' },
    { icon: 'Sun', title: 'Your Little Positivity', text: 'Even when you\'re overthinking or stressed, there\'s always that tiny spark in you that says, "Chill, sab theek ho jayega." And somehow, it does.' },
    { icon: 'Coffee', title: 'Making People Feel Comfortable', text: 'Talking to you just feels easy. No pressure, no pretending — just real, raw, and somehow always safe.' },
    { icon: 'Sparkles', title: 'Your Biryani Promises', text: '"Tujhe panda biryani khilaungi," "Cake bana ke dungi" — you don\'t just say things, you mean them. And that\'s the sweetest part.' },
  ],

  // Friendship note + heart button
  friendshipTitle: 'Just So You Know 💖',
  friendshipMessage: [
    'Some people walk into your life and quietly make it better.',
    'You\'re one of those people for me.',
    'Thank you for every laugh, every random chat, and every time you made an ordinary day feel a little more special.',
  ],
  heartButtonLabel: 'Send a little ❤️',

  // 23 wishes — keep exactly 23 (the last one gets a special card)
  wishesTitle: '23 Wishes For Your 23rd ✨',
  wishesSubtitle: 'one for every year',
  wishes: [
    'Happiness', 'Peace', 'Success', 'Confidence', 'Adventure', 'Laughter',
    'Love', 'Amazing friendships', 'New experiences', 'Beautiful memories',
    'Travel', 'Growth', 'Courage', 'Opportunities', 'Dreams coming true',
    'Self-love', 'Financial success', 'Good health', 'Endless smiles',
    'Unexpected happiness', 'Everything you\'ve been working for',
    'A year full of beautiful surprises', 'A birthday you\'ll never forget ❤️',
  ],

  // Gift
  giftTitle: 'Okay... one last thing. 🎁',
  giftButton: 'Open your gift',

  // Finale
  finalTitle: 'Happy 23rd Birthday, Shravani! 🎂❤️',
  finalQuote: 'Here\'s to another year of laughter, crazy memories, unexpected adventures, and moments we\'ll look back on and smile about.',
  finalLine: 'Keep smiling. Keep shining. Keep being you. ✨',
  finalToast: 'Here\'s to 23. 🥂❤️',

  musicLabel: 'Play Your Birthday Song',
}

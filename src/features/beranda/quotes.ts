export type KutipanIlmuwan = {
  id: number;
  quote: string;
  author: string;
  source: string;
};

/** Kutipan singkat yang dikurasi untuk rotasi pesan hero PhysLAB. */
export const KUTIPAN_ILMUWAN: KutipanIlmuwan[] = [
  {
    id: 1,
    quote: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    author: "Richard P. Feynman",
    source: "Cargo Cult Science, 1974",
  },
  {
    id: 2,
    quote: "What I cannot create, I do not understand.",
    author: "Richard P. Feynman",
    source: "Blackboard note, Caltech",
  },
  {
    id: 3,
    quote: "The imagination of nature is far, far greater than the imagination of man.",
    author: "Richard P. Feynman",
    source: "The Value of Science, 1955",
  },
  {
    id: 4,
    quote: "Science is the belief in the ignorance of experts.",
    author: "Richard P. Feynman",
    source: "What Is Science?, 1966",
  },
  {
    id: 5,
    quote: "We are trying to prove ourselves wrong as quickly as possible, because only in that way can we find progress.",
    author: "Richard P. Feynman",
    source: "The Character of Physical Law, 1964",
  },
  {
    id: 6,
    quote: "I have no special talents. I am only passionately curious.",
    author: "Albert Einstein",
    source: "Letter to Carl Seelig, 1952",
  },
  {
    id: 7,
    quote: "The most incomprehensible thing about the world is that it is comprehensible.",
    author: "Albert Einstein",
    source: "Physics & Astronomy quotations, UNH",
  },
  {
    id: 8,
    quote: "Imagination is more important than knowledge.",
    author: "Albert Einstein",
    source: "Interview, The Saturday Evening Post, 1929",
  },
  {
    id: 9,
    quote: "The whole of science is nothing more than a refinement of everyday thinking.",
    author: "Albert Einstein",
    source: "Physics & Astronomy quotations, UNH",
  },
  {
    id: 10,
    quote: "For us physicists, the distinction between past, present, and future is only an illusion.",
    author: "Albert Einstein",
    source: "Letter to the Besso family, 1955",
  },
  {
    id: 11,
    quote: "One may say the eternal mystery of the world is its comprehensibility.",
    author: "Albert Einstein",
    source: "Physics and Reality, 1936",
  },
  {
    id: 12,
    quote: "If I have seen further it is by standing on the shoulders of Giants.",
    author: "Isaac Newton",
    source: "Letter to Robert Hooke, 1675",
  },
  {
    id: 13,
    quote: "What we observe is not nature itself, but nature exposed to our method of questioning.",
    author: "Werner Heisenberg",
    source: "Physics and Philosophy, 1958",
  },
  {
    id: 14,
    quote: "All science is either physics or stamp collecting.",
    author: "Ernest Rutherford",
    source: "Attributed in Physics & Astronomy, UNH",
  },
  {
    id: 15,
    quote: "In science one tries to tell people, in such a way as to be understood by everyone, something that no one ever knew before.",
    author: "Paul A. M. Dirac",
    source: "Physics & Astronomy quotations, UNH",
  },
  {
    id: 16,
    quote: "No amount of experimentation can ever prove me right; a single experiment can prove me wrong.",
    author: "Albert Einstein",
    source: "Physics quotations, NIEHS",
  },
];

export function pilihKutipanAcak(kecualiId?: number): KutipanIlmuwan {
  const pilihan = KUTIPAN_ILMUWAN.filter((item) => item.id !== kecualiId);
  const sumber = pilihan.length > 0 ? pilihan : KUTIPAN_ILMUWAN;
  return sumber[Math.floor(Math.random() * sumber.length)];
}

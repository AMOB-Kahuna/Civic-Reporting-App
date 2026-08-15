export const categories = [
  "Infrastructure",
  "Public Safety",
  "Cleanliness",
];

export const subCategories = {
  "Infrastructure": [
    "Pothole/Road Damage",
    "Bad Road",
    "Broken Streetlight",
  ],
  "Public Safety": [
    "Suspicious Activity",
    "Reckless Driver",
    "Overflowing River"
  ],
  "Cleanliness": [
    "Illegal Dumping",
    "Bad Odour",
    "Drainage Issue"
  ]
}

export const subCategoryList = Object.values(subCategories).flat();
// console.log(subCategoryList)
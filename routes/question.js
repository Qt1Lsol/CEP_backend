// Import du package 'express'
const express = require("express");
// Appel à la fonction Router(), issue du package 'express'
const router = express.Router();

// Import du package cloudinary
const cloudinary = require("cloudinary").v2;

// Permet l'accès aux variables d'environnement
// require("dotenv").config();

// Import du model User et Offer
// afin d'éviter des erreurs (notamment dues à d'eventuelles références entre les collections)
// nous vous conseillons d'importer tous vos models dans toutes vos routes
// const User = require("../models/User");
// const Offer = require("../models/Offer");
const Question = require("../models/Question");
const Author = require("../models/Author");

// Import du middleware isAuthenticated
const isAuthenticated = require("../middleware/isAuthenticated");
const isUserAuthenticated = require("../middleware/isUserAuthenticated");

// Import des datas (ne pas en tenir compte, cela sert au reset de la BDD entre 2 sessions de formation)
// const products = require("../data/products.json");

// Route qui nous permet de récupérer une liste d'annonces, en fonction de filtres
// Si aucun filtre n'est envoyé, cette route renverra l'ensemble des annonces
// router.get("/offers", async (req, res) => {
//   try {
//     // création d'un objet dans lequel on va sotcker nos différents filtres
//     let filters = {};

//     if (req.query.title) {
//       filters.product_name = new RegExp(req.query.title, "i");
//     }

//     if (req.query.priceMin) {
//       filters.product_price = {
//         $gte: req.query.priceMin,
//       };
//     }

//     if (req.query.priceMax) {
//       if (filters.product_price) {
//         filters.product_price.$lte = req.query.priceMax;
//       } else {
//         filters.product_price = {
//           $lte: req.query.priceMax,
//         };
//       }
//     }

//     let sort = {};

//     if (req.query.sort === "price-desc") {
//       sort = { product_price: -1 };
//     } else if (req.query.sort === "price-asc") {
//       sort = { product_price: 1 };
//     }

//     let page;
//     if (Number(req.query.page) < 1) {
//       page = 1;
//     } else {
//       page = Number(req.query.page);
//     }

//     let limit = Number(req.query.limit);

//     const offers = await Offer.find(filters)
//       .populate({
//         path: "owner",
//         select: "account",
//       })
//       .sort(sort)
//       .skip((page - 1) * limit) // ignorer les x résultats
//       .limit(limit); // renvoyer y résultats

//     // cette ligne va nous retourner le nombre d'annonces trouvées en fonction des filtres
//     const count = await Offer.countDocuments(filters);

//     res.json({
//       count: count,
//       offers: offers,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// Route qui permmet de récupérer les informations d'une offre en fonction de son id
// router.get("/offer/:id", async (req, res) => {
//   try {
//     const offer = await Offer.findById(req.params.id).populate({
//       path: "owner",
//       select: "account.username account.phone account.avatar",
//     });
//     res.json(offer);
//   } catch (error) {
//     console.log(error.message);
//     res.status(400).json({ message: error.message });
//   }
// });

// get all question of an Author
router.get("/question/view", isAuthenticated, async (req, res) => {
  console.log("route question/view OK");
  console.log(req.query.search);
  console.log("author view? ==>", req.author._id);
  try {
    let filters = {};

    //requete permettant de prendre en compte les fitres ainsi que l'auteur de la question (and ... or ...)
    if (req.query.search) {
      filters.$and = [
        {
          $or: [
            { questionText: new RegExp(req.query.search, "i") },
            { description: new RegExp(req.query.search, "i") },
          ],
        },
        { author: req.author._id },
        // { latitude: new RegExp(Number(req.query.search, "i")) },
      ];
    }

    // const question = await Question.find({author: req.query.author})
    const question = await Question.find(filters);
    res.json(question);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// route qui permet de poster une nouvelle annonce
router.post("/question/publish", isAuthenticated, async (req, res) => {
  console.log("route question/publish OK");

  console.log("questionText=>", req.fields.questionText);
  console.log("description=>", req.fields.description);
  console.log("ageMin=>", req.fields.ageMin);
  console.log("ageMax=>", req.fields.ageMax);
  console.log("linkWiki=>", req.fields.linkWiki);
  console.log("linkPlace=>", req.fields.linkPlace);
  console.log("latitude=>", req.fields.latitude);
  console.log("longitude=>", req.fields.longitude);
  console.log("polygon=>", req.fields.polygon);

  console.log("req OK");

  //traitement du polygon

  function numIsPair(n) {
    return n & 1 ? false : true;
  }

  let getCoordsPolygon = (poly) => {
    let coordsTab = [];
    let res = poly.split(" ");

    for (let i = 0; i < res.length; i++) {
      res[i] = Number(res[i].replace(",", ""));

      if (numIsPair(i)) {
      } else {
        coordsTab.push([res[i - 1], res[i]]);
      }
    }

    coordsTab.push([res[0], res[1]]); //finir le polygon par le premier point

    return coordsTab;
    console.log("coordsTab=>", coordsTab);
  };

  let polygon = [];
  try {
    polygon = getCoordsPolygon(req.fields.polygon);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }

  // fin de traitement du polygon

  try {
    if (req.fields.questionText && req.fields.description) {
      // Création de la nouvelle annonce (sans l'image et sans l'audio)
      const newQuestion = new Question({
        questionText: req.fields.questionText,
        description: req.fields.description,
        ageMin: req.fields.ageMin,
        ageMax: req.fields.ageMax,
        linkWiki: req.fields.linkWiki,
        linkPlace: req.fields.linkPlace,
        location: {
          type: "Point",
          coordinates: [req.fields.longitude, req.fields.latitude],
        },
        locationAround: {
          type: "Polygon",
          coordinates: polygon,
          // coordinates: [
          //   [
          //     [0, 0],
          //     [3, 6],
          //     [6, 1],
          //     [0, 0],
          //   ],
          // ],
        },
        author: req.author,
      });

      // Vérifier le type de fichier image
      if (req.files.questionPicture.type.slice(0, 5) !== "image") {
        res.status(400).json({ message: "Vous devez envoyer une image !" });
      } else {
        // Envoi de l'image à cloudinary
        const resultPicture = await cloudinary.uploader.upload(
          req.files.questionPicture.path,
          { folder: "CultureEnPoche/questionPicture" }

          // {folder: `CultureEnPoche/questionPicture/${newQuestion._id}`}
        );

        // ajout de l'image dans newQuestion
        console.log("questionID", newQuestion._id);
        newQuestion.questionPicture = resultPicture;
      }

      console.log(req.files.questionAudio);

      // Envoi de l'image à cloudinary

      if (req.files.questionAudio.type.slice(0, 5) !== "audio") {
        res
          .status(400)
          .json({ message: "Vous devez envoyer un fichier audio !" });
      } else {
        const resultAudio = await cloudinary.uploader.upload(
          req.files.questionAudio.path,
          {
            folder: "CultureEnPoche/questionAudio",
            // folder: `CultureEnPoche/questionAudio/${newQuestion._id}`,
            resource_type: "video",
          }
        );

        // ajout de l'audio dans newQuestion
        newQuestion.questionAudio = resultAudio;
      }

      await newQuestion.save();
      res.status(200).json({ newQuestion });
    } else {
      res.status(401).json({ message: "Missing parameters" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(432).json({ message: error.message });
  }
});

//
//////////////////////////////////////// Route pour application mobile ////////////////////////////////////////////
//

// ROUTE : get 2 picture url randomly OK but do not use !
router.get("/question/getpicturealea", async (req, res) => {
  console.log("route question/getpicturealea OK");

  try {
    // const question = await Question.find({author: req.query.author})
    const questionAlea = await Question.aggregate([
      // { $match: { a: 10 } },
      { $sample: { size: 2 } },
      { $project: { _id: 0, "questionPicture.secure_url": 1 } },
    ]);

    res.json(questionAlea);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// ROUTE :  get a question near me if exist

router.post("/question/get", async (req, res) => {
  console.log("route question/get OK"); // check if route is OK
  console.log("latitude =>", req.fields.latitude); // check lat
  console.log("longitude =>", req.fields.longitude); // check log
  console.log("isCar =>", req.fields.isCar); // check log
  // console.log("longitude =>", props); // check log

  let lat = req.fields.latitude;
  let long = req.fields.longitude;

  if (req.fields.isCar) {
    maxDistanceNum = 200;
  } else {
    maxDistanceNum = 20;
  }

  try {
    const questionNear = await Question.aggregate([
      {
        locationAroud: {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
          },
        },
      },
      { $limit: 1 },
    ]);

    if (questionNear) {
      // vérifier la présence d'une question à proximité

      try {
        const questionAlea = await Question.aggregate([
          // { $match: { a: 10 } }, // Je vais devoir filtrer sur l'age de l'utilisateur par la suite
          //la 2ème aléatoire ne doit pas être identique à la première !
          { $sample: { size: 2 } },
          { $project: { _id: 0, "questionPicture.secure_url": 1 } },
        ]);

        if (questionAlea) {
          // j'ai une question et j'ai 2 images aléatoires alors je pull tout dans un obj que j'envoie au front

          const newObj = {};

          newObj["questionNear"] = questionNear;
          newObj["questionAlea"] = questionAlea;

          res.json(newObj);
        } else {
          res.status(400).json({ message: "No picture alea" }); // pas de question à proximité
        }
      } catch (error) {
        console.log("catch questionAlea =>", error.message);
        res.status(400).json({ message: error.message }); //plantage
      }
    } else {
      // pas de question a proximité
      res.status(400).json({ message: "No question" }); // pas de question à proximité
    }
  } catch (error) {
    console.log("catch questionNear =>", error.message);
    res.status(400).json({ message: error.message }); //plantage
  }
});

// // ROUTE :  get a question near me if exist
// router.post("/question/get", async (req, res) => {
//   console.log("route question/get OK"); // check if route is OK
//   console.log("latitude =>", req.fields.latitude); // check lat
//   console.log("longitude =>", req.fields.longitude); // check log
//   console.log("isCar =>", req.fields.isCar); // check log
//   // console.log("longitude =>", props); // check log

//   let lat = req.fields.latitude;
//   let long = req.fields.longitude;

//   if (req.fields.isCar) {
//     maxDistanceNum = 200;
//   } else {
//     maxDistanceNum = 20;
//   }

//   try {
//     const questionNear = await Question.aggregate([
//       {
//         $geoNear: {
//           near: { type: "Point", coordinates: [long, lat] },
//           spherical: true,
//           distanceField: "dist.calculated",
//           distanceMultiplier: 1 / 1000, //km
//           maxDistance: maxDistanceNum,
//         },
//       },
//       { $limit: 1 },
//     ]);

//     if (questionNear) {
//       // vérifier la présence d'une question à proximité

//       try {
//         const questionAlea = await Question.aggregate([
//           // { $match: { a: 10 } }, // Je vais devoir filtrer sur l'age de l'utilisateur par la suite
//           //la 2ème aléatoire ne doit pas être identique à la première !
//           { $sample: { size: 2 } },
//           { $project: { _id: 0, "questionPicture.secure_url": 1 } },
//         ]);

//         if (questionAlea) {
//           // j'ai une question et j'ai 2 images aléatoires alors je pull tout dans un obj que j'envoie au front

//           const newObj = {};

//           newObj["questionNear"] = questionNear;
//           newObj["questionAlea"] = questionAlea;

//           res.json(newObj);
//         } else {
//           res.status(400).json({ message: "No picture alea" }); // pas de question à proximité
//         }
//       } catch (error) {
//         console.log("catch questionAlea =>", error.message);
//         res.status(400).json({ message: error.message }); //plantage
//       }
//     } else {
//       // pas de question a proximité
//       res.status(400).json({ message: "No question" }); // pas de question à proximité
//     }
//   } catch (error) {
//     console.log("catch questionNear =>", error.message);
//     res.status(400).json({ message: error.message }); //plantage
//   }
// });

router.post("/question/map", async (req, res) => {
  console.log("route question/map OK"); // check if route is OK
  console.log("latitude =>", req.fields.latitude); // check lat
  console.log("longitude =>", req.fields.longitude); // check log
  // console.log("longitude =>", props); // check log

  let lat = req.fields.latitude;
  let long = req.fields.longitude;

  try {
    const mapNear = await Question.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [long, lat] },
          spherical: true,
          distanceField: "dist.calculated",
          distanceMultiplier: 1 / 1000, //km
          maxDistance: 1000,
        },
      },
    ]);

    res.json(mapNear);
  } catch (error) {
    console.log("catch map =>", error.message);
    res.status(400).json({ message: error.message }); //plantage
  }
});

// router.put("/offer/update/:id", isAuthenticated, async (req, res) => {
//     const offerToModify = await Offer.findById(req.params.id);
//     try {
//         if (req.fields.title) {
//             offerToModify.product_name = req.fields.title;
//         }
//         if (req.fields.description) {
//             offerToModify.product_description = req.fields.description;
//         }
//         if (req.fields.price) {
//             offerToModify.product_price = req.fields.price;
//         }

//         const details = offerToModify.product_details;
//         for (i = 0; i < details.length; i++) {
//             if (details[i].MARQUE) {
//                 if (req.fields.brand) {
//                     details[i].MARQUE = req.fields.brand;
//                 }
//             }
//             if (details[i].TAILLE) {
//                 if (req.fields.size) {
//                     details[i].TAILLE = req.fields.size;
//                 }
//             }
//             if (details[i].ÉTAT) {
//                 if (req.fields.condition) {
//                     details[i].ÉTAT = req.fields.condition;
//                 }
//             }
//             if (details[i].COULEUR) {
//                 if (req.fields.color) {
//                     details[i].COULEUR = req.fields.color;
//                 }
//             }
//             if (details[i].EMPLACEMENT) {
//                 if (req.fields.location) {
//                     details[i].EMPLACEMENT = req.fields.location;
//                 }
//             }
//         }

//         // Notifie Mongoose que l'on a modifié le tableau product_details
//         offerToModify.markModified("product_details");

//         if (req.files.picture) {
//             const result = await cloudinary.uploader.upload(req.files.picture.path, {
//                 public_id: `api/vinted/offers/${offerToModify._id}/preview`,
//             });
//             offerToModify.product_image = result;
//         }

//         await offerToModify.save();

//         res.status(200).json("Offer modified succesfully !");
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).json({ error: error.message });
//     }
// });

//Delete a quesiton
router.delete("/question/delete/:id", isAuthenticated, async (req, res) => {
  try {
    // //Je supprime ce qui il y a dans le dossier
    // await cloudinary.api.delete_resources_by_prefix(
    //     `api/vinted/offers/${req.params.id}`
    // );
    // //Une fois le dossier vide, je peux le supprimer !
    // await cloudinary.api.delete_folder(`api/vinted/offers/${req.params.id}`);

    // questionToDelete = await Question.findById(req.params.id);

    await questionToDelete.delete();

    res.status(200).json("Question deleted succesfully !");
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

// // CETTE ROUTE SERT AU RESET DE LA BDD ENTRE 2 SESSIONS DE FORMATION. CELA NE FAIT PAS PARTIE DE L'EXERCICE.
// // RESET ET INITIALISATION BDD
// router.get("/reset-offers", async (req, res) => {
//     const allUserId = await User.find().select("_id");
//     // Il y a 21 users dans le fichier owners.json
//     if (allUserId.length > 21) {
//         return res
//             .status(400)
//             .send(
//                 "Il faut d'abord reset la BDD de users. Voir la route /reset-users"
//             );
//     } else {
//         // Vider la collection Offer
//         await Offer.deleteMany({});

//         // Supprimer les images du dossier "api/vinted/offers" sur cloudinary
//         try {
//             await cloudinary.api.delete_resources_by_prefix("api/vinted/offers");
//         } catch (error) {
//             console.log("deleteResources ===>  ", error.message);
//         }

//         // Créer les annonces à partir du fichier products.json
//         for (let i = 0; i < products.length; i++) {
//             try {
//                 // Création de la nouvelle annonce
//                 const newOffer = new Offer({
//                     product_name: products[i].product_name,
//                     product_description: products[i].product_description,
//                     product_price: products[i].product_price,
//                     product_details: products[i].product_details,
//                     // créer des ref aléatoires
//                     owner: allUserId[Math.floor(Math.random() * allUserId.length + 1)],
//                 });

//                 // Uploader l'image principale du produit
//                 const resultImage = await cloudinary.uploader.upload(
//                     products[i].product_image.secure_url,
//                     {
//                         folder: `api/vinted/offers/${newOffer._id}`,
//                         public_id: "preview",
//                     }
//                 );

//                 // Uploader les images de chaque produit
//                 newProduct_pictures = [];
//                 for (let j = 0; j < products[i].product_pictures.length; j++) {
//                     try {
//                         const resultPictures = await cloudinary.uploader.upload(
//                             products[i].product_pictures[j].secure_url,
//                             {
//                                 folder: `api/vinted/offers/${newOffer._id}`,
//                             }
//                         );

//                         newProduct_pictures.push(resultPictures);
//                     } catch (error) {
//                         console.log("uploadCloudinaryError ===> ", error.message);
//                     }
//                 }

//                 newOffer.product_image = resultImage;
//                 newOffer.product_pictures = newProduct_pictures;

//                 await newOffer.save();
//                 console.log(`✅ offer saved : ${i + 1} / ${products.length}`);
//             } catch (error) {
//                 console.log("newOffer error ===> ", error.message);
//             }
//         }
//         res.send("Done !");
//         console.log(`🍺 All offers saved !`);
//     }
// });

module.exports = router;

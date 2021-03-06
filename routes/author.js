// Import du package 'express'
const express = require("express");
// Appel à la fonction Router(), issue du package 'express'
const router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated")

// uid2 et crypto-js sont des packages qui vont nous servir à encrypter le mot de passe
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import du package cloudinary
const cloudinary = require("cloudinary").v2;

// Package qui permet de générer des données aléatoires (ne pas en tenir compte, cela sert à réinitiliser la BDD entre 2 sessions de formation)
// const faker = require("faker");
// faker.locale = "fr";
// const owners = require("../data/owners.json");

// Import du model User et Offer
// afin d'éviter des erreurs (notamment dues à d'eventuelles références entre les collections)
// nous vous conseillons d'importer touts vos models dans toutes vos routes
//
// nous avons besoin de User pour effectuer une recherche dans la BDD
// afin de savoir :
// - si un utilisateur ayant le même email existe déjà ou pas (route signup)
// - quel est l'utilisateur qui souhaite se connecter (route login)
// const User = require("../models/User");
// const Offer = require("../models/Offer");

const Author = require("../models/Author");

// Author signup
router.post("/author/signup", async (req, res) => {
    try {
        // Recherche dans la BDD. Est-ce qu'un utilisateur possède cet email ?
        const author = await Author.findOne({ email: req.fields.email });

        // Si oui, on renvoie un message et on ne procède pas à l'inscription
        if (author) {
            res.status(409).json({ message: "This email already has an account" });

            // sinon, on passe à la suite...
        } else {
            // l'utilisateur a-t-il bien envoyé les informations requises ?
            if (req.fields.email && req.fields.password && req.fields.confirmPassword) {
                // Si oui, on peut créer ce nouvel utilisateur

                // Étape 1 : encrypter le mot de passe
                // Générer le token et encrypter le mot de passe
                const token = uid2(64);
                const salt = uid2(64);
                const hash = SHA256(req.fields.password + salt).toString(encBase64);

                // Étape 2 : créer le nouvel utilisateur
                const newAuthor = new Author({
                    email: req.fields.email,
                    token: token,
                    hash: hash,
                    salt: salt,

                });

                // Étape 3 : sauvegarder ce nouvel utilisateur dans la BDD
                await newAuthor.save();
                res.status(200).json({
                    _id: newAuthor._id,
                    email: newAuthor.email,
                    token: newAuthor.token,
                });
            } else {
                // l'utilisateur n'a pas envoyé les informations requises ?
                res.status(401).json({ message: "Missing parameters" });
            }
        }
    } catch (error) {
        console.log(error.message);
        res.status(444).json({ message: error.message });
    }
});

// Update Author profil
router.put("/author/update", isAuthenticated, async (req, res) => {
    const authorToModify = await Author.findById(req.params.id);
    try {
      if (req.fields.email) {
        authorToModify.email = req.fields.email;
      }

      if (req.fields.password) {
        authorToModify.password = req.fields.password;
      }

      if (req.fields.entityType) {
        authorToModify.entityType = req.fields.entityType;
      }

      if (req.fields.businessName) {
        authorToModify.businessName = req.fields.businessName;
      }
      if (req.fields.naf) {
        authorToModify.naf = req.fields.naf;
      }
  
      // Notifie Mongoose que l'on a modifié le tableau product_details
    //   authorToModify.markModified("product_details");
  
      await authorToModify.save();
  
      res.status(200).json("Author modified succesfully !");
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ error: error.message });
    }
  });

// Author login
router.post("/author/login", async (req, res) => {
    try {
        const author = await Author.findOne({ email: req.fields.email });

        if (author) {
            // Est-ce qu'il a rentré le bon mot de passe ?
            // req.fields.password
            // user.hash
            // user.salt
            if (
                SHA256(req.fields.password + author.salt).toString(encBase64) ===
                author.hash
            ) {
                res.status(200).json({
                    _id: author._id,
                    token: author.token,
                    author: author.email,
                });
            } else {
                res.status(401).json({ error: "Unauthorized" });
            }
        } else {
            res.status(401).json({ message: "Author not found" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ message: error.message });
    }
});

module.exports = router;

router.post("/question/get", async (req, res) => {
    console.log("route question/get OK"); // check if route is OK
    console.log("latitude =>", req.fields.latitude); // check lat
    console.log("longitude =>", req.fields.longitude); // check log
    // console.log("longitude =>", props); // check log
  
    let lat = req.fields.latitude;
    let long = req.fields.longitude;
  
    try {
      const questionNear = await Question.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [long, lat] },
            spherical: true,
            distanceField: "dist.calculated",
            distanceMultiplier: 1 / 1000, //km
          },
        },
        { $limit: 1 },
      ]);
  
      if (questionNear) {
        // vérifier la présence d'une question à proximité
  
        try {
          const questionAlea = await Question.aggregate([
            // { $match: { a: 10 } }, // Je vais devoir filtrer sur l'age de l'utilisateur par la suite
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
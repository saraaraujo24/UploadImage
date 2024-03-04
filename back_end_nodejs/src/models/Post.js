const mongoose = require("mongoose");


//o que vai armazenar no banco de dados//

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
  
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  

  
  module.exports = mongoose.model("Post", PostSchema);
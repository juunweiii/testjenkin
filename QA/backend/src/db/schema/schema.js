const mongoose = require("mongoose");

// User schema
const usersSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, sparse: true },
    email: { type: String, unique: true, required: true },
    isBanned: { type: Boolean, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    role: { 
        type: String, 
        enum: {
            values: ["user", "admin", "moderator"],
            message: "{VALUE} is not allowed"
        }, 
        required: true },
}, { 
    timestamps: true ,
    toJSON: { 
        virtuals: true, 
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
    toObject: { 
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
}); 

usersSchema.alias("_id", "usersId");

const topicsSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    description: String,
    // subTopicsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubTopics "}], // check if needed
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
}, { 
    virtuals: {
        creator: {
            options: {
                ref: "Users",
                localField: "createdBy",
                foreignField: "_id",
                justOne: true,
            }
        },
        updater: {
            options: {
                ref: "Users",
                localField: "updatedBy",
                foreignField: "_id",
                justOne: true,
            }
        }
    },
    timestamps: true,
    toJSON: { 
        virtuals: true, 
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
    toObject: { 
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
});

topicsSchema.alias("_id", "topicsId");
        

const likesSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
    usersLike: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users "}],
    usersDislike: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
}, {
    virtuals: {
        likers: {
            options: {
                ref: "Users",
                localField: "usersLike",
                foreignField: "_id",
            }
        },
        dislikers: {
            options: {
                ref: "Users",
                localField: "usersDislike",
                foreignField: "_id",
            }
        },
    },
    timestamps: true,
    toJSON: { 
        virtuals: true, 
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
    toObject: { 
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
});

likesSchema.alias("_id", "likesId");

const subTopicsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    like: likesSchema,
    topicsId: { type: mongoose.Schema.Types.ObjectId, ref: "Topics", required: true },
    // threadsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Threads"}], // check if needed
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
}, { 
    virtuals: {
        topics: {
            options: {
                ref: "Topics",
                localField: "topicsId",
                foreignField: "_id",
                justOne: true,
            }
        },
        creator: {
            options: {
                ref: "Users",
                localField: "createdBy",
                foreignField: "_id",
                justOne: true,
            }
        },
        updater: {
            options: {
                ref: "Users",
                localField: "updatedBy",
                foreignField: "_id",
                justOne: true,
            }
        }
    },
    timestamps: true,
    toJSON: { 
        virtuals: true, 
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
    toObject: { 
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
});

subTopicsSchema.alias("_id", "subTopicsId");

const threadsSchema = new mongoose.Schema({
    content: { type: String, required: true },
    like: likesSchema,
    subTopicsId: { type: mongoose.Schema.Types.ObjectId, ref: "SubTopics", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" , required: true},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" , required: true},
}, { 
    virtuals: {
        subTopics: {
            options: {
                ref: "SubTopics",
                localField: "subTopicsId",
                foreignField: "_id",
                justOne: true,
            }
        },
        creator: {
            options: {
                ref: "Users",
                localField: "createdBy",
                foreignField: "_id",
                justOne: true,
            }
        },
        updater: {
            options: {
                ref: "Users",
                localField: "updatedBy",
                foreignField: "_id",
                justOne: true,
            }
        }
    },
    timestamps: true,
    toJSON: { 
        virtuals: true, 
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
    toObject: { 
        virtuals: true,
        versionKey: false,
        transform: function(doc, ret) {
            delete ret._id;
            delete ret.id;
        }
    },
});

threadsSchema.alias("_id", "threadsId");

module.exports = {
    usersSchema: usersSchema,
    topicsSchema: topicsSchema,
    subTopicsSchema: subTopicsSchema,
    threadsSchema: threadsSchema,
    likesSchema: likesSchema,
}
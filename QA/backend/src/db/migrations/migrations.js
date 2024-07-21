"use strict"

require("@dotenvx/dotenvx").config()
const path = require("path");
const mongoose = require("mongoose");
const { createDbInstance } = require(path.join(__dirname, "../config/mongo"));
const model = require(path.join(__dirname, "../model/model"))
const to = require("await-to-js").default;


// Initialise DB
const mon = createDbInstance();
main().catch( err => console.log(err) );

async function main() {
    // drops current database
    const conn = await mongoose.createConnection(process.env.DB_SUPER_URL);
    const collections = await conn.listCollections();
    let exists = false;

    for (const collection of collections) {
        if (collection.name === "casbin_rule" && collection.type === "collection") {
            // Do additional migrations rather than full teardown
            exists = true;
        }
    }

    const users = await conn.db.collection("users").findOne({ email: process.env.ADMIN_EMAIL });
    if (users === null || users === undefined) {
        // Perform full teardown on different environment
        await conn.dropDatabase();

        await createUsers().catch( err => console.log(err) );
        await createTopics().catch( err => console.log(err) );
        await createSubTopics().catch( err => console.log(err) );
        await createThreads().catch( err => console.log(err) );
    }

    if (!exists) {
        // Perform full teardown
        await conn.dropDatabase();

        await createUsers().catch( err => console.log(err) );
        await createTopics().catch( err => console.log(err) );
        await createSubTopics().catch( err => console.log(err) );
        await createThreads().catch( err => console.log(err) );
    }

    // Force reset migration if full is supplied as argument
    if (process.argv[2] === "full") {
        await conn.dropDatabase();

        await createUsers().catch( err => console.log(err) );
        await createTopics().catch( err => console.log(err) );
        await createSubTopics().catch( err => console.log(err) );
        await createThreads().catch( err => console.log(err) );
    }
    

    process.exit();
}

async function createUsers() {

    const Users = model.usersModel;

    const testadmin = new Users({
        username: process.env.ADMIN_USERNAME,
        password: String(process.env.ADMIN_PASSWORD),
        profilePicture: process.env.ADMIN_PROFILE_PICTURE,
        email: process.env.ADMIN_EMAIL,
        role: process.env.ADMIN_ROLE,
        createdBy: "system",
        updatedBy: new mongoose.Types.ObjectId(),
        isBanned: false,
    });

    const testuser = new Users({
        username: process.env.USER_USERNAME,
        password: String(process.env.USER_PASSWORD),
        profilePicture: process.env.USER_PROFILE_PICTURE,
        email: process.env.USER_EMAIL,
        role: process.env.USER_ROLE,
        createdBy: "system",
        updatedBy: new mongoose.Types.ObjectId(),
        isBanned: false,
    });

    const testmoderator = new Users({
        username: process.env.MOD_USERNAME,
        password: String(process.env.MOD_PASSWORD),
        profilePicture: process.env.MOD_PROFILE_PICTURE,
        email: process.env.MOD_EMAIL,
        role: process.env.MOD_ROLE,
        createdBy: "system",
        updatedBy: new mongoose.Types.ObjectId(parseInt(0)),
        isBanned: false,
    });

    
    let testUserData = await testuser.save();
    let testAdminData = await testadmin.save();
    let testModeratorData = await testmoderator.save();

    let data = await Users.findOneAndUpdate({ usersId: testUserData.usersId }, { updatedBy: testUserData.usersId })
                    .setOptions({ translateAliases: true });
    data = await Users.findOneAndUpdate({ usersId: testAdminData.usersId }, { updatedBy: testAdminData.usersId })
                    .setOptions({ translateAliases: true });
    data = await Users.findOneAndUpdate({ usersId: testModeratorData.usersId }, { updatedBy: testModeratorData.usersId })
                    .setOptions({ translateAliases: true });
}

async function createTopics() {
    let err, data;
    const Topics = model.topicsModel;
    const Users = model.usersModel;

    // Retrieve new migrated data values
    [err, data] = await to(Users.find({ username: process.env.ADMIN_USERNAME }));
    if (err) return err;

    const techTopic = new Topics({
        title: "IT",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        createdBy: data[0]._id,
        updatedBy: data[0]._id,
    });

    await techTopic.save()
}

async function createSubTopics() {
    let err, data, adminData, usersData;
    const SubTopics = model.subTopicsModel;
    const Topics = model.topicsModel;
    const Users = model.usersModel;

    // Retrieve new migrated data values
    [err, data] = await to(Topics.find({ title: "IT" }).select("title"));
    if (err) return err;
    [err, adminData] = await to(Users.find({ username: process.env.ADMIN_USERNAME }));
    if (err) return err;
    [err, usersData] = await to(Users.find({}));

    const question1 = new SubTopics({
        title: "Why is IT?",
        description: "IT?",
        like: { 
            count: 1, 
            usersLike: [usersData[0]._id],
            usersDislike: [],
        },
        topicsId: data[0]._id.toHexString(),
        createdBy: adminData[0]._id.toHexString(),
        updatedBy: adminData[0]._id.toHexString(),
    });

    const question2 = new SubTopics({
        title: "What is IT?",
        description: "IT again?",
        like: { 
            count: 1, 
            usersLike: [usersData[0]._id],
            usersDislike: [usersData[1]._id],
        },
        topicsId: data[0]._id.toHexString(),
        createdBy: adminData[0]._id.toHexString(),
        updatedBy: adminData[0]._id.toHexString(),
    });

    await question1.save();
    await question2.save();
}

async function createThreads() {
    let err, data, usersData;
    const Users = model.usersModel;
    const SubTopics = model.subTopicsModel;
    const Threads = model.threadsModel;

    [err, data] = await to(SubTopics.find({}));
    if (err) return err;
    [err, usersData] = await to(Users.find({}));
    if (err) return err;

    const reply1 = new Threads({
        content: "IT no why.",
        like: { count: 0, users: [] },
        subTopicsId: data[0]._id,
        createdBy: usersData[0]._id,
        updatedBy: usersData[0]._id,
    });
    const reply2 = new Threads({
        content: "IT is IT.",
        like: { count: 1, usersLike: [usersData[1]._id]},
        subTopicsId: data[1]._id,
        createdBy: usersData[1]._id,
        updatedBy: usersData[1]._id,
    });

    await reply1.save();
    await reply2.save();
}

module.exports = { }